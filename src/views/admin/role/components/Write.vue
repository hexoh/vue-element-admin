<script setup lang="tsx">
import { Form, type FormSchema } from '@/components/form'
import { useForm } from '@/hooks/web/useForm'
import { type PropType, reactive, watch, ref, unref, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTree, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { getMenuListApi } from '@/api/menu'
import { filter } from '@/utils/tree'
import { convertType2ToPermissions } from '@/utils/permissions'
import { getRoleDetailApi } from '@/api/role/index'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const treeRef = ref<typeof ElTree>()

const formSchema = ref<FormSchema[]>([
  {
    field: 'roleName',
    label: t('role.roleName'),
    component: 'Input',
    componentProps: {
      disabled: false
    }
  },
  {
    field: 'comment',
    label: '备注',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 2
    }
    //value: props.currentRow.comment
  },
  {
    field: 'menu',
    label: t('role.menu'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex w-full">
                <div class="flex-1">
                  <ElTree
                    ref={treeRef}
                    show-checkbox
                    node-key="permissionId"
                    highlight-current
                    check-strictly={false}
                    expand-on-click-node={true}
                    data={treeData.value}
                    onNode-click={nodeClick}
                  >
                    {{
                      default: (data: { data: { meta: { title: any } } }) => {
                        return <span>{data.data.meta.title}</span>
                      }
                    }}
                  </ElTree>
                </div>
                <div class="flex-1">
                  {unref(currentTreeData) && unref(currentTreeData)?.permissionList ? (
                    <ElCheckboxGroup v-model={unref(currentTreeData).meta.permission}>
                      {unref(currentTreeData)?.permissionList.map((v: any) => {
                        return <ElCheckbox value={v}>{v.label}</ElCheckbox>
                      })}
                    </ElCheckboxGroup>
                  ) : null}
                </div>
              </div>
            </>
          )
        }
      }
    }
  }
])

const currentTreeData = ref()
const nodeClick = (treeData: any) => {
  currentTreeData.value = treeData
}

const rules = reactive({
  roleName: [required()],
  role: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

function buildPermissionByTraveseTree(node: any, ids: string | any[]) {
  if (node.permissionList && node.permissionList.length > 0) {
    for (let i = 0; i < ids.length; ++i) {
      const idx = node.permissionList.findIndex((item: { id: any }) => item.id === ids[i])
      if (idx >= 0) {
        const meta = { ...node.meta }
        if (meta.permission && meta.permission.length > 0) {
          meta.permission.push(node.permissionList[idx])
        } else {
          meta.permission = [node.permissionList[idx]]
        }
        node.meta = meta
      }
    }
  }
  if (node.children && node.children.length > 0) {
    node.children.forEach((item: any) => {
      buildPermissionByTraveseTree(item, ids)
    })
  }
}

function removeDisabledItem(arr: any[]) {
  if (!arr || arr.length == 0) {
    return
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].status !== 0) {
      arr.splice(i, 1)
      i-- // 删除后索引要回退
    }
  }
  arr.forEach((child) => {
    if (child.children && child.children.length > 0) {
      removeDisabledItem(child.children)
    }
  })
}

const treeData = ref<any[]>([])
const getMenuList = async () => {
  const res = await getMenuListApi()
  if (res) {
    const td = convertType2ToPermissions(res.data.list)
    removeDisabledItem(td)
    treeData.value = td
    if (!props.currentRow) return
    await nextTick()

    const curRole = await getRoleDetailApi(props.currentRow.roleId)
    /*
    eachTree(props.currentRow.menu, (v) => {
      checked.push({
        id: v.id,
        permission: v.meta?.permission || []
      })
    })
    eachTree(treeData.value, (v) => {
      const index = findIndex(checked, (item) => {
        return item.id === v.id
      })
      if (index > -1) {
        const meta = { ...(v.meta || {}) }
        meta.permission = checked[index].permission
        v.meta = meta
      }
    })*/
    const permisionIds = curRole.data.permissionIds
    for (const item of permisionIds) {
      unref(treeRef)?.setChecked(item, true, false)
    }
    treeData.value.forEach((item) => {
      buildPermissionByTraveseTree(item, permisionIds)
    })
    // unref(treeRef)?.setCheckedKeys(
    //   checked.map((v) => v.id),
    //   false
    // )
  }
}
getMenuList()

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    console.log(`formData = ${JSON.stringify(formData)}`)
    const checkedKeys = unref(treeRef)?.getCheckedKeys() || []
    const data = filter(unref(treeData), (item: any) => {
      return checkedKeys.includes(item.permissionId)
    })
    formData.menu = data || []
    console.log(formData)
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
