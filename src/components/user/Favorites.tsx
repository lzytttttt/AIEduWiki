"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "aieduwiki:favorites"

interface FavoritesStore {
  [slug: string]: { addedAt: string; domain: string }
}

function getFavorites(): FavoritesStore {
  if (typeof window === "undefined") return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function setFavorites(favs: FavoritesStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs))
}

interface FavoriteToggleProps {
  slug: string
  domain: string
  className?: string
}

export function FavoriteToggle({ slug, domain, className }: FavoriteToggleProps) {
  const [isFavorite, setIsFavorite] = React.useState(false)

  React.useEffect(() => {
    const favs = getFavorites()
    setIsFavorite(slug in favs)
  }, [slug])

  const toggle = () => {
    const favs = getFavorites()
    if (slug in favs) {
      delete favs[slug]
      setIsFavorite(false)
    } else {
      favs[slug] = { addedAt: new Date().toISOString(), domain }
      setIsFavorite(true)
    }
    setFavorites(favs)
  }

  return (
    <button
      onClick={toggle}
      aria-label={isFavorite ? "取消收藏" : "收藏此页面"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
        isFavorite
          ? "text-yellow-500 hover:text-yellow-600 bg-yellow-500/10"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        className
      )}
    >
      <Star
        className={cn("h-4 w-4", isFavorite && "fill-current")}
      />
      {isFavorite ? "已收藏" : "收藏"}
    </button>
  )
}
