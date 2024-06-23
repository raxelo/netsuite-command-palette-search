import { extractAfterQuestionMark } from './parse-search-query'

export function filterFunction(list: string[], q: string) {
  return list.filter((item) => {
    const [searchQuery, exact] = extractAfterQuestionMark(q)

    // If no search query is present, show all results
    if (!searchQuery.length)
      return true

    // Command Items have their values set to "type:name"
    const [type, itemName] = item.split(':')

    // The "disabled" type is always shown, regardless of filtering
    if (type === 'disabled')
      return true

    // If the user specified an exact match ("search?exactMatch"
    // then only return exact matches
    if (exact)
      return itemName.toLowerCase().includes(exact.toLowerCase())

    // If no exact match was specified, show all results
    return true
  })
}
