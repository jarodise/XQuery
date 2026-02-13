type ExtensionApiGlobal = typeof globalThis & {
  chrome?: typeof chrome
  browser?: typeof chrome
}

export function getExtensionApi(): typeof chrome | undefined {
  const extensionGlobal = globalThis as ExtensionApiGlobal
  return extensionGlobal.chrome ?? extensionGlobal.browser
}
