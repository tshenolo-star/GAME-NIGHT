interface ItunesItem {
  artistName?: string
  trackName?: string
  previewUrl?: string
}

interface ItunesResponse {
  results?: ItunesItem[]
}

const ENDPOINT = 'https://itunes.apple.com/search'
const UNWANTED = ['karaoke', 'tribute', 'cover', 'instrumental', 'made famous', 'originally performed', 'remix', 'live']
const cache = new Map<string, string | null>()

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function core(text: string): string {
  return normalize(text.replace(/\(.*?\)|\[.*?\]/g, ''))
}

function pickBest(items: ItunesItem[], artist: string, title: string): string | null {
  const wantArtist = core(artist)
  const wantTitle = core(title)
  const wantedFull = normalize(title)

  const matches = items.filter(
    (item) =>
      item.previewUrl &&
      item.artistName &&
      item.trackName &&
      normalize(item.artistName).includes(wantArtist) &&
      normalize(item.trackName).includes(wantTitle) &&
      !UNWANTED.some((word) => normalize(`${item.trackName} ${item.artistName}`).includes(word) && !wantedFull.includes(word))
  )

  matches.sort((a, b) => (a.trackName ?? '').length - (b.trackName ?? '').length)
  return matches[0]?.previewUrl ?? null
}

async function viaFetch(url: string, signal?: AbortSignal): Promise<ItunesResponse> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`iTunes ${response.status}`)
  return response.json()
}

function viaJsonp(url: string, signal?: AbortSignal): Promise<ItunesResponse> {
  return new Promise((resolve, reject) => {
    const callbackName = `itunesPreview_${Date.now()}_${Math.floor(Math.random() * 1e6)}`
    const registry = window as unknown as Record<string, unknown>
    const script = document.createElement('script')

    const cleanup = () => {
      clearTimeout(timer)
      delete registry[callbackName]
      script.remove()
    }
    const timer = setTimeout(() => { cleanup(); reject(new Error('iTunes timeout')) }, 8000)

    registry[callbackName] = (data: ItunesResponse) => { cleanup(); resolve(data) }
    script.onerror = () => { cleanup(); reject(new Error('iTunes script error')) }
    signal?.addEventListener('abort', () => { cleanup(); reject(new DOMException('Aborted', 'AbortError')) })
    script.src = `${url}&callback=${callbackName}`
    document.head.appendChild(script)
  })
}

export async function findPreviewUrl(artist: string, title: string, signal?: AbortSignal): Promise<string | null> {
  const key = `${artist}|${title}`
  if (cache.has(key)) return cache.get(key) ?? null

  const url = `${ENDPOINT}?term=${encodeURIComponent(`${artist} ${title}`)}&entity=song&limit=10`

  let data: ItunesResponse
  try {
    data = await viaFetch(url, signal)
  } catch (error) {
    if (signal?.aborted) throw error
    data = await viaJsonp(url, signal)
  }

  const found = pickBest(data.results ?? [], artist, title)
  const secure = found ? found.replace(/^http:\/\//, 'https://') : null
  cache.set(key, secure)
  return secure
}
