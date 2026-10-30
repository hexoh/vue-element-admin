# 前端仓库模板

本项目是使用 `Vite` 构建的 `Vue3` + `TypeScript` + `Element-Plus` 的模板项目，建议使用 **`pnpm`** 下载依赖和启动项目。

# 仓库说明

可根据项目大小以及项目的类型拉取不同的包进行使用

- **`main`** 集成所有组件、左侧菜单以及用户管理等功能。
- **`single-all`** 集成所有组件，不包含左侧菜单以及用户管理功能，适合小型项目（没有左侧菜单这种分栏形式）
- **`single`** 不包含组件，也没有菜单，适合单页面项目

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

`Oxlint` 虽然比 `ESLint` 快 **50-100** 倍，但是由于目前生态不太完善，所以官方建议开发者先运行 `Oxlint`，然后在 `lint-staged` 或 `CI` 设置中运行 `ESLint`。这样，大多数常见问题在到达 `ESLint` 之前就被 `Oxlint` 阻止了。这种方法可以显著提高 `lint` 过程的速度。

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
│   │   └── icons                 # SVG以及Icon文件夹
│   ├── components                # 公共组件库
│   ├── composables               # 公共组合式函数
│   ├── constants                 # 常量文件夹
│   ├── directives                # 指令文件夹
│   ├── hooks                     # 钩子函数文件夹
│   ├── layout                    # 布局
│   ├── locales                   # 国际化
│   ├── plugins                   # 插件
│   ├── router                    # 路由
│   ├── stores                    # 状态管理
│   ├── styles                    # 样式文件夹
│   ├── utils                     # 工具函数
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

## 文件名称命名规范

### 项目各目录文件命名规范

| 风格 | 典型文件 | 为什么这样命？（底层逻辑） |
| --- | --- | --- |
| `PascalCase` (大驼峰) | UserCard.vue<br>LoginView.vue | 组件/类：文件导出一个 UI 组件或类（面向对象/模板结构）。 |
| `camelCase` (小驼峰) | useLocal.ts<br>formatDate.ts | 函数/变量/实例：文件导出一个具体的函数、Hook 或实例对象。 |
| `kebab-case` (短横线) | element-plus.ts<br>bg-banner.png | 第三方包配置/静态资源/URL映射：npm 包名全都是短横线规范，资源和 URL 路径也是小写短横线。 |

```text
src/
├── api/                  #【camelCase】业务模块接口 (user.ts, orderApi.ts)
├── assets/               #【kebab-case】静态资源 (logo-small.png, bg-banner.jpg)
├── components/           #【PascalCase】可复用组件 (AppHeader.vue, BaseButton.vue)
├── composables/ (hooks/) #【camelCase】组合式函数 (useAuth.ts, useLocalStorage.ts)
├── plugins/              #【kebab-case】插件包装 (element-plus.ts, vue-i18n.ts)
├── router/               #【camelCase】路由配置 (index.ts, routes.ts)
├── stores/               #【camelCase】Pinia Store (useUserStore.ts 或 user.ts)
├── types/                #【camelCase】类型声明 (apiResponse.d.ts, user.ts)
├── utils/                #【camelCase】纯 JS 工具函数 (formatDate.ts, request.ts)
└── views/                #【PascalCase】页面级组件 (HomeView.vue, UserProfile.vue)
```

### 文件夹命名规范

在 src/views/（或 src/pages/）下，**文件夹的命名强烈推荐一律使用 kebab-case（全小写 + 单词间短横线）**。

例如：

- 单单词：views/home/、views/login/、views/dashboard/
- 多单词：views/user-management/、views/order-detail/、views/system-setting/

```text
src/views/
├── login/
│   ├── LoginView.vue          # 主页面组件（大驼峰）
│   ├── components/            # 只有登录页自己用的专属子组件
│   │   ├── LoginForm.vue
│   │   └── LoginPhoneModal.vue
│   └── useLogin.ts            # 登录页专属的逻辑 hook（小驼峰）
│
├── user-management/           # 多单词文件夹用 kebab-case
│   ├── UserList.vue           # 列表页
│   ├── UserDetail.vue         # 详情页
│   └── components/
│       └── UserStatusBadge.vue
│
└── home/
    └── HomeView.vue
```

## 项目开发工具库

### Plop 脚手架生成器

Plop 是一个基于 `Node.js` 的‌ **`微型代码生成工具‌`**（常被称为“脚手架生成器”），专为前端工程化设计，用于通过预定义模板快速、规范地批量生成重复性代码结构（如组件、页面、模块、测试文件等）。

