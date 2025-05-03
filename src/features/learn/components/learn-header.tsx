"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, BookOpen, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export default function LearnHeader() {
    const [searchOpen, setSearchOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/learn" className="flex items-center gap-2">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <BookOpen className="h-6 w-6 text-primary" />
                        </motion.div>
                        <motion.span
                            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            LearnAI
                        </motion.span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {searchOpen ? (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "300px", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="relative"
                        >
                            <Input
                                type="search"
                                placeholder="Search documents, flashcards, notes..."
                                className="w-full pr-8"
                                autoFocus
                                onBlur={() => setSearchOpen(false)}
                            />
                            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        </motion.div>
                    ) : (
                        <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                            <Search className="h-5 w-5" />
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium">Quiz reminder</span>
                                    <span className="text-sm text-muted-foreground">Your Biology 101 quiz is due tomorrow</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium">Study group invitation</span>
                                    <span className="text-sm text-muted-foreground">Alex invited you to join &quot;Physics Masters&quot;</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-center text-primary">
                                View all notifications
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Subscription</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

