<script setup lang="tsx">
import { ContentWrap } from '@/components/content-wrap'
import { Search } from '@/components/search'
import { Dialog } from '@/components/dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, type TableColumn } from '@/components/table'
import type { FormSchema } from '@/components/form'
import type { DescriptionsSchema } from '@/components/descriptions'
import {
  getAdminAreaApi,
  getDepartmentTableApi,
  saveDepartmentApi,
  deleteDepartmentApi,
  getCurrentAdminArea
} from '@/api/dept'
import type { DepartmentItem } from '@/api/dept/types'
import { useTable } from '@/hooks/web/useTable'
import { ref, unref, reactive, onMounted } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { BaseButton } from '@/components/button'
import type { TreeInstance } from 'element-plus'
import { ElTree } from 'element-plus'

const ids = ref<string[]>([])

const disabledDeptIds: number[] = JSON.parse(localStorage.getItem('qzDeptDisabledList') || '[]')

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getDepartmentTableApi({
      pageNum: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    if (res.data.list) {
      res.data.list.forEach((it: { id: number; disabled: boolean }) => {
        if (disabledDeptIds.includes(it.id)) {
          it.disabled = true
        } else {
          it.disabled = false
        }
      })
    }
    return {
      list: res.data.list,
      total: res.data.totalCount
    }
  },
  fetchDelApi: async () => {
    const res = await deleteDepartmentApi(unref(ids))
    return !!res
  }
})

const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const searchParams: any = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}