此项目中已经集成 `Plop` 用于生成 **`component`** 和 **`view`** , 创建文件时建议使用此命令进行创建 **`component`** 和 **`view`** 以保持文件内的代码统一。

使用方法：

1.运行命令

```shell
pnpm run p
```

2.选择 **`component`** 或 **`view`**

```text
$ plop
? [PLOP] Please choose a generator. (Use arrow keys)
❯ view - Create vue view
  component - Create vue component
```

3.输入 **`component`** 或 **`view`** 名称

- **名称的规范必须是 `kebab-case` 规范，如：login、user-management**

- 如果是子文件夹可以输入 `/`，如：user/detail

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

## 项目配置

### 环境变量配置

环境变量配置包括 `dev`、`test`、`prod`，具体可以查看配置文件

### 主题配置

#### 配置文件路径

`src/store/modules/app.ts`

#### 说明

修改完之后，会添加到全局的状态管理中，方便其他地方使用。

```js
export const appModules: AppState = {
  sizeMap: ['default', 'large', 'small'],
  mobile: false, // 是否是移动端
  title: import.meta.env.VITE_APP_TITLE as string, // 标题
  pageLoading: false, // 路由跳转loading

  breadcrumb: true, // 面包屑
  breadcrumbIcon: true, // 面包屑图标
  collapse: false, // 折叠菜单
  hamburger: true, // 折叠图标
  screenfull: true, // 全屏图标
  size: true, // 尺寸图标
  locale: true, // 多语言图标
  tagsView: true, // 标签页
  logo: true, // logo
  fixedHeader: true, // 固定toolheader
  footer: true, // 显示页脚
  greyMode: false, // 是否开始灰色模式，用于特殊悼念日

  layout: wsCache.get('layout') || 'classic', // layout布局
  isDark: wsCache.get('isDark') || false, // 是否是暗黑模式
  currentSize: wsCache.get('default') || 'default', // 组件尺寸
  theme: wsCache.get('theme') || {
    // 主题色
    elColorPrimary: '#409eff',
    // 左侧菜单边框颜色
    leftMenuBorderColor: 'inherit',
    // 左侧菜单背景颜色
    leftMenuBgColor: '#001529',
    // 左侧菜单浅色背景颜色
    leftMenuBgLightColor: '#0f2438',
    // 左侧菜单选中背景颜色
    leftMenuBgActiveColor: 'var(--el-color-primary)',
    // 左侧菜单收起选中背景颜色
    leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
    // 左侧菜单字体颜色
    leftMenuTextColor: '#bfcbd9',
    // 左侧菜单选中字体颜色
    leftMenuTextActiveColor: '#fff',
    // logo字体颜色
    logoTitleTextColor: '#fff',
    // logo边框颜色
    logoBorderColor: 'inherit',
    // 头部背景颜色
    topHeaderBgColor: '#fff',
    // 头部字体颜色
    topHeaderTextColor: 'inherit',
    // 头部悬停颜色
    topHeaderHoverColor: '#f6f6f6',
    // 头部边框颜色
    topToolBorderColor: '#eee'
  }
}
```

如果想要添加新的全局配置属性，需要在 `src/store/modules/app.ts` 中 `AppState` 添加对应的类型，并在 appModules 对象中，赋予新属性的默认值。

### 多语言配置

用于配置多语言信息

在 `src/store/modules/locale.ts` 内配置

```js
import { useCache } from '@/hooks/web/useCache'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'

const { wsCache } = useCache()

export const elLocaleMap = {
  'zh-CN': zhCn,
  en: en
}
export interface LocaleState {
  currentLocale: LocaleDropdownType
  localeMap: LocaleDropdownType[]
}

export const localeModules: LocaleState = {
  currentLocale: {
    lang: wsCache.get('lang') || 'zh-CN',
    elLocale: elLocaleMap[wsCache.get('lang') || 'zh-CN']
  },
  // 多语言
  localeMap: [
    {
      lang: 'zh-CN',
      name: '简体中文'
    },
    {
      lang: 'en',
      name: 'English'
    }
  ]
}
```

### 样式配置

#### css 前缀设置

用于修改项目内组件及 `element-plus` 组件的 `class` 前缀。

由于 `element-plus` 的组件还没有全部采用动态配置前缀，所以目前还是使用 `el` 前缀。

在 `src/styles/variables.module.scss` 内配置

