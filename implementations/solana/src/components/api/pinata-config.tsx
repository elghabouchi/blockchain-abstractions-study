export const getPinataKeys = () => {
  const apiKey = process.env.PINATA_API_KEY
  const secretApiKey = process.env.PINATA_SECRET_API_KEY

  if (!apiKey || !secretApiKey) {
    throw new Error('Missing Pinata environment variables. Set PINATA_API_KEY and PINATA_SECRET_API_KEY.')
  }

  return { apiKey, secretApiKey }
}