const { t } = useI18n()

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index'
  },
  {
    field: 'fullName',
    label: '部门全称'
  },
  {
    field: 'creditCode',
    label: '社会信用代码'
  },
  {
    field: 'shortName',
    label: '部门简称'
  },
  {
    field: 'createTime',
    label: t('tableDemo.displayTime')
  },
  {
    field: 'comment',
    label: '备注'
  },
  {
    field: 'disabled',
    label: '状态',
    slots: {
      default: (data: any) => {
        const row = data.row
        return <span>{row.disabled ? '已禁用' : '正常'}</span>
      }
    }
  },
  {
    field: 'action',
    width: '380px',
    label: t('tableDemo.action'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <BaseButton type="warning" plain size="small" onClick={() => action(data.row, 'edit')}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton plain size="small" onClick={() => action(data.row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
            <BaseButton
              type={!data.row.disabled ? 'danger' : 'info'}
              plain
              size="small"
              onClick={() => disableDept(data.row)}
            >
              {!data.row.disabled ? '禁用' : '解禁'}
            </BaseButton>
            <BaseButton type="danger" plain size="small" onClick={() => delData(data.row)}>
              {t('exampleDemo.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'fullName',
    label: '部门全称',
    component: 'Input'
  },
  {
    field: 'disabled',
    label: '状态',
    component: 'Input'
  }
])

const formSchema = reactive<FormSchema[]>([
  {
    field: 'fullName',
    label: '部门全称',
    component: 'Input'
  },
  {
    field: 'creditCode',
    label: '社会信用代码',
    component: 'Input'
  },
  {
    field: 'shortName',
    label: '部门简称',
    component: 'Input'
  },
  {
    field: 'comment',
    label: '备注',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 2
    },
    colProps: {
      span: 24
    }
  }
])

const detailSchema = reactive<DescriptionsSchema[]>([
  {
    field: 'fullName',
    label: '部门全称'
  },
  {
    field: 'creditCode',
    label: '社会信用代码'
  },
  {
    field: 'shortName',
    label: '部门简称'
  },
  {
    field: 'createTime',
    label: t('tableDemo.displayTime')
  },
  {
    field: 'comment',
    label: '备注',
    slots: {
      default: (data: any) => {
        return <>{data.comment}</>
      }
    }
  },
  {
    field: 'disabled',
    label: '状态'
  }
])

// 禁用按钮处理函数
const disableDept = (row: any) => {
  const disabled = !row.disabled
  if (disabled) {
    disabledDeptIds.push(row.id)
  } else {
    const index = disabledDeptIds.indexOf(row.id)
    if (index !== -1) {
      disabledDeptIds.splice(index, 1)
    }
  }
  localStorage.setItem('qzDeptDisabledList', JSON.stringify(disabledDeptIds))
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentItem | null>(null)
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = null
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)

const delData = async (row: DepartmentItem | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentItem) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = (row: DepartmentItem, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    formData.adminAreaId = curSelAdminAreaId.value
    const res = await saveDepartmentApi(formData)
      .catch(() => {})
      .finally(() => {
        saveLoading.value = false
      })
    if (res) {
      dialogVisible.value = false
      currentPage.value = 1
      getList()
    }
  }
}

const treeRef: any = ref<TreeInstance>()
const curSelKey = ref(0)
const defExpKeys = ref<number[]>([])
const loadedRoot = ref(false)

const props = {
  label: 'name',
  children: 'zones',
  isLeaf: 'leaf'
}

const loadNode = async (node: { level: number; data: any }, resolve: (arg0: any[]) => void) => {
  try {
    if (node.level === 0) {
      const currentAreaRes = await getCurrentAdminArea()
      const currentArea = currentAreaRes.data as any

      const root: any = {
        name: currentArea.name,
        id: currentArea.id,
        lv: currentArea.lv,
        code: currentArea.code,
        leaf: false
      }

      curSelKey.value = currentArea.id
      defExpKeys.value = [currentArea.id]

      // 立即加载第一级子节点
      const res = await getAdminAreaApi(currentArea.id)
      const children = res.data.list.map((item) => Object.assign(item, { leaf: item.lv === 3 }))

      root.zones = children

      resolve([root])
      loadedRoot.value = true
    } else {
      const nd = node.data
      if (nd.lv === 3) {
        return resolve([])
      }
      const res = await getAdminAreaApi(nd.id)
      const childAreas = res.data.list.map((item) => Object.assign(item, { leaf: item.lv === 3 }))
      resolve(childAreas)
    }
  } catch (error) {
    console.error('加载区域数据失败:', error)
    resolve([])
  }
}

const ensureTreeExpanded = async () => {
  await initCurrentArea()
  if (treeRef.value && !loadedRoot.value) {
    treeRef.value.setCurrentKey(curSelKey.value)
    const node = treeRef.value.getNode(curSelKey.value)
    if (node && !node.expanded) {
      node.expand()
    }
  }
}

const curSelAdminAreaId = ref(0)

function onNodeClick(nodeObj: { id: number }) {
  console.log(`onNodeClick - ${nodeObj.id}`)
  searchParams.value['adminAreaId'] = nodeObj.id
  curSelAdminAreaId.value = nodeObj.id
  getList()
}

const initCurrentArea = async () => {
  try {
    const res = await getCurrentAdminArea()
    searchParams.value.adminAreaId = res.data.id
    curSelAdminAreaId.value = res.data.id
    getList()
  } catch (error) {
    console.error('获取当前区域失败:', error)
  }
}

onMounted(() => {
  ensureTreeExpanded()
})
</script>

<template>
  <div class="flex w-100% h-100%">
    <ContentWrap class="w-250px">
      <el-tree
        ref="treeRef"
        :props="props"
        :load="loadNode"
        node-key="id"
        :current-node-key="curSelKey"
        :default-expanded-keys="defExpKeys"
        style="max-width: 600px"
        highlight-current
        lazy
        @node-click="onNodeClick"
      />
    </ContentWrap>
    <ContentWrap class="flex-[3] ml-20px">
      <div class="mb-10px flex justify-between items-center header-container">
        <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />
        <div style="display: flex; align-items: start">
          <BaseButton type="primary" :disabled="curSelAdminAreaId === 0" @click="AddAction">
            添加
          </BaseButton>
          <BaseButton :loading="delLoading" type="danger" plain @click="delData(null)">
            {{ t('exampleDemo.del') }}
          </BaseButton>
        </div>
      </div>

      <Table
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        :columns="tableColumns"
        :data="dataList"
        :loading="loading"
        :pagination="{
          total: total
        }"
        @register="tableRegister"
      />
    </ContentWrap>

    <Dialog v-model="dialogVisible" :title="dialogTitle">
      <Write
        v-if="actionType !== 'detail'"
        ref="writeRef"
        :form-schema="formSchema"
        :current-row="currentRow"
      />

      <Detail
        v-if="actionType === 'detail'"
        :detail-schema="detailSchema"
        :current-row="currentRow"
      />

      <template #footer>
        <BaseButton
          v-if="actionType !== 'detail'"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ t('exampleDemo.save') }}
        </BaseButton>
        <BaseButton plain @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
      </template>
    </Dialog>
  </div>
</template>
