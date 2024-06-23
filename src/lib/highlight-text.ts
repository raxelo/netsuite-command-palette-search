/**
 * @param text Any text
 * @param searchTerm an exact search term
 * @returns HTML-highlighted representation of the input text, with the "searchTerm"
 * highlighted if any occurrences are foundo
 */
export function highlightText(text: string, searchTerm: string) {
  if (!searchTerm)
    return text

  // Escape special characters in the search term
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Create a regular expression for the search term with case-insensitive flag
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi')

  // Replace occurrences of the search term with highlighted version
  return text.replace(regex, '<span style="background-color: yellow">$1</span>')
}
