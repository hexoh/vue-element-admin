import { useAppStoreWithOut } from '@/stores/modules/app'

export const usePageLoading = () => {
  const appStore = useAppStoreWithOut()

  const loadStart = () => {
    appStore.setPageLoading(true)
  }

  const loadDone = () => {
    appStore.setPageLoading(false)
  }

  return {
    loadStart,
    loadDone
  }
}
