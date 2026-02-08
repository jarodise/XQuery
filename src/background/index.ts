// Background Service Worker for X Query Search
import { getExtensionApi } from '@/utils/extensionApi'

const extensionApi = getExtensionApi()

// Listen for extension icon clicks
extensionApi?.action.onClicked.addListener(async (tab) => {
  if (tab.id && tab.url?.match(/^https?:\/\/(twitter|x)\.com/)) {
    extensionApi.tabs.sendMessage(tab.id, { type: 'TOGGLE_SIDEBAR' })
  }
})

// Listen for messages from content scripts
extensionApi?.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_TAB_ID') {
    sendResponse({ tabId: sender.tab?.id })
  }
  return true
})

export { }
