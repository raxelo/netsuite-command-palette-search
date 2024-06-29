function surroundWith(text: string, query: string, className: string) {
  if (!query) {
    return text
  }

  const escapedSearchTerm = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Create a regular expression for the search term with case-insensitive flag
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi')

  // Replace occurrences of the search term with highlighted version
  return text.replace(regex, `<span class="${className}">$1</span>`)
}

export function highlightExactQuery(text: string, exactTerm: string) {
  return surroundWith(text, exactTerm, 'nsc-highlight-yellow')
}

export function boldName(text: string) {
  return `<span class="nsc-highlight-bold">${text}</span>`
}
