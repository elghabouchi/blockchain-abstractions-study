import { PublicKey } from '@solana/web3.js'

export function formatSol(value: number) {
  return `${value.toFixed(6)} SOL`
}

export function formatDate(value?: number, withTime = false) {
  if (!value) return 'N/A'

  return new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    ...(withTime ? { hour: '2-digit' as const, minute: '2-digit' as const } : {}),
  })
}

export function shortAddress(address: PublicKey | string, len = 4) {
  const value = address.toString()
  if (value.length <= len * 2) return value

  return `${value.slice(0, len)}...${value.slice(-len)}`
}

export function truncateWords(value: string, maxWords = 10) {
  const words = value.trim().split(/\s+/)
  if (words.length <= maxWords) return value

  return `${words.slice(0, maxWords).join(' ')}...`
}
