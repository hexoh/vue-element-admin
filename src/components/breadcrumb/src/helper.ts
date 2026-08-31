import { pathResolve } from '@/router/generate'

export const filterBreadcrumb = (
  routes: AppRouteRecordRaw[],
  parentPath = ''
): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []

  for (const route of routes) {
    const meta = route?.meta
    if (meta.hidden && !meta.canTo) {
      continue
    }

    const onlyOneChild =
      !meta.alwaysShow && route.children?.length === 1 ? route.children[0] : undefined

    const data: AppRouteRecordRaw = onlyOneChild
      ? { ...onlyOneChild, path: pathResolve(route.path, onlyOneChild.path) }
      : { ...route }

    data.path = pathResolve(parentPath, data.path)

    if (data.children) {
      data.children = filterBreadcrumb(data.children, data.path)
    }
    if (data) {
      res.push(data)
    }
  }
  return res
}
