// Apply the theme before first paint: saved choice, else the OS setting.
// Kept as an external file (not inline) so the Content-Security-Policy can forbid inline scripts.
;(function () {
  var t
  try {
    t = localStorage.getItem('strata-theme')
  } catch {}
  if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  document.documentElement.dataset.theme = t
  if (t === 'light') document.querySelector('meta[name="theme-color"]').setAttribute('content', '#eef4fb')
})()
