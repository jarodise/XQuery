import { createRoot } from 'react-dom/client'
import Sidebar from './Sidebar'
import '../styles/sidebar.css'

// Sidebar container ID
const SIDEBAR_ID = 'x-query-search-sidebar'
const SIDEBAR_ROOT_ID = 'x-query-search-root'

let isOpen = false
let shadowRoot: ShadowRoot | null = null
let rootContainer: HTMLDivElement | null = null
let removeTimeout: ReturnType<typeof setTimeout> | null = null

// Create and inject the sidebar
function createSidebar() {
  if (document.getElementById(SIDEBAR_ID)) {
    return
  }

  // Create container
  const container = document.createElement('div')
  container.id = SIDEBAR_ID
  container.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    z-index: 999999;
    font-family: 'JetBrains Mono', 'SF Pro Text', system-ui, sans-serif;
  `

  // Create shadow DOM for style isolation
  shadowRoot = container.attachShadow({ mode: 'open' })

  // Create style element for shadow DOM
  const style = document.createElement('style')
  style.textContent = getSidebarStyles()
  shadowRoot.appendChild(style)

  // Create root element for React
  rootContainer = document.createElement('div')
  rootContainer.id = SIDEBAR_ROOT_ID
  rootContainer.style.cssText = `
    height: 100%;
  `
  shadowRoot.appendChild(rootContainer)

  // Append to body
  document.body.appendChild(container)

  // Mount React app
  const root = createRoot(rootContainer)
  root.render(<Sidebar onClose={closeSidebar} />)
}

function getSidebarStyles(): string {
  return `
    :host {
      all: initial;
      font-family: 'JetBrains Mono', 'SF Pro Text', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #16181c;
    }
    ::-webkit-scrollbar-thumb {
      background: #2f3336;
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #3f4346;
    }
  `
}

function openSidebar() {
  // Clear any pending removal timeout
  if (removeTimeout !== null) {
    clearTimeout(removeTimeout)
    removeTimeout = null
  }

  const existingSidebar = document.getElementById(SIDEBAR_ID)
  if (existingSidebar) {
    // Sidebar exists but might be closing - just reopen it
    isOpen = true
    requestAnimationFrame(() => {
      existingSidebar.style.transform = 'translateX(0)'
    })
    return
  }

  createSidebar()
  isOpen = true

  // Trigger animation
  requestAnimationFrame(() => {
    const sidebar = document.getElementById(SIDEBAR_ID)
    if (sidebar) {
      sidebar.style.transform = 'translateX(0)'
    }
  })
}

function closeSidebar() {
  isOpen = false
  const sidebar = document.getElementById(SIDEBAR_ID)
  if (sidebar) {
    sidebar.style.transform = 'translateX(100%)'
    // Clear any existing timeout before creating a new one
    if (removeTimeout !== null) {
      clearTimeout(removeTimeout)
    }
    removeTimeout = setTimeout(() => {
      sidebar.remove()
      removeTimeout = null
    }, 300)
  }
}

function toggleSidebar() {
  if (isOpen) {
    closeSidebar()
  } else {
    openSidebar()
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE_SIDEBAR') {
    toggleSidebar()
  }
})

// Export for potential external use
;(window as unknown as { xQuerySearch: { toggle: () => void } }).xQuerySearch = {
  toggle: toggleSidebar,
}
