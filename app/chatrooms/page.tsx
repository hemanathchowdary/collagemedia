"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Users, Search, Plus } from "lucide-react"

type ChatRoom = {
  id: number
  name: string
  description: string
  members: number
  category: "academic" | "campus" | "interests"
  messages: ChatMessage[]
}

type ChatMessage = {
  id: number
  sender: string
  avatar: string
  content: string
  timestamp: string
}

export default function ChatroomsPage() {
  const [message, setMessage] = useState("")
  const [activeRoom, setActiveRoom] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("academic")

  const chatrooms: ChatRoom[] = [
    {
      id: 1,
      name: "CS Study Group",
      description: "Discuss assignments and study for exams together",
      members: 42,
      category: "academic",
      messages: [
        {
          id: 1,
          sender: "Alex Johnson",
          avatar: "AJ",
          content: "Has anyone started on the algorithm assignment yet?",
          timestamp: "10:30 AM",
        },
        {
          id: 2,
          sender: "Sarah Williams",
          avatar: "SW",
          content: "Yes, I'm working on problem 3 right now. It's quite challenging!",
          timestamp: "10:32 AM",
        },
        {
          id: 3,
          sender: "Michael Brown",
          avatar: "MB",
          content: "I found a great resource for dynamic programming if anyone needs help.",
          timestamp: "10:35 AM",
        },
      ],
    },
    {
      id: 2,
      name: "Math Help",
      description: "Get help with calculus, linear algebra, and more",
      members: 28,
      category: "academic",
      messages: [
        {
          id: 1,
          sender: "Emily Davis",
          avatar: "ED",
          content: "Can someone explain eigenvalues to me?",
          timestamp: "Yesterday",
        },
        {
          id: 2,
          sender: "David Wilson",
          avatar: "DW",
          content: "Sure, eigenvalues are special scalars associated with linear systems...",
          timestamp: "Yesterday",
        },
      ],
    },
    {
      id: 3,
      name: "Campus Events",
      description: "Stay updated on upcoming events and activities",
      members: 118,
      category: "campus",
      messages: [
        {
          id: 1,
          sender: "Student Council",
          avatar: "SC",
          content: "Don't forget about the spring festival this weekend!",
          timestamp: "2 days ago",
        },
        {
          id: 2,
          sender: "Jane Smith",
          avatar: "JS",
          content: "Will there be food trucks again this year?",
          timestamp: "2 days ago",
        },
        {
          id: 3,
          sender: "Student Council",
          avatar: "SC",
          content: "Yes, there will be 10 different food trucks on the main quad.",
          timestamp: "2 days ago",
        },
      ],
    },
    {
      id: 4,
      name: "Job Opportunities",
      description: "Share internship and job postings",
      members: 95,
      category: "campus",
      messages: [
        {
          id: 1,
          sender: "Career Center",
          avatar: "CC",
          content: "New tech internships posted on the job board!",
          timestamp: "3 days ago",
        },
      ],
    },
    {
      id: 5,
      name: "Gaming Club",
      description: "Discuss games and organize gaming sessions",
      members: 64,
      category: "interests",
      messages: [
        {
          id: 1,
          sender: "Ryan Park",
          avatar: "RP",
          content: "Anyone up for a tournament this weekend?",
          timestamp: "1 week ago",
        },
        {
          id: 2,
          sender: "Lisa Chen",
          avatar: "LC",
          content: "I'm in! What games are we playing?",
          timestamp: "1 week ago",
        },
      ],
    },
  ]

  const filteredRooms = chatrooms.filter((room) => room.category === activeTab)

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, you would send this to your backend
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Chatrooms</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 container py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Chatroom list */}
          <div className="w-full md:w-1/3 lg:w-1/4 space-y-4">
            <div className="flex items-center gap-2">
              <Input placeholder="Search chatrooms..." className="flex-1" />
              <Button size="icon" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="campus">Campus</TabsTrigger>
                <TabsTrigger value="interests">Interests</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-2 mt-2">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      activeRoom === room.id ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                    onClick={() => setActiveRoom(room.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{room.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        {room.members}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">{room.description}</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Chat area */}
          {activeRoom ? (
            <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
              <div className="border-b p-4">
                <h2 className="font-bold">{chatrooms.find((r) => r.id === activeRoom)?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {chatrooms.find((r) => r.id === activeRoom)?.members} members
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatrooms
                  .find((r) => r.id === activeRoom)
                  ?.messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium">{msg.avatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{msg.sender}</p>
                          <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                        </div>
                        <p className="text-sm mt-1">{msg.content}</p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center border rounded-lg">
              <div className="text-center p-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-bold mb-2">Select a Chatroom</h2>
                <p className="text-muted-foreground max-w-md">
                  Choose a chatroom from the list to join the conversation with your college community.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

