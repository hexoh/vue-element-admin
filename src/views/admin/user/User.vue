<script setup lang="tsx">
import { ContentWrap } from '@/components/content-wrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, type TableColumn } from '@/components/table'
import { ref, unref, reactive } from 'vue'
import { ElText, ElTag, ElMessageBox, ElMessage } from 'element-plus'
import { getUserListApi, saveUserApi, deleteUserByIdApi, getDepartmentTableApi } from '@/api/dept'
import { type DepartmentUserItem } from '@/api/dept/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/search'
import type { FormSchema } from '@/components/form'
import type { DescriptionsSchema } from '@/components/descriptions'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/dialog'
import { getRoleListApi } from '@/api/role'
import { BaseButton } from '@/components/button'
import AdminAreaOrgTree from './components/AdminAreaOrgTree.vue'
import { resetPasswordApi } from '@/api/login'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  immediate: true,
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getUserListApi({
      orgId: curSelOrg.id,
      adminAreaId: curSelAdminArea.id,
      searchText: unref(searchParams).username || '',
      pageNum: unref(currentPage),
      pageSize: unref(pageSize)
    })
    return {
      list: res.data.list || [],
      total: res.data.totalCount || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteUserByIdApi(unref(ids))
    return !!res
  }
})

const roleOptions = ref([])
function loadRoleOptions() {
  getRoleListApi().then((res) => {
    roleOptions.value = res.data.list.map((item: { roleId: any; roleName: any }) => {
      return { roleId: item.roleId, roleName: item.roleName }
    })
  })
}
loadRoleOptions()

const orgsOptions = ref([])

async function loadOrgs() {
  const params = {
    pageNum: 1,
    pageSize: 1000,
    adminAreaId: curSelAdminArea.id
  }
  const res = await getDepartmentTableApi(params)
  orgsOptions.value = res.data?.list?.map((v: { fullName: any; id: any }) => ({
    fullName: v.fullName,
    id: v.id
  }))
}

const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'username',
    label: t('userDemo.username'),
    component: 'Input',
    componentProps: {
      placeholder: '请输入'
    }
  }
])

const searchParams = ref({
  username: ''
})

const setSearchParams = (params: any) => {
  searchParams.value = params
  currentPage.value = 1
  getList()
}

