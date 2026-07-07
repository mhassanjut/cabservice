/** Resolve Wikimedia Commons 1280px thumbnail URL from a file page title. */
export async function resolveCommonsThumb(fileTitle, width = 1280) {
  const page = encodeURIComponent(`File:${fileTitle}`)
  const url = `https://commons.wikimedia.org/wiki/${page}`
  const res = await fetch(url, { headers: { 'User-Agent': 'STWMoversFleetSync/1.0' } })
  if (!res.ok) throw new Error(`Commons page ${res.status}: ${fileTitle}`)
  const html = await res.text()
  const escaped = fileTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[ _]')
  const re = new RegExp(
    `(https://upload\\.wikimedia\\.org/wikipedia/commons/thumb/[^"\\s]+/${width}px-[^"\\s]+)`,
    'i',
  )
  const match = html.match(re)
  if (!match) {
    const any = html.match(/https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/[^"\s]+/i)
    if (!any) throw new Error(`No thumb URL in page: ${fileTitle}`)
    return any[0].replace(/&amp;/g, '&')
  }
  return match[1].replace(/&amp;/g, '&')
}
