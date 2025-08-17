"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-md">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 text-gray-900 dark:text-gray-100 border-l-4 border-l-transparent hover:border-l-blue-500">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 border-l-4 border-l-transparent hover:border-l-gray-500">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 px-3 py-2 text-gray-900 dark:text-gray-100 border-l-4 border-l-transparent hover:border-l-purple-500">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
