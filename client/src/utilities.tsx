export function truncateAddress(address: string): string {
  const prefix = address.slice(2, 6)
  const suffix = address.slice(address.length-4, address.length)
  return `0x${prefix}...${suffix}`
}