const initMockServer = async () => {
  if (import.meta.env.PROD && import.meta.env.VITE_USE_MOCK === 'true') {
    const { setupProdMockServer } = await import('../../../mock/_createProdServer')
    setupProdMockServer()
  }
}

initMockServer()
