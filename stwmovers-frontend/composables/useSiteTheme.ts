export const useSiteTheme = () => {
  const themeMode = useState<'dark' | 'light'>('site-theme', () => 'dark')
  const applyThemeMode = (mode: 'dark' | 'light') => {
    themeMode.value = mode
    if (!import.meta.client) return
    document.documentElement.dataset.siteTheme = mode
    try { localStorage.setItem('stw-theme-mode', mode) } catch { /* Storage can be disabled. */ }
  }
  const toggleThemeMode = () => applyThemeMode(themeMode.value === 'dark' ? 'light' : 'dark')
  return { themeMode, applyThemeMode, toggleThemeMode }
}
