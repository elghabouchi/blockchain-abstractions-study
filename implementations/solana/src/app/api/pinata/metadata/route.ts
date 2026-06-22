import { NextResponse } from 'next/server'
import { getPinataKeys } from '@/components/api/pinata-config'

export async function POST(request: Request) {
  try {
    const metadata = await request.json()
    const { apiKey, secretApiKey } = getPinataKeys()

    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretApiKey,
      },
      body: JSON.stringify(metadata),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Pinata upload failed.' }, { status: res.status })
    }

    const data = (await res.json()) as { IpfsHash?: string }
    if (!data.IpfsHash) {
      return NextResponse.json({ error: 'Pinata did not return an IPFS hash.' }, { status: 502 })
    }

    return NextResponse.json({ cid: data.IpfsHash })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected Pinata upload error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const cid = searchParams.get('cid')

  if (!cid) {
    return NextResponse.json({ error: 'Missing CID.' }, { status: 400 })
  }

  try {
    const { apiKey, secretApiKey } = getPinataKeys()
    const res = await fetch(`https://api.pinata.cloud/pinning/unpin/${encodeURIComponent(cid)}`, {
      method: 'DELETE',
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretApiKey,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Pinata delete failed.' }, { status: res.status })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected Pinata delete error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
