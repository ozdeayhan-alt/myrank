export function getAvatarUrl(username: string): string {
  return (
    'https://api.dicebear.com/9.x/avataaars/svg?seed=' +
    encodeURIComponent(username)
  )
}

export function formatDisplayName(username: string): string {
  return username
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
