export function titleCase(value = '') {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() || ''}${word.slice(1)}`)
    .join(' ')
}
