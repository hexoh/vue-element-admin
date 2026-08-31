import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
// import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import pluginOxlint from 'eslint-plugin-oxlint'
import eslintConfigPrettier from 'eslint-config-prettier' // 禁用冲突规则
import eslintPluginPrettier from 'eslint-plugin-prettier' // 集成 Prettier
// vue文件解析器
import vueParser from 'vue-eslint-parser'
import tseslint from 'typescript-eslint'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,ts,mts,tsx}']
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  },

  // skipFormatting, // 与Prettier配合，避免格式规则冲突
  // 1. 先禁用与 Prettier 冲突的 ESLint 规则
  eslintConfigPrettier,

  // 2. 添加 Prettier 插件
  {
    plugins: {
      prettier: eslintPluginPrettier
    },
    languageOptions: {
      parser: vueParser, // 使用vue解析器，这个可以识别vue文件
      parserOptions: {
        parser: tseslint.parser, // 在vue文件上使用ts解析器
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      // 启用 Prettier 格式化规则
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 0,
      // 允许单次单词的全局组件名，如 Permission
      'vue/multi-word-component-names': 'off'
    }
  },

  ...pluginOxlint.configs['flat/recommended']
)
