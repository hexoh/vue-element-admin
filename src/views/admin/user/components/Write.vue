<script setup lang="ts">
import { Form, type FormSchema } from '@/components/form'
import { useForm } from '@/hooks/web/useForm'
import { type PropType, reactive, watch } from 'vue'
import type { DepartmentUserItem, RoleItem } from '@/api/dept/types'
import { useValidator } from '@/hooks/web/useValidator'

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<DepartmentUserItem>,
    default: () => undefined
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  }
})

const rules = reactive({
  username: [required()],
  realName: [required()],
  mobilePhone: [required()]
  //password: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    console.log(`user edit currentRow`)
    if (!currentRow) return
    if (currentRow.roles && currentRow.roles.length && typeof currentRow.roles[0] !== 'number') {
      currentRow.roles = (currentRow.roles as RoleItem[]).map((it) => it.roleId)
    }
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
