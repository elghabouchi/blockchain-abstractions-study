'use client';
import { ArticleAccountData, ProgramAccount, PurchaseHistoryAccountData } from '@/lib/marketplace/types'

export const PinataService = {
  async uploadMetadata<TMetadata>(metadata: TMetadata): Promise<string> {
    const res = await fetch('/api/pinata/metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata),
    })

    if (!res.ok) {
      throw new Error(await getErrorMessage(res, 'Pinata upload failed.'))
    }

    const data = (await res.json()) as { cid?: string }
    if (!data.cid) throw new Error('Pinata upload did not return a CID.')

    return data.cid
  },

  async deleteFile(cid: string): Promise<void> {
    const res = await fetch(`/api/pinata/metadata?cid=${encodeURIComponent(cid)}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error(await getErrorMessage(res, 'Pinata delete failed.'))
    }
  },

  async fetchMetadata<TMetadata>(cid: string): Promise<TMetadata | null> {
    try {
      const url = `https://ipfs.io/ipfs/${cid}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('IPFS fetch failed');
  
      return (await res.json()) as TMetadata;
    } catch (err) {
      console.error('IPFS metadata fetch failed:', err);
      return null;
    }
  },
};

async function getErrorMessage(res: Response, fallback: string) {
  try {
    const data = (await res.json()) as { error?: string }
    return data.error ?? fallback
  } catch {
    return fallback
  }
}

export const getMaxIdArticle = (
  accountsData: ProgramAccount<ArticleAccountData>[] | undefined
): number => {
  if (!accountsData) return 0;

  const idArticles = accountsData
    .map((article, i: number) => {
      const id = Number(article?.account?.articleId);
      if (isNaN(id)) {
        console.warn(`Article ${i} has an invalid articleId:`, article?.account?.articleId);
      }
      return id;
    })
    .filter((id: number) => !isNaN(id));

  if (idArticles.length === 0) {
    console.warn('No valid articleId found');
    return 0;
  }

  return Math.max(...idArticles);
};

export const getMaxIdHistory = (
  accountsData: ProgramAccount<PurchaseHistoryAccountData>[] | undefined
): number => {
  if (!accountsData) return 0;

  const historyIds = accountsData
    .map((purchaseHistory, i: number) => {
      const id = Number(purchaseHistory?.account?.historyId);
      if (isNaN(id)) {
        console.warn(`Purchase history ${i} has an invalid historyId:`, purchaseHistory?.account?.historyId);
      }
      return id;
    })
    .filter((id: number) => !isNaN(id));

  if (historyIds.length === 0) {
    console.warn('No valid historyId found');
    return 0;
  }

  return Math.max(...historyIds);
};
export const getMaxIdGlobal = (
  articlesData: ProgramAccount<ArticleAccountData>[] | undefined,
  purchaseHistoryData: ProgramAccount<PurchaseHistoryAccountData>[] | undefined
): number => {
  const maxArticle = getMaxIdArticle(articlesData);
  const maxHistory = getMaxIdHistory(purchaseHistoryData);
  
  return Math.max(maxArticle, maxHistory);
};