```scss
$adminNamespace: 'v';
$elNamespace: 'el';

/* 命名空间 */
:root {
  --namespace: #{$adminNamespace};
  --el-namespace: #{$elNamespace};
}

/* 导出变量 */
:export {
  namespace: #{$adminNamespace};
  elNamespace: #{$elNamespace};
}
```

#### 前缀使用

```scss
<style lang="scss" scoped>
$prefix-cls: '#{$adminNamespace}-app';

.#{$prefix-cls} {
  :deep(.#{$elNamespace}-input__clear) {
    margin-left: 5px;
  }
</style>
```

```js
import { useDesign } from '/@/hooks/web/useDesign'

const { prefixCls } = useDesign('app')
```

## 路由

项目路由配置存放于 src/router/index.ts 中。

为了方便阅读和查找，目前项目中并没有去对路由进行拆分，而是统一写在了一起，如果需要拆分，可自行更改。

```js
/**
* redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
* name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
* meta : {
    hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)

    alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
                              只有一个时，会将那个子路由当做根路由显示在侧边栏，
                              若你想不管路由下面的 children 声明的个数都显示你的根路由，
                              你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
                              一直显示根路由(默认 false)

    title: 'title'            设置该路由在侧边栏和面包屑中展示的名字

    icon: 'svg-name'          设置该路由的图标

    noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)

    breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)

    affix: true               如果设置为true，则会一直固定在tag项中(默认 false)

    noTagsView: true          如果设置为true，则不会出现在tag中(默认 false)

    activeMenu: '/dashboard'  显示高亮的路由路径

    canTo: true               设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)

    permission: ['edit','add', 'delete']    设置该路由的权限
  }
**/
```

### 如何添加新配置

如果本项目中的路由配置项，满足不了你当前的开发工作，可以自行添加新的属性。

> **注意：** <br/> 所有的路由项配置，都必须放在 `meta` 中。

在 `types/router.d.ts` 中添加对应的类型，之后就可以在路由中添加你需要的配置项了。

```js
declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    hidden?: boolean
    alwaysShow?: boolean
    title?: string
    icon?: string
    noCache?: boolean
    breadcrumb?: boolean
    affix?: boolean
    activeMenu?: string
    noTagsView?: boolean
    canTo?: boolean
    permission?: string[]

    // 添加新的配置类型
    ...
  }
}
```

### 多级路由

> **注意事项**
>
> - 整个项目所有路由 name 不能重复
> - 所有的多级路由最终都会转成二级路由，所以不能内嵌子路由
> - 除了 layout 对应的 path 前面需要加 /，其余子路由都不要以/开头

```json
{
  path: '/level',
  component: Layout,
  redirect: '/level/menu1/menu1-1/menu1-1-1',
  name: 'Level',
  meta: {
    title: t('router.level'),
    icon: 'carbon:skill-level-advanced'
  },
  children: [
    {
      path: 'menu1',
      name: 'Menu1',
      component: getParentLayout(),
      redirect: '/level/menu1/menu1-1/menu1-1-1',
      meta: {
        title: t('router.menu1')
      },
      children: [
        {
          path: 'menu1-1',
          name: 'Menu11',
          component: getParentLayout(),
          redirect: '/level/menu1/menu1-1/menu1-1-1',
          meta: {
            title: t('router.menu11'),
            alwaysShow: true
          },
          children: [
            {
              path: 'menu1-1-1',
              name: 'Menu111',
              component: () => import('@/views/Level/Menu111.vue'),
              meta: {
                title: t('router.menu111')
              }
            }
          ]
        },
        {
          path: 'menu1-2',
          name: 'Menu12',
          component: () => import('@/views/Level/Menu12.vue'),
          meta: {
            title: t('router.menu12')
          }
        }
      ]
    },
    {
      path: 'menu2',
      name: 'Menu2Demo',
      component: () => import('@/views/Level/Menu2.vue'),
      meta: {
        title: t('router.menu2')
      }
    }
  ]
}

```

### 外链

只需要将 path 设置为需要跳转的HTTP 地址即可。

```json
{
  path: '/external-link',
  component: Layout,
  meta: {
    name: 'ExternalLink'
  },
  children: [
    {
      path: 'https://github.com/kailong321200875/vue-element-plus-admin-doc',
      meta: { name: 'Link', title: '文档' }
    }
  ]
}
```

### 页面缓存

开启缓存有 2 个条件

- 路由设置 name，且不能重复
- 路由对应的组件加上 name，与路由设置的 name 保持一致

