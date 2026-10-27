import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/** Build-time render of the whole page, injected into dist/index.html by scripts/prerender.mjs. */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
