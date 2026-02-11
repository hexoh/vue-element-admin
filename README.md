# 前端仓库模板
本项目是使用 `Vite` 构建的 `Vue3` + `TypeScript` + `Element-Plus` 的模板项目，建议使用 **`pnpm`** 下载依赖和启动项目。

# 基础的功能

+ 框架基于 VUE3
+ 支持菜单列表导航栏和 Tab 式页签
+ 提供根据角色或权限来生成导航菜单项
+ 登录、 退出、修改密码等基础功能
+ 管理功能包含：用户管理 组织管理 角色管理 权限管理 菜单管理

# 工具和框架版本号
* **`node`**: v24.12.0
* **`pnpm`**: 10.27.0
* **`Vue`**: ^3.5.26
* **`TypeScript`**: ~5.9.3
* **`Element-Plus`**: 2.13.0

# 安装和使用
* 安装依赖
```shell
pnpm install
```

* 运行
```shell
pnpm run dev
```

* 打包
```shell
pnpm run build
```

# 项目构建以及自动化插件

## 代码检查
* **`ESLint`** (生态完善，插件功能强大)
* **`Oxlint`** (比 `ESLint` 快 **50-100** 倍)

`Oxlint` 虽然比 `ESLint` 快 **50-100** 倍，但是由于目前生态不太完善，所以官方建议开发者先运行 `Oxlint`，然后在 `lint-staged` 或 `CI` 设置中运行 `ESLint`。这样，大多数常见问题在到达 `ESLint` 之前就被 `Oxlint` 阻止了。种方法可以显著提高 `lint` 过程的速度。

## 格式化
* **`prettier`**

# 项目开发工具库