const resetSearch = () => {
  searchParams.value = { username: '' }
  currentPage.value = 1
  getList()
}

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'username',
    label: t('userDemo.username')
  },
  {
    field: 'realName',
    label: '真实姓名'
  },
  {
    field: 'adminAreaId',
    label: '所属区域',
    width: 130,
    slots: {
      default: (data: any) => {
        return <ElText>{data.row.adminAreaName}</ElText>
      }
    }
  },
  {
    field: 'orgId',
    label: '部门',
    width: 130,
    slots: {
      default: (data: any) => {
        return <ElText>{data.row.orgName}</ElText>
      }
    }
  },
  {
    field: 'roles',
    label: t('userDemo.role'),
    width: 130,
    slots: {
      default: (data: any) => {
        const roles = data.row.roles
        return <ElText>{roles?.map((role: { roleName: any }) => role.roleName).join('，')}</ElText>
      }
    }
  },
  {
    field: 'mobilePhone',
    label: '手机号码'
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 360,
    slots: {
      default: (data: any) => {
        const row = data.row as DepartmentUserItem
        return (
          <>
            <BaseButton type="warning" plain size="small" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton color="#1a5fad" plain size="small" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
            <BaseButton type="info" plain size="small" onClick={() => resetPassword(row)}>
              重置密码
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

const formSchema = reactive<FormSchema[]>([
  {
    field: 'username',
    label: t('userDemo.username'),
    component: 'Input'
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword'
  },
  {
    field: 'realName',
    label: '真实姓名',
    component: 'Input'
  },
  {
    field: 'adminAreaId',
    label: '所属区域',
    remove: true
  },
  {
    field: 'orgId',
    label: '部门',
    component: 'SelectV2',
    componentProps: {
      'value-key': 'id',
      filterable: true,
      options: orgsOptions,
      props: { label: 'fullName', value: 'id' }
    }
  },
  {
    field: 'roles',
    label: t('userDemo.role'),
    component: 'SelectV2',
    componentProps: {
      multiple: true,
      collapseTags: true,
      maxCollapseTags: 2,
      options: roleOptions,
      'value-key': 'roleId',
      props: { value: 'roleId', label: 'roleName' }
    }
  },
  {
    field: 'mobilePhone',
    label: '手机号码',
    component: 'Input'
  }
])

const detailSchema = reactive<DescriptionsSchema[]>([
  {
    field: 'username',
    label: t('userDemo.username')
  },
  {
    field: 'realName',
    label: '真实姓名'
  },
  {
    field: 'adminAreaId',
    label: '所属区域',
    slots: {
      default: (data: any) => {
        return <>{data.adminAreaName}</>
      }
    }
  },
  {
    field: 'orgId',
    label: '部门',
    slots: {
      default: (data: DepartmentUserItem) => {
        return <>{data.orgName}</>
      }
    }
  },
  {
    field: 'roles',
    label: t('userDemo.role'),
    slots: {
      default: (data: any) => {
        return (
          <>
            {data.roles.map((item: { roleName: any }, index: PropertyKey | undefined) => (
              <ElTag key={index} style="margin-right: 3px">
                {item.roleName}
              </ElTag>
            ))}
          </>
        )
      }
    }
  },
  {
    field: 'mobilePhone',
    label: '手机号码'
  }
])

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentUserItem>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  actionType.value = 'add'
  currentRow.value = undefined
  if (curSelAdminArea.id) {
    currentRow.value = {
      id: 0,
      orgId: curSelOrg.id,
      orgName: curSelOrg.name,
      adminAreaName: curSelAdminArea.name,
      adminAreaId: curSelAdminArea.id,
      username: '',
      realName: '',
      roles: []
    }
  }
  dialogVisible.value = true
}

const delLoading = ref(false)
const ids = ref<string[] | number[]>([])

const delData = async (row?: DepartmentUserItem) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentUserItem) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = (row: DepartmentUserItem, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = { ...row }
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()
const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      // 新增时用当前树选中的区划；编辑时保留行原有区划，避免被当前树选中串改
      if (actionType.value === 'add') {
        formData.adminAreaId = curSelAdminArea.id
      }
      if (formData.id === 0) {
        delete formData.id
      }
      if (formData.roles && formData.roles.length > 0) {
        if (typeof formData.roles[0] !== 'number') {
          formData.roles = formData.roles.map((role: { roleId: any }) => role.roleId)
        }
      }
      const res = await saveUserApi(formData)
      if (res) {
        currentPage.value = 1
        getList()
      }
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}

const curSelOrg: { id?: number; name: string } = reactive({
  id: undefined,
  name: ''
})
const curSelAdminArea: { id?: number; name: string } = reactive({
  id: undefined,
  name: ''
})

function onClickTreeOrgNode(
  nodeObj: any,
  node: { parent: { data: any; parent: { data: { name: string } } } }
) {
  curSelOrg.id = nodeObj.id
  curSelOrg.name = nodeObj.fullName
  if (node.parent && node.parent.data) {
    const parent = node.parent.data
    if (parent.nodeType === 'selfDir') {
      curSelAdminArea.id = parent.selfLvOrgDir
      curSelAdminArea.name = node.parent.parent.data.name
      loadOrgs()
    }
  }
  getList()
}

function onClickTreeAreaNode(
  nodeObj: {
    nodeType: string
    selfLvOrgDir: number | undefined
    name: string
    id: number | undefined
  },
  node?: { parent: { data: { name: any } } }
) {
  if (nodeObj?.nodeType === 'selfDir') {
    curSelAdminArea.id = nodeObj.selfLvOrgDir
    curSelAdminArea.name = node?.parent?.data?.name || nodeObj.name || ''
  } else {
    curSelAdminArea.id = nodeObj.id
    curSelAdminArea.name = nodeObj.name
  }
  loadOrgs()
  curSelOrg.id = undefined
  curSelOrg.name = ''
  getList()
}

// 树初始化默认选中省/市/区本级时同步 adminAreaId，避免只高亮不同步导致新增缺参
// function onTreeInited(payload: { adminAreaId: number; adminAreaName: string }) {
//   curSelAdminArea.id = payload.adminAreaId
//   curSelAdminArea.name = payload.adminAreaName
//   curSelOrg.id = undefined
//   curSelOrg.name = ''
//   loadOrgs()
//   getList()
// }

const resetPasswordReq = (password: string, id: number) => {
  const params = { password, id }
  resetPasswordApi(params).then(() => {
    ElMessage.success('密码重置成功')
  })
}

const resetPassword = (row: any) => {
  ElMessageBox.prompt('请输入重置的密码', '重置密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^.+$/,
    inputType: 'text',
    inputErrorMessage: '密码不能为空'
  })
    .then(({ value }) => {
      resetPasswordReq(value, row.id)
    })
    .catch(() => {})
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <ContentWrap class="w-250px">
      <AdminAreaOrgTree @click_org="onClickTreeOrgNode" @click_area="onClickTreeAreaNode" />
    </ContentWrap>
    <ContentWrap class="flex-[3] ml-20px">
      <div class="mb-10px flex justify-between items-center header-container">
        <Search :schema="searchSchema" @reset="resetSearch" @search="setSearchParams" />

        <div class="mb-10px">
          <BaseButton color="#1a5fad" @click="AddAction">
            {{ t('exampleDemo.add') }}
          </BaseButton>
          <BaseButton :loading="delLoading" color="#1a5fad" plain @click="delData()">
            {{ t('exampleDemo.del') }}
          </BaseButton>
        </div>
      </div>
      <Table
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :columns="tableColumns"
        :data="dataList"
        :loading="loading"
        @register="tableRegister"
        :pagination="{
          total
        }"
      />
    </ContentWrap>

    <Dialog v-if="dialogVisible" v-model="dialogVisible" :title="dialogTitle">
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
          color="#1a5fad"
          :loading="saveLoading"
          @click="save"
        >
          {{ t('exampleDemo.save') }}
        </BaseButton>
        <BaseButton color="#1a5fad" plain @click="dialogVisible = false">{{
          t('dialogDemo.close')
        }}</BaseButton>
      </template>
    </Dialog>
  </div>
</template>
