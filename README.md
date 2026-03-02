# 前端仓库模板

本项目是使用 `Vite` 构建的 `Vue3` + `TypeScript` + `Element-Plus` 的模板项目，建议使用 **`pnpm`** 下载依赖和启动项目。

# 基础的功能

- 框架基于 VUE3
- 支持菜单列表导航栏和 Tab 式页签
- 提供根据角色或权限来生成导航菜单项
- 登录、 退出、修改密码等基础功能
- 管理功能包含：用户管理 组织管理 角色管理 权限管理 菜单管理

# 工具和框架版本号

- **`node`**: v24.12.0
- **`pnpm`**: 10.27.0
- **`Vue`**: ^3.5.26
- **`TypeScript`**: ~5.9.3
- **`Element-Plus`**: 2.13.0

# 安装和使用

- 安装依赖

```shell
pnpm install
```

- 运行

```shell
pnpm run dev
```

- 打包

```shell
pnpm run build
```

# 项目构建以及自动化插件

## 代码检查

- **`ESLint`** (生态完善，插件功能强大)
- **`Oxlint`** (比 `ESLint` 快 **50-100** 倍)

`Oxlint` 虽然比 `ESLint` 快 **50-100** 倍，但是由于目前生态不太完善，所以官方建议开发者先运行 `Oxlint`，然后在 `lint-staged` 或 `CI` 设置中运行 `ESLint`。这样，大多数常见问题在到达 `ESLint` 之前就被 `Oxlint` 阻止了。种方法可以显著提高 `lint` 过程的速度。

## 代码格式化

- **`prettier`**

代码格式化采用 `prettier` 插件，格式化文件时会自动采用 `ESLint` 的规则进行格式化代码，VSCode 的快捷键为 `Alt + Shift + F` (MacOS: `Option + Shift + F`)。

## 代码提交

- **`commitlint`**: `@commitlint/cli` `@commitlint/config-conventional`
- **`husky`**
- **`lint-staged`**

  提交前缀:
  - `feat`: 新功能(feature)
  - `fix` : 修补bug
  - `docs`: 文档(documentation)
  - `style`: 格式、样式(不影响代码运行的变动)
  - `refactor`: 重构(即不是新增功能，也不是修改BUG的代码)
  - `perf`: 优化相关，比如提升性能、体验
  - `test`: 添加测试
  - `ci`: 持续集成修改
  - `chore`: 构建过程或辅助工具的变动
  - `revert`: 回滚到上一个版本
  - `workflow`: 工作流改进
  - `mod`: 不确定分类的修改
  - `wip`: 开发中
  - `types`: 类型修改
  - `release`: 版本发布

# 项目目录

项目目录说明如下：

```
CLIENT-TEMPLATE/
├── public                        # 静态目录文件(不需要编译)
├── src
│   ├── api                       # 接口文件夹
│   ├── assets                    # 静态目录文件(需要编译的文件)
│   │   ├── images                # 图片文件夹
│   │   └── icons                  # SVG以及Icon文件夹
│   ├── components                # 公共组件库
│   ├── composables               # 公共组合式函数
│   ├── router                    # 路由
│   ├── stores                    # 状态管理
│   ├── styles                    # 样式文件夹
│   ├── views                     # 页面级组件
│   ├── App.vue                   # 根组件文件
│   └── main.ts                   # 启动入口文件
├── types                         # 公共TS引用申明
├── index.html                    # Index
├── package.json                  # package.json
│   ├── .editorconfig             # 统一代码配置文件
│   ├── .oxlintrc.json            # Oxlint 配置文件
│   ├── .prettierignore           # Prettier Ignore
│   ├── .stylelintignore          # Stylelint Ignore
│   ├── commitlint.config.ts      # Commitlint 配置文件
│   ├── eslint.config.ts          # ESLint 配置文件
│   ├── pnpm-lock.yaml            # 锁定项目依赖版本的配置文件
│   └── prettier.config.ts        # Prettier 配置文件
├── tsconfig.json                 # TypeScript 配置文件
└── vite.config.js                # Vite 配置文件
```

# 开发说明

开发前请详细阅读本章，有助于您了解本项目中使用的工具以及提高开发效率。

## 项目开发工具库

### AutoImport 自动导入

本系统已经自动集成 `Vite` 的 **`unplugin-auto-import`** 插件，会自动对 `vue`、`vue-router`、`element-plus`、`pinia` 进行导入。即开发代码时，不需要在每一个页面引用如下代码:

```typescript
// 无需引用
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 直接使用
const count = ref<number>(0)
```

### Iconify 图标库

在开发环境下会自动从互联网下载图标，打包时会将图标转换为SVG，在没有网络的环境下也能使用。

使用方法：

```vue
<template>
  <div>
    <!-- 使用 Material Design 的账号图标 (mdi:account) -->
    <icon-mdi-account style="font-size: 24px; color: blue;" />

    <!-- 使用 Element Plus 的苹果图标 (ep:apple) -->
    <icon-ep-apple class="my-icon" />

    <!-- 使用 Vue 的 logo (logos:vue) -->
    <icon-logos-vue />
  </div>
</template>
```