```js
{
  path: 'menu2',
  name: 'Menu2',
  component: () => import('@/views/Level/Menu2.vue'),
  meta: {
    title: t('router.menu2')
  }
}

// /@/views/Level/Menu2.vue
<script setup lang="ts">
defineOptions({
  name: 'Menu2'
})
</script>
```

> **注意** <br> keep-alive 生效的前提是：需要将路由的 name 属性及对应的页面的 name 设置成一样。因为：<br> include - 字符串或正则表达式，只有名称匹配的组件会被缓存

可以将 noCache 配置成 true 即可关闭缓存或者组件不添加 name 属性。

```json
{
  path: 'workplace',
  component: () => import('@/views/Dashboard/Workplace.vue'),
  name: 'Workplace',
  meta: {
    title: t('router.workplace'),
    noCache: true
  }
}
```

## 权限

项目中集成了 2 种权限处理方式：

1. 第一种是由前端来控制菜单，即服务端只返回有权限的 keys，由前端自行去匹配
2. 第二种是通过服务端返回的路由数据结构来动态生成路由表

### 前端控制权限

**实现原理:** 在前端固定写死路由的权限，指定路由有哪些权限可以查看。只初始化通用的路由，需要权限才能访问的路由没有被加入路由表内。在登陆后或者其他方式获取对应的路由 keys 后，遍历路由表去匹配 keys，过滤生成可以访问的路由表，再通过 router.addRoutes 添加到路由实例，实现权限的过滤。

**缺点：** 权限相对不自由，因为路由表的控制在前端，不管是要排序还是修改，都需要前端去修改，服务端只提供有权限的路由 keys

### 后台动态获取

**实现原理：** 是通过接口动态生成路由表，且遵循一定的数据结构返回。前端根据需要处理该数据为可识别的结构，再通过 router.addRoutes 添加到路由实例，实现权限的动态生成。

**优点：** 所有的菜单控制都是通过服务端的接口返回，前端只负责渲染，后期维护成本降低，优先推荐此方式。

### 实现

在 `src/store/modules/permission.ts` 中 `generateRoutes()` 进行更改。

接收的 `type` 参数，目前只是针对于本项目的模拟情况，如果不需要或者不适用，可自行改动。

```ts
generateRoutes(
  type: 'server' | 'frontEnd' | 'static',
  routers?: AppCustomRouteRecordRaw[] | string[]
): Promise<unknown> {
  return new Promise<void>((resolve) => {
    let routerMap: AppRouteRecordRaw[] = []
    if (type === 'server') {
      // 模拟后端过滤菜单
      routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[])
    } else if (type === 'frontEnd') {
      // 模拟前端过滤菜单
      routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers as string[])
    } else {
      // 直接读取静态路由表
      routerMap = cloneDeep(asyncRouterMap)
    }
    // 动态路由，404一定要放到最后面
    this.addRouters = routerMap.concat([
      {
        path: '/:path(.*)*',
        redirect: '/404',
        name: '404Page',
        meta: {
          hidden: true,
          breadcrumb: false
        }
      }
    ])
    // 渲染菜单的所有路由
    this.routers = cloneDeep(constantRouterMap).concat(routerMap)
    resolve()
  })
}
```

### 前端控制实现

在 `src/router/generate.ts` 中 `generateRoutesByFrontEnd ()` 进行更改。目前本项目的前端权限控制，是根据 `path` 是否相同来进行过滤演示的，如果不符合需求，需要手动更改以下判断逻辑。

```ts
// 前端控制路由生成
export const generateRoutesByFrontEnd = (
  routes: AppRouteRecordRaw[],
  keys: string[],
  basePath = '/'
): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []

  for (const route of routes) {
    const meta = route.meta as RouteMeta
    // skip some route
    if (meta.hidden && !meta.showMainRoute) {
      continue
    }

    let data: Nullable<AppRouteRecordRaw> = null

    let onlyOneChild: Nullable<string> = null
    if (route.children && route.children.length === 1 && !meta.alwaysShow) {
      onlyOneChild = (
        isUrl(route.children[0].path)
          ? route.children[0].path
          : pathResolve(pathResolve(basePath, route.path), route.children[0].path)
      ) as string
    }

    // 开发者可以根据实际情况进行扩展
    for (const item of keys) {
      // 通过路径去匹配
      if (isUrl(item) && (onlyOneChild === item || route.path === item)) {
        data = Object.assign({}, route)
      } else {
        const routePath = pathResolve(basePath, onlyOneChild || route.path)
        if (routePath === item || meta.followRoute === item) {
          data = Object.assign({}, route)
        }
      }
    }

    // recursive child routes
    if (route.children && data) {
      data.children = generateRoutesByFrontEnd(
        route.children,
        keys,
        pathResolve(basePath, data.path)
      )
    }
    if (data) {
      res.push(data as AppRouteRecordRaw)
    }
  }
  return res
}
```

