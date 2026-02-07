// Background Service Worker for X Query Search

// Listen for extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  // Only works on X.com tabs
  if (tab.id && tab.url?.match(/^https?:\/\/(twitter|x)\.com/)) {
    // Send message to content script to toggle sidebar
    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_SIDEBAR' })
  }
})

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_TAB_ID') {
    sendResponse({ tabId: sender.tab?.id })
  }
  return true
})

export { }
