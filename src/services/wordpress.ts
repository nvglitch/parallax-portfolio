export interface PortfolioItem {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  featured_image_url: string | null
  meta: {
    aspect_ratio: string
    order: number
  }
}

const API_BASE_URL = import.meta.env.VITE_WP_API_URL || 'https://3.9wordpresstest.ddev.site/wp-json/wp/v2'

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio?per_page=100&_embed`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Sort by order meta field
    return data.sort((a: PortfolioItem, b: PortfolioItem) => {
      const orderA = a.meta?.order || 0
      const orderB = b.meta?.order || 0
      return orderA - orderB
    })
  } catch (error) {
    console.error('Error fetching portfolio items:', error)
    // Return fallback data if API fails
    return getFallbackData()
  }
}

// Fallback data (current hardcoded gallery items)
function getFallbackData(): PortfolioItem[] {
  const fallbackItems = [
    { name: 'a1', ext: 'jpg' },
    { name: 'a2', ext: 'jpg' },
    { name: 'a3', ext: 'jpg' },
    { name: 'a4', ext: 'jpg' },
    { name: 'a5', ext: 'jpg' },
    { name: 'b1', ext: 'jpg' },
    { name: 'b2', ext: 'jpg' },
    { name: 'b3', ext: 'jpg' },
    { name: 'b4', ext: 'jpg' },
    { name: 'p1', ext: 'png' },
    { name: 'p2', ext: 'png' },
  ]

  return fallbackItems.map((item, index) => ({
    id: index + 1,
    title: { rendered: item.name },
    content: { rendered: '' },
    featured_image_url: `${import.meta.env.BASE_URL}gallery/${item.name}.${item.ext}`,
    meta: {
      aspect_ratio: '210/297',
      order: index
    }
  }))
}
