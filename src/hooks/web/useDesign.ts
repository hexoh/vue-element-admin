import variables from '@/styles/variables.module.css'

export const useDesign = () => {
  const cssVariables = variables

  /**
   * @param scope 类名
   * @returns 返回空间名-类名
   */
  const getPrefixCls = (scope: string) => {
    return `${cssVariables.namespace}-${scope}`
  }

  return {
    variables: cssVariables,
    getPrefixCls
  }
}
