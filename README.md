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

开发前请仔细阅读本章，有助于您了解本项目中使用的工具以及提高开发效率。

## 项目开发工具库

### Commitlint

本项目集成 **`commitlint`** 插件，提代码时描述必须严格按照格式添加前缀，否则会提交失败。

提交范例: `feat: 开发**功能`、 `fix: 修补了**BUG`。

提交前缀如下:

- **`feat`**: 新功能(feature)
- **`fix`** : 修补bug
- **`docs`**: 文档(documentation)
- **`style`**: 格式、样式(不影响代码运行的变动)
- **`refactor`**: 重构(即不是新增功能，也不是修BUG的代码)
- **`perf`**: 优化相关，比如提升性能、体验
- **`test`**: 添加测试
- **`ci`**: 持续集成修改
- **`chore`**: 构建过程或辅助工具的变动
- **`revert`**: 回滚到上一个版本
- **`workflow`**: 工作流改进
- **`mod`**: 不确定分类的修改
- **`wip`**: 开发中
- **`types`**: 类型修改
- **`release`**: 版本发布

### AutoImport 自动导入

本项目已经自动集成 `Vite` 的 **`unplugin-auto-import`** 插件，会自动对 `vue`、`vue-router`、`element-plus`、`pinia` 进行导入。编写代码时，在代码中直接使用 `ref`、`computed`、`onMounted`等，而无需手动写 `import` 语句。插件会在编译时，自动为你添加上这些导入。

```typescript
// 无需引用
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 直接使用
const count = ref<number>(0)
```

### [Iconify](https://iconify.design/getting-started/) 图标库

在开发环境下会自动从互联网下载图标，打包时会将图标转换为SVG，在没有网络的环境下也能使用。

[**`Iconify`**](https://iconify.design/getting-started/) 在线图标使用方法：

```html
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

使用本地自定义图标只能使用 `SVG` 图片作为图标。将要作为 `icon` 图标的 `svg` 文件放到项目 `src/assets/icons` 文件中。按照下面的引用方式使用:

```html
<template>
  <div>
    <!-- 本地图标使用方法 edit为svg图标名称-->
    <icon-local-edit />
  </div>
</template>
```

因为自动导入图标需要我们在页面中使用或者是本地添加，但是在某些没有网络的环境中我们可能需要提前将图标引用进去（因为离线网络无法使用在线图标会导致图标显示异常）。

### [UnoCSS](https://unocss.dev/guide/)

使用 `UnoCSS` 会大大减少 `CSS` 样式的编码，本项目中已经添加了官方的 [`Wind4 preset`](https://unocss.dev/presets/wind4) 预设。修改预设样式可以在 `uno.config.ts` 文件中修改。

插件列表:

- [**Wind4 preset**](https://unocss.dev/presets/wind4): 官方预设样式规则

  ```html
  <div class="text-3xl" />
  <!-- text-3xl将自动转换为 -->
  <style>
    /* layer: default */
    .text-3xl {
      font-size: var(--text-3xl-fontSize);
      line-height: var(--un-leading, var(--text-3xl-lineHeight));
    }
  </style>
  ```

- [**Icons preset**](https://unocss.dev/presets/icons): 图标预设

  ```html
  <!-- A basic anchor icon from Phosphor icons -->
  <div class="i-ph-anchor-simple-thin" />
  <!-- An orange alarm from Material Design Icons -->
  <div class="i-mdi-alarm text-orange-400" />
  <!-- A large Vue logo -->
  <div class="i-logos-vue text-3xl" />
  ```

- [**Attributify preset**](https://unocss.dev/presets/attributify): 属性化模式

  属性化模式是为了让class变的更简便，想象一下，你使用 Tailwind CSS 的工具类创建了这个按钮。当列表变长时，它会变得难以阅读和维护。

  ```html
  <button
    class="bg-blue-400 hover:bg-blue-500 text-sm text-white font-mono font-light py-2 px-4 rounded border-2 border-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600"
  >
    Button
  </button>
  ```

  使用属性化模式，您可以将实用程序拆分为属性：

  ```html
  <button
    bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
    text="sm white"
    font="mono light"
    p="y-2 x-4"
    border="2 rounded blue-200"
  >
    Button
  </button>
  ```

  对于像 `flex`、`grid`、`border` 这样的实用程序，如果其实用程序与前缀相同，`~` 则会提供一个特殊值。

  例如：

  ```html
  <button class="border border-red">Button</button>
  ```

  可以写成：

  ```html
  <button border="~ red">Button</button>
  ```

  由于本项目在配置中已经强制让 `unocss` 属性添加前缀，防止跟组件本身默认的属性冲突，所以上面的应该为:

  ```html
  <button
    un-bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
    un-text="sm white"
    un-font="mono light"
    un-p="y-2 x-4"
    un-border="2 rounded blue-200"
  >
    Button
  </button>
  ```

  如果 `class` 中的值不是太多还是建议使用 `class`, 不建议使用属性方式。

- [**Variant group transformer**](https://unocss.dev/transformers/variant-group): 变体组功能

  ```html
  <div class="hover:(bg-gray-400 font-medium) font-(light mono)" />
  ```

  将转换为:

  ```html
  <div class="hover:bg-gray-400 hover:font-medium font-light font-mono" />
  ```
