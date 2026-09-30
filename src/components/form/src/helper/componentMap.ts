import type { Component } from 'vue'
import {
  ElCascader,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElAutocomplete,
  ElDivider,
  ElTreeSelect,
  ElUpload
} from 'element-plus'
import { InputPassword } from '@/components/input-password'
import { Editor } from '@/components/editor'
import { JsonEditor } from '@/components/json-editor'
import { IconPicker } from '@/components/icon-picker'
import { IAgree } from '@/components/i-agree'
import type { ComponentName } from '../types'

const componentMap: Recordable<Component, ComponentName> = {
  RadioGroup: ElRadioGroup,
  RadioButton: ElRadioGroup,
  CheckboxGroup: ElCheckboxGroup,
  CheckboxButton: ElCheckboxGroup,
  Input: ElInput,
  Autocomplete: ElAutocomplete,
  InputNumber: ElInputNumber,
  Select: ElSelect,
  Cascader: ElCascader,
  Switch: ElSwitch,
  Slider: ElSlider,
  TimePicker: ElTimePicker,
  DatePicker: ElDatePicker,
  Rate: ElRate,
  ColorPicker: ElColorPicker,
  Transfer: ElTransfer,
  Divider: ElDivider,
  TimeSelect: ElTimeSelect,
  SelectV2: ElSelectV2,
  InputPassword: InputPassword,
  Editor: Editor,
  TreeSelect: ElTreeSelect,
  Upload: ElUpload,
  JsonEditor: JsonEditor,
  IconPicker: IconPicker,
  IAgree: IAgree
}

export { componentMap }
