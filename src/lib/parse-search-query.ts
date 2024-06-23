/**
 * @param input an input query, for example "SO: #135515"
 * @returns The search query, and the "exact" match.
 *
 * The exact match is determined by the text after a "?" character, for example:
 *
 * "Cu: John Doe?joe"
 *
 * In this example, the search query is "John Doe" and the exact match is "joe".
 *
 * This function is useful because NetSuite will often return results
 * that aren't an exact match of the inupt query
 */
export function extractAfterQuestionMark(input: string) {
  // Regular expression to match the part after '?'
  const regex = /(.*)\?(.*)/
  const match = input.match(regex)

  if (match) {
    // Extract the part after '?'
    const afterQuestionMark = match[2].trim()
    // Extract the part before '?'
    const beforeQuestionMark = match[1].trim()
    return [beforeQuestionMark, afterQuestionMark]
  }
  else {
    // If no '?' is found, return the input and an empty string
    return [input.trim(), '']
  }
}
