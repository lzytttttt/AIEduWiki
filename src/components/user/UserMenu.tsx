"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Star, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function useFavorites() {
  const [favorites, setFavorites] = React.useState<
    Record<string, { addedAt: string; domain: string }>
  >({})

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("aieduwiki:favorites")
      if (stored) setFavorites(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])

  return favorites
}

export function UserMenu() {
  const { data: session } = useSession()
  const favorites = useFavorites()
  const favoriteCount = Object.keys(favorites).length

  if (!session?.user) return null

  const user = session.user as Record<string, unknown>
  const name = (user.name as string) ?? "User"
  const image = user.image as string | undefined
  const login = (user.login as string) ?? name
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/30 transition-all">
          {image && <AvatarImage src={image} alt={name} />}
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              @{login}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/favorites" className="flex items-center gap-2 cursor-pointer">
              <Star className="h-4 w-4" />
              <span>收藏页面</span>
              {favoriteCount > 0 && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {favoriteCount}
                </span>
              )}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