### 后台动态获取

在 `src/router/generate.ts` 中 `generateRoutesByServer ()` 进行更改。

```ts
// 后端控制路由生成
export const generateRoutesByServer = (routes: AppCustomRouteRecordRaw[]): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []

  for (const route of routes) {
    const data: AppRouteRecordRaw = {
      path: route.path,
      name: route.name,
      redirect: route.redirect,
      meta: route.meta
    }
    if (route.component) {
      const comModule = modules[`../${route.component}.vue`] || modules[`../${route.component}.tsx`]
      const component = route.component as string
      if (!comModule && !component.includes('#')) {
        console.error(`未找到${route.component}.vue文件或${route.component}.tsx文件，请创建`)
      } else {
        // 动态加载路由文件，可根据实际情况进行自定义逻辑
        data.component =
          component === '#' ? Layout : component.includes('##') ? getParentLayout() : comModule
      }
    }
    // recursive child routes
    if (route.children) {
      data.children = generateRoutesByServer(route.children)
    }
    res.push(data as AppRouteRecordRaw)
  }
  return res
}
```

### 公用部分修改

需要开发者自行根据需求进行代码变更。

```ts
// 获取角色信息
const getRole = async () => {
  const formData = await getFormData<UserType>()
  const params = {
    roleName: formData.username
  }
  const res =
    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? await getAdminRoleApi(params)
      : await getTestRoleApi(params)
  if (res) {
    const routers = res.data || []
    setStorage('roleRouters', routers)
    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? await permissionStore.generateRoutes('server', routers).catch(() => {})
      : await permissionStore.generateRoutes('frontEnd', routers).catch(() => {})

    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
    push({ path: redirect.value || permissionStore.addRouters[0].path })
  }
}
```

在 `src/router/permission.ts`，以下这种情况，是考虑到手动刷新，所以需要获取到缓存中的动态菜单重新渲染。

```ts
// 开发者可根据实际情况进行修改
const roleRouters = getStorage('roleRouters') || []

// 是否使用动态路由
if (appStore.getDynamicRouter) {
  appStore.serverDynamicRouter
    ? await permissionStore.generateRoutes('server', roleRouters as AppCustomRouteRecordRaw[])
    : await permissionStore.generateRoutes('frontEnd', roleRouters as string[])
} else {
  await permissionStore.generateRoutes('static')
}

permissionStore.getAddRouters.forEach((route) => {
  router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
})
const redirectPath = from.query.redirect || to.path
const redirect = decodeURIComponent(redirectPath as string)
const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
permissionStore.setIsAddRouters(true)
next(nextData)
```

### 静态路由（无权限）

有时候，我们并不需要动态路由，那么可以在 `src/config/app.ts` 中把 `dynamicRouter` 设置为 `false`，这样我们取得都是项目中的静态路由表了。

内部逻辑已经处理了静态路由的部分，所以可以无需关心其他。

## 组件注册

### 按需引入

项目目前的组件注册机制是按需注册，是在需要用到的页面才引入。

```ts
<script setup lang="ts">
import { ElBacktop } from 'element-plus'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('backtop')
</script>

<template>
  <ElBacktop
    :class="`${prefixCls}-backtop`"
    :target="`.${variables.namespace}-layout-content-scrollbar .${variables.elNamespace}-scrollbar__wrap`"
  />
</template>
```

### 全局注册

如果觉得按需引入太麻烦，可以进行全局注册，在 `src/components/index.ts`，添加需要注册的组件。

目前只有 `Icon` 组件进行了全局注册

```ts
import type { App } from 'vue'
import { Icon } from './Icon'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
}
```

如果 `element-plus` 的组件需要全局注册，在 `src/plugins/element-plus/index.ts` 添加需要注册的组件。

目前 `element-plus` 中只有 `ElLoading` 与 `ElScrollbar` 进行了全局注册。

```ts
import type { App } from 'vue'

// 需要全局引入一些组件，如ElScrollbar，不然一些下拉项样式有问题
import { ElLoading, ElScrollbar } from 'element-plus'

const plugins = [ElLoading]

const components = [ElScrollbar]

export const setupElementPlus = (app: App) => {
  plugins.forEach((plugin) => {
    app.use(plugin)
  })

  components.forEach((component) => {
    app.component(component.name, component)
  })
}
```
