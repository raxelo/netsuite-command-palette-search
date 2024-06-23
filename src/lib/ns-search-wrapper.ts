const SEARCH_URL = '/app/common/autosuggest.nl'

export interface CommandSearchResult {
  key: string
  value: {
    sname: string
    key: string
    descr: string
    dashurl: string
    bedit: string
  }
}

export interface SuggestAPIResponse {
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

export function performSearch(term: string): Promise<SuggestAPIResponse> {
  const params = new URLSearchParams({
    cur_val: term,
    mapkey: 'uberautosuggest',
    circid: '2',
  })

  const response = fetch(`${SEARCH_URL}?${params.toString()}`).then(res => res.json())

  return response
}
