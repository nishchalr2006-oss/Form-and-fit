export interface FashionPhoto {
  id: string;
  url: string;
  originalUrl?: string;
  alt: string;
  photographer: string;
  photographerUrl?: string;
}

export interface FashionApiResponse {
  success: boolean;
  source: 'pexels-api' | 'cache' | 'fallback';
  hasApiKey: boolean;
  photos: FashionPhoto[];
  message?: string;
}

// In-memory frontend cache
const clientCache: Record<string, FashionPhoto[]> = {};

/**
 * Fetch curated fashion photography via server-side proxy
 * Never exposes Pexels API Key in client JavaScript.
 */
export async function fetchFashionImages(
  category: string = 'hero-campaign',
  count: number = 8
): Promise<FashionApiResponse> {
  const cacheKey = `${category}_${count}`;
  if (clientCache[cacheKey]) {
    return {
      success: true,
      source: 'cache',
      hasApiKey: true,
      photos: clientCache[cacheKey],
    };
  }

  try {
    const res = await fetch(`/api/pexels-fashion?category=${encodeURIComponent(category)}&count=${count}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data: FashionApiResponse = await res.json();
    if (data.photos && data.photos.length > 0) {
      clientCache[cacheKey] = data.photos;
    }
    return data;
  } catch (err) {
    console.warn('Failed to fetch fashion images from server API, using fallback photos:', err);
    return {
      success: false,
      source: 'fallback',
      hasApiKey: false,
      photos: [
        {
          id: 'fallback-1',
          url: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          alt: 'Editorial Fashion Model',
          photographer: 'Pexels Editorial',
        },
        {
          id: 'fallback-2',
          url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Menswear Fashion Model',
          photographer: 'Pexels',
        },
      ],
    };
  }
}
