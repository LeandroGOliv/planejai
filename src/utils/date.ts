export function formatDate(isoDate?: string): string {
  if (!isoDate) {
    return '—'
  }

  const date = new Date(isoDate)

  if (isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
