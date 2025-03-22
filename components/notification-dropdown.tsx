"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Sample recent messages data
const recentMessages = [
  {
    id: 1,
    sender: "Alex Johnson",
    avatar: "AJ",
    content: "Hey, how's your project coming along?",
    timestamp: "10 min ago",
    unread: true,
  },
  {
    id: 2,
    sender: "Sarah Williams",
    avatar: "SW",
    content: "Did you get the notes from yesterday's lecture?",
    timestamp: "30 min ago",
    unread: true,
  },
  {
    id: 3,
    sender: "Michael Brown",
    avatar: "MB",
    content: "Are you joining the study group tonight?",
    timestamp: "2 hours ago",
    unread: true,
  },
  {
    id: 4,
    sender: "Emily Davis",
    avatar: "ED",
    content: "Don't forget about the team meeting tomorrow!",
    timestamp: "5 hours ago",
    unread: false,
  },
  {
    id: 5,
    sender: "David Wilson",
    avatar: "DW",
    content: "Thanks for helping with the assignment.",
    timestamp: "Yesterday",
    unread: false,
  },
]

export function NotificationDropdown() {
  const [unreadCount, setUnreadCount] = useState(recentMessages.filter((msg) => msg.unread).length)
  const [messages, setMessages] = useState(recentMessages)

  const markAllAsRead = () => {
    setUnreadCount(0)
    setMessages(
      messages.map((msg) => ({
        ...msg,
        unread: false,
      })),
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Recent Messages</span>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {messages.map((message) => (
          <DropdownMenuItem key={message.id} className="cursor-pointer">
            <Link href="/chat" className="flex items-start gap-3 py-2 w-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{message.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${message.unread ? "font-semibold" : ""}`}>{message.sender}</p>
                  <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                </div>
                <p className="text-xs truncate">{message.content}</p>
              </div>
              {message.unread && <div className="h-2 w-2 rounded-full bg-primary mt-1.5"></div>}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/chat" className="w-full text-center cursor-pointer">
            <Button variant="ghost" size="sm" className="w-full">
              View All Messages
            </Button>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

