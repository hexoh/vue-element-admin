import {
  defineConfig,
  presetWind4,
  presetIcons,
  transformerVariantGroup,
  presetAttributify,
  toEscapedSelector as e
} from 'unocss'

export default defineConfig({
  presets: [
    // presetWind4 预设
    presetWind4(),
    // 可选的图标预设
    presetIcons({
      autoInstall: true,
      prefix: 'i-',
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    }),
    // 启用属性化模式
    presetAttributify({
      prefix: 'un-', // 前缀
      prefixedOnly: true // 仅匹配带前缀的属性，即强制前缀
    })
  ],
  transformers: [transformerVariantGroup()],
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/]
    }
  },
  shortcuts: {
    center: 'flex justify-center items-center'
  },
  // 可选：自定义规则
  rules: [
    [
      /^overflow-ellipsis$/,
      (_match, { rawSelector }) => {
        const selector = e(rawSelector)
        return `${selector} {text-overflow: ellipsis;}`
      }
    ],
    [
      /^custom-hover$/,
      (_match, { rawSelector }) => {
        const selector = e(rawSelector)
        return `
          ${selector} {
            display: flex;
            height: 100%;
            padding: 1px 10px 0;
            cursor: pointer;
            align-items: center;
            transition: background var(--transition-time-02);
          }
          /* you can have multiple rules */
          ${selector}:hover {
            background-color: var(--top-header-hover-color);
          }
          .dark ${selector}:hover {
            background-color: var(--el-bg-color-overlay);
          }
        `
      }
    ],
    [
      /^layout-border__left$/,
      (_match, { rawSelector }) => {
        const selector = e(rawSelector)
        return `
          ${selector}:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 1px;
            height: 100%;
            background-color: var(--el-border-color);
            z-index: 3;
          }
        `
      }
    ],
    [
      /^layout-border__right$/,
      (_match, { rawSelector }) => {
        const selector = e(rawSelector)
        return `
          ${selector}:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 1px;
            height: 100%;
            background-color: var(--el-border-color);
            z-index: 3;
          }
        `
      }
    ],
    [
      /^layout-border__top$/,
      (_match, { rawSelector }) => {
        const selector = e(rawSelector)
        return `
          ${selector}:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: var(--el-border-color);
            z-index: 3;
          }
        `
      }
    ],
    [
      /^layout-border__bottom$/,
      (_match, { rawSelector }) => {
        const selector = e(rawSelector)
        return `
          ${selector}:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: var(--el-border-color);
            z-index: 3;
          }
        `
      }
    ]
  ]
})
