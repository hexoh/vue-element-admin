<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { ElTree } from 'element-plus'
import { getAdminAreaApi, getDepartmentTableApi, getCurrentAdminArea } from '@/api/dept'
import type { TreeInstance } from 'element-plus'

defineProps({
  showFilterInput: {
    type: Boolean,
    default: true
  }
})

const renderContent = (h: any, { node, data }: { node: any; data: any }) => {
  if (data.nodeType === 'org') {
    return h('div', { title: node.label }, [
      h('span', '🏛️'),
      h('span', { style: { color: 'blue' } }, node.label)
    ])
  } else if (data.nodeType === 'area') {
    return h('div', { title: node.label }, [h('span', '🗺️'), h('span', node.label)])
  } else if (data.nodeType === 'selfDir') {
    return h('div', { title: node.label, style: { color: 'blue' } }, [
      h('span', '🏢'),
      h('span', node.label)
    ])
  } else {
    return h('div', { title: node.label }, [h('span', node.label)])
  }
}

const props = {
  label: 'name',
  children: 'zones',
  isLeaf: 'leaf'
}

function translate_org_item(orgs: any[]) {
  orgs.forEach((item) => {
    item.name = item.fullName
    item.leaf = true
    item.value = item.id
    item.nodeType = 'org'
    item.nodeKey = `org-${item.id}`
  })
  return orgs
}

function translate_area_item(areas: any[]) {
  areas.forEach((item) => {
    item.nodeType = 'area'
    item.value = item.id
    item.nodeKey = `area-${item.id}`
    if (item.lv === 4) {
      item.leaf = true
    }
  })
  return areas
}

function buildSelfDirNode(areaId: number, lv: number) {
  return {
    name: lvName[lv]!['name'],
    selfLvOrgDir: areaId,
    nodeType: 'selfDir',
    lv,
    leaf: false,
    nodeKey: `selfDir-${areaId}`
  }
}

const lvName = [
  { level: 0 },
  { level: 1, name: '省本级' },
  { level: 2, name: '市本级' },
  { level: 3, name: '区县本级' },
  { level: 4, name: '街道本级' }
]

const filterText = ref('')
const treeRef = ref<TreeInstance>()
const curSelKey = ref<string | number>('')
const defExpKeys = ref<(string | number)[]>([])
const loadedRoot = ref(false)

const loadNode = async (node: { level: number; data: any }, resolve: (arg0: any[]) => void) => {
  try {
    if (node.level === 0) {
      // 根节点
      const currentAreaRes = await getCurrentAdminArea()
      const currentArea = currentAreaRes.data

      const root: any = {
        name: currentArea.name,
        id: currentArea.id,
        lv: currentArea.lv,
        code: currentArea.code,
        nodeType: 'area',
        nodeKey: `area-${currentArea.id}`,
        zones: [], // 添加zones属性用于存储子节点
        leaf: false // 明确设置为非叶子节点
      }

      // 根默认展开，默认选中省/市/区本级（即第一个子节点），语义上等同于父区划 id
      defExpKeys.value = [root.nodeKey]

      // 立即加载第一级子节点，顺带把本级虚拟节点预置进来，保证默认选中节点真实存在
      const res = await getAdminAreaApi(currentArea.id)
      const areaChildren = translate_area_item(res.data.list ?? [])
      const nodes: any[] = []
      let defaultNode: any = root
      if (currentArea.lv >= 1 && currentArea.lv <= 3) {
        defaultNode = buildSelfDirNode(currentArea.id, currentArea.lv)
        nodes.push(defaultNode)
      }
      nodes.push(...areaChildren)

      // 将子节点附加到根节点
      root.zones = nodes
      curSelKey.value = defaultNode.nodeKey

      resolve([root])
      loadedRoot.value = true

      // 同步给父页面真实选中的 adminAreaId，避免只高亮不同步导致新增用户缺参
      await nextTick()
      treeRef.value?.setCurrentKey(curSelKey.value)
      emit('inited', {
        adminAreaId: currentArea.id,
        adminAreaName: currentArea.name
      })
    } else {
      const nd = node.data

      if (nd.selfLvOrgDir) {
        const noPagingParam = {
          adminAreaId: nd.selfLvOrgDir,
          pageSize: 1000
        }
        const res = await getDepartmentTableApi(noPagingParam)
        resolve(translate_org_item(res.data.list))
      } else {
        const nodesToResolve: any = []
        if (nd.lv >= 1 && nd.lv <= 3) {
          nodesToResolve.push(buildSelfDirNode(nd.id, nd.lv))
        }

        const res = await getAdminAreaApi(nd.id)
        const areaNodes = translate_area_item(res.data.list)
        resolve([...nodesToResolve, ...areaNodes])
      }
    }
  } catch (error) {
    console.error('加载节点数据失败:', error)
    resolve([])
  }
}

const ensureTreeExpanded = async () => {
  if (treeRef.value && !loadedRoot.value) {
    await nextTick()
    // 设置当前选中的节点
    treeRef.value.setCurrentKey(curSelKey.value)
    // 确保节点展开
    const node = treeRef.value.getNode(curSelKey.value)
    if (node && !node.expanded) {
      node.expand()
    }
  }
}

const emit = defineEmits(['click_org', 'click_area', 'click_top', 'inited'])

function onNodeClick(
  nodeObj: { id: any; nodeType: string; fullName: any; name: any },
  node: { level: number }
) {
  console.log(`onNodeClick - ${nodeObj.id}`)
  if (node.level === 0) {
    // 点击顶级节点
    emit('click_top')
  } else if (nodeObj.nodeType === 'org') {
    console.log(`onNodeClick - ${nodeObj.fullName}`)
    emit('click_org', nodeObj, node)
  } else if (nodeObj.nodeType === 'area') {
    console.log(`onNodeClick - ${nodeObj.name}`)
    emit('click_area', nodeObj, node)
  } else if (nodeObj.nodeType === 'selfDir') {
    console.log(`onNodeClick - ${nodeObj.name}`)
    emit('click_area', nodeObj, node)
  } else {
    emit('click_area', nodeObj, node)
  }
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

interface Tree {
  [key: string]: any
}

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  if (data.nodeType === 'org') {
    return data.fullName.includes(value)
  }
  return true
}

onMounted(() => {
  ensureTreeExpanded()
})
</script>

<template>
  <el-tree
    ref="treeRef"
    :props="props"
    :load="loadNode"
    node-key="nodeKey"
    :render-content="renderContent"
    :filter-node-method="filterNode"
    :current-node-key="curSelKey"
    :default-expanded-keys="defExpKeys"
    style="max-width: 600px"
    highlight-current
    lazy
    @node-click="onNodeClick"
  />
</template>

<style>
.filter-input {
  width: 100%;
}

.area-org-tree-node {
  color: blue;
}
</style>
