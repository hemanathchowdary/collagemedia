"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react"
import { useSocket, PrivateMessage } from "@/hooks/useSocket"

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

// This is a sample component to show how to integrate the Socket.io hook
// You can integrate these features into the existing page.tsx

export default function ChatWithSocket() {
  const [message, setMessage] = useState("")
  const [activeContact, setActiveContact] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  const {
    isConnected,
    privateMessages,
    privateTypingUsers,
    login,
    sendPrivateMessage,
    sendPrivateTypingStatus
  } = useSocket()

  // Check if user is logged in and get user data
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    try {
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        
        // If connected to socket, login with user data and token
        if (isConnected && parsedUser._id) {
          login(parsedUser._id, parsedUser.name, parsedUser.avatar || parsedUser.name.charAt(0), token || undefined);
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
    
    setIsLoading(false)
  }, [isConnected, login, router])

  // Example contacts - in a real app, these would come from an API or database
  const contacts = [
    { userId: "user1", name: "Alex Johnson", avatar: "AJ", lastSeen: "online", status: "online", unreadCount: 3 },
    { userId: "user2", name: "Sarah Williams", avatar: "SW", lastSeen: "5m ago", status: "online" },
    { userId: "user3", name: "Michael Brown", avatar: "MB", lastSeen: "1h ago", status: "offline" },
    { userId: "user4", name: "Emily Davis", avatar: "ED", lastSeen: "3h ago", status: "offline", unreadCount: 1 },
    { userId: "user5", name: "David Wilson", avatar: "DW", lastSeen: "yesterday", status: "offline" },
  ]

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim() && activeContact) {
      sendPrivateMessage(activeContact, message);
      setMessage("");
    }
  }

  // Handle keydown events for sending messages
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  // Handle typing indicator
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (activeContact) {
      // Send typing indicator
      sendPrivateTypingStatus(activeContact, true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set a new timeout to stop typing indicator after 2 seconds
      typingTimeoutRef.current = setTimeout(() => {
        if (activeContact) {
          sendPrivateTypingStatus(activeContact, false);
        }
      }, 2000);
    }
  }

  // Get messages for the active contact
  const activeContactMessages = activeContact ? (privateMessages[activeContact] || []) : [];
  const isContactTyping = activeContact ? privateTypingUsers[activeContact] : false;

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Dashboard</span>
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Chat</h1>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Connected</span>
            ) : (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">Disconnected</span>
            )}
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 divide-x">
        {/* Contacts sidebar */}
        <div className="w-full max-w-xs border-r bg-muted/20 hidden md:block">
          <div className="p-4">
            <Input placeholder="Search contacts..." className="mb-4" />
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.userId}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                    activeContact === contact.userId ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                  onClick={() => setActiveContact(contact.userId)}
                >
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{contact.avatar}</span>
                    </div>
                    {contact.status === "online" && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.lastSeen}</p>
                    </div>
                    {contact.unreadCount && (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground truncate">New messages</p>
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs">
                          {contact.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {activeContact ? (
            <>
              {/* Chat header */}
              <div className="border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {contacts.find((c) => c.userId === activeContact)?.avatar}
                      </span>
                    </div>
                    {contacts.find((c) => c.userId === activeContact)?.status === "online" && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{contacts.find((c) => c.userId === activeContact)?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contacts.find((c) => c.userId === activeContact)?.lastSeen}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                    <span className="sr-only">Call</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                    <span className="sr-only">Video call</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">More options</span>
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeContactMessages.map((msg, index) => {
                  // Check if message is from the user
                  const isFromUser = msg.to === activeContact;
                  
                  return (
                    <div
                      key={index}
                      className={`flex ${isFromUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isFromUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {isContactTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-75"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
                <p className="text-muted-foreground">Choose a contact to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 