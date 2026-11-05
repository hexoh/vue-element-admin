<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { getMenuListApi, updateMenuListApi, addMenuListApi, deleteMenuApi } from '@/api/menu'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, type TableColumn } from '@/components/table'
import { ElTag, ElMessage, ElMessageBox } from 'element-plus'
import { Icon } from '@/components/icon'
import { ContentWrap } from '@/components/content-wrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/dialog'
import { BaseButton } from '@/components/button'
import { convertType2ToPermissions } from '@/utils/permissions'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await getMenuListApi()
    return {
      list: convertType2ToPermissions(res.data.list) || []
    }
  }
})

const { dataList, loading } = tableState
const { getList } = tableMethods

// 删除菜单
const handleDeleteMenu = (row: any) => {
  ElMessageBox.confirm('确定要删除这个菜单吗？删除后不能恢复，且会删除所有子菜单', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteMenuApi(row.permissionId)
      .then(() => {
        ElMessage.success('删除成功')
        getList()
      })
      .catch(() => {
        ElMessage.error('删除失败')
      })
  })
}

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'meta.title',
    label: t('menu.menuName'),
    slots: {
      default: (data: any) => {
        const title = data.row.meta.title
        return <>{title}</>
      }
    }
  },
  {
    field: 'meta.icon',
    label: t('menu.icon'),
    slots: {
      default: (data: any) => {
        const icon = data.row.meta.icon
        if (icon) {
          return (
            <>
              <Icon icon={icon} />
            </>
          )
        } else {
          return null
        }
      }
    }
  },
  {
    field: 'component',
    label: t('menu.component'),
    slots: {
      default: (data: any) => {
        const component = data.row.component
        return <>{component === '#' ? '顶级目录' : component === '##' ? '子目录' : component}</>
      }
    }
  },
  {
    field: 'path',
    label: t('menu.path')
  },
  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.status === 0 ? 'success' : 'danger'}>
              {data.row.status === 0 ? t('userDemo.enable') : t('userDemo.disable')}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 280,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <BaseButton
              type="primary"
              size="small"
              onClick={() => action(row, 'edit')}
              class="mr-1"
            >
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton type="info" size="small" onClick={() => action(row, 'detail')} class="mr-1">
              {t('exampleDemo.detail')}
            </BaseButton>
            <BaseButton type="danger" size="small" onClick={() => handleDeleteMenu(row)}>
              {t('exampleDemo.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

// const searchSchema = reactive<FormSchema[]>([
//   {
//     field: 'meta.title',
//     label: t('menu.menuName'),
//     component: 'Input'
//   }
// ])

// const searchParams = ref({})
// const setSearchParams = (data: any) => {
//   searchParams.value = data
//   getList()
// }

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('')

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

function isLocalGenId(id: any) {
  return typeof id === 'number'
}

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    console.log(`formData = ${formData}`)
    if (formData.permissionList) {
      const newChildren: any[] = []
      formData.permissionList.forEach((item: { label: any; value: any; id: any }) => {
        newChildren.push({
          title: item.label,
          name: item.value,
          permissionId: isLocalGenId(item.id) ? '' : item.id
        })
      })
      formData.children = newChildren
    }
    saveLoading.value = true
    let func = addMenuListApi
    if ('permissionId' in formData) {
      func = updateMenuListApi
    } else {
      formData.title = formData.meta.title
    }
    func(formData)
      .then((res: { code: number }) => {
        console.log(`res = ${res}`)
        saveLoading.value = false
        if (res.code === 0) {
          dialogVisible.value = false
          ElMessage.success('操作成功')
          getList()
        }
      })
      .catch((err: any) => {
        saveLoading.value = false
        console.log(`err = ${err}`)
      })
  }
}
</script>

<template>
  <ContentWrap>
    <div class="mb-10px flex items-center" style="justify-content: space-between">
      <!-- <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" /> -->
      <BaseButton type="primary" @click="AddAction">
        {{ t('exampleDemo.add') }}
      </BaseButton>
    </div>
    <Table
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />

    <Detail v-if="actionType === 'detail'" :current-row="currentRow" />

    <template #footer>
      <BaseButton
        v-if="actionType !== 'detail'"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        {{ t('exampleDemo.save') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>

<style scoped>
.mr-1 {
  margin-right: 4px;
}
</style>
