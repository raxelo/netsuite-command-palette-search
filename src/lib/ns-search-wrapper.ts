import type { SearchItem } from './search-item'

const SEARCH_URL = '/app/common/autosuggest.nl'

interface SuggestAPIResponse {
  circid: string
  asuuk: string
  asheep: string
  autofill: {
    sname: string
    key: string
    descr: string
    dashurl: string
    bedit: string
  }[]
}

export async function performSearch(term: string): Promise<SearchItem[]> {
  const params = new URLSearchParams({
    cur_val: term,
    mapkey: 'uberautosuggest',
    circid: '2',
  })

  const response = await fetch(`${SEARCH_URL}?${params.toString()}`).then(res => res.json()) as SuggestAPIResponse

  return response.autofill.map(el => ({
    displayName: el.sname,
    description: el.descr,
    menuEntry: false,
    url: el.key,
    key: `ns:${el.descr} ${el.sname} ${el.key}`,
  }))
}
