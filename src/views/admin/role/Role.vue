<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { getRoleListApi, updateRoleApi, createRoleApi, deleteRoleApi } from '@/api/role'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, type TableColumn } from '@/components/table'
import { ElMessage } from 'element-plus'
import { Search } from '@/components/search'
import type { FormSchema } from '@/components/form'
import { ContentWrap } from '@/components/content-wrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/dialog'
import { BaseButton } from '@/components/button'

const { t } = useI18n()

const disabledRoleIds: number[] = JSON.parse(localStorage.getItem('qzRoleDisabledList') || '[]')

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await getRoleListApi({
      searchText: unref(searchParams).roleName || '',
      pageNum: unref(tableState.currentPage),
      pageSize: unref(tableState.pageSize)
    })
    if (res.data.list) {
      res.data.list.forEach((it: { roleId: number; disabled: boolean }) => {
        if (disabledRoleIds.includes(it.roleId)) {
          it.disabled = true
        } else {
          it.disabled = false
        }
      })
    }
    return {
      list: res.data.list || [],
      total: res.data.total
    }
  }
})

const { dataList, loading, currentPage, pageSize } = tableState
const { getList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'roleName',
    label: t('role.roleName')
  },
  {
    field: 'createTime',
    label: t('tableDemo.displayTime')
  },
  {
    field: 'comment',
    label: t('userDemo.remark')
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
    label: t('userDemo.action'),
    width: 350,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <BaseButton type="warning" plain size="small" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton plain size="small" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>

            <BaseButton
              type={!row.disabled ? 'danger' : 'info'}
              plain
              size="small"
              onClick={() => disableRole(row)}
            >
              {!row.disabled ? '禁用' : '解禁'}
            </BaseButton>
            <BaseButton type="danger" plain size="small" onClick={() => delData(row)}>
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
    field: 'roleName',
    label: t('role.roleName'),
    component: 'Input',
    componentProps: {
      placeholder: '请输入角色名称'
    }
  }
])

const searchParams = ref({
  roleName: ''
})

const setSearchParams = (data: any) => {
  searchParams.value = data
  currentPage.value = 1
  getList()
}

const resetSearch = () => {
  searchParams.value = { roleName: '' }
  currentPage.value = 1
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('')

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const delData = async (row: any) => {
  const arr = ['超级管理员', '省级管理员', '管理员', '提交员', '审核员', '发布员']
  if (arr.includes(row.roleName)) {
    ElMessage.warning('不可删除内置角色')
  } else {
    deleteRoleApi(row.roleId).then(() => {
      ElMessage.success('操作成功')
      getList()
    })
  }
}

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

function traversTree(
  treeNode: { permissionId: any; meta: { permission: any[] }; children: any[] },
  ids: any[]
) {
  ids.push(treeNode.permissionId)
  if (treeNode.meta && treeNode.meta.permission && treeNode.meta.permission.length > 0) {
    treeNode.meta.permission.forEach((item) => {
      if (item) {
        ids.push(item.id)
      }
    })
  }
  if (treeNode.children && treeNode.children.length > 0) {
    treeNode.children.forEach((item) => {
      traversTree(item, ids)
    })
  }
}

function buildIds(treeRoot: any[]) {
  const ids: any[] = []
  treeRoot.forEach((item) => {
    traversTree(item, ids)
  })
  return ids
}

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    console.log(`formData = ${JSON.stringify(formData)}`)
    const ids = buildIds(formData.menu)
    const params: any = {
      roleName: formData.roleName,
      comment: formData.comment,
      permissionIds: ids
    }

    let apiCall
    if (actionType.value === 'add') {
      apiCall = createRoleApi(params)
    } else {
      params.roleId = formData.roleId
      apiCall = updateRoleApi(params)
    }

    apiCall
      .then((res) => {
        saveLoading.value = false
        if (res.code === 0) {
          dialogVisible.value = false
          ElMessage.success('操作成功')
          getList()
        }
      })
      .catch((err) => {
        console.log(err)
        saveLoading.value = false
      })
  }
}

const AddAction = () => {
  //ElMessage.warning('不能新增角色')
  dialogTitle.value = '新增'
  actionType.value = 'add'
  //currentRow.value = row
  //formData.
  dialogVisible.value = true
}

const disableRole = (row: any) => {
  const arr = ['超级管理员', '省级管理员', '管理员', '提交员', '审核员', '发布员']
  if (arr.includes(row.roleName)) {
    ElMessage.warning('不可禁用内置角色')
    return
  }
  const disabled = !row.disabled
  if (disabled) {
    disabledRoleIds.push(row.roleId)
  } else {
    const index = disabledRoleIds.indexOf(row.roleId)
    if (index !== -1) {
      disabledRoleIds.splice(index, 1)
    }
  }
  localStorage.setItem('qzRoleDisabledList', JSON.stringify(disabledRoleIds))
  getList()
}
</script>

<template>
  <ContentWrap>
    <div class="mb-10px flex justify-between items-center header-container">
      <Search :schema="searchSchema" @reset="resetSearch" @search="setSearchParams" />
      <BaseButton type="primary" @click="AddAction"> 新增角色 </BaseButton>
    </div>
    <Table
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: dataList.length,
        currentPage: currentPage,
        pageSize: pageSize
      }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />
    <Detail v-else :current-row="currentRow" />

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
