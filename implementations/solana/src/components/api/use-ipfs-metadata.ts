'use client'

import { useQuery } from '@tanstack/react-query'
import { PinataService } from './api-ui'

export function useIpfsMetadata<TMetadata>(cid?: string) {
  return useQuery({
    queryKey: ['ipfs-metadata', cid],
    enabled: Boolean(cid),
    queryFn: async () => {
      if (!cid) return null

      const metadata = await PinataService.fetchMetadata<TMetadata>(cid)
      if (!metadata) {
        throw new Error('Failed to fetch metadata from IPFS.')
      }

      return metadata
    },
  })
}
