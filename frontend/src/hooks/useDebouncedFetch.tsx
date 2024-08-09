import { useState, useEffect } from 'react'

interface UseDebouncedFetchProps {
  endpoint: string
  query: string
  debounceTime?: number
}

export default function useDebouncedFetch<T>({
  endpoint,
  query,
  debounceTime = 300,
}: UseDebouncedFetchProps) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}?name=${encodeURIComponent(query)}`,
        )
        if (!response.ok) throw new Error('Failed to fetch data')

        const result = (await response.json()) as T[]
        setData(result)
      } catch (error) {
        console.error('Error fetching data:', error)
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    if (query.trim() === '') {
      setData([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const debounceTimer = setTimeout(fetchData, debounceTime)

    return () => clearTimeout(debounceTimer)
  }, [endpoint, query, debounceTime])

  return { data, isLoading }
}
