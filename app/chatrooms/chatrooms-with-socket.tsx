"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Users, Search, Plus, ArrowLeft } from "lucide-react"
import { useSocket } from "@/hooks/useSocket"

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

// This is a sample component to show how to integrate the Socket.io hook
// You can integrate these features into the existing page.tsx

export default function ChatroomsWithSocket() {
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("academic")
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomDescription, setNewRoomDescription] = useState("")
  const [newRoomCategory, setNewRoomCategory] = useState<"academic" | "campus" | "interests">("academic")
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const {
    isConnected,
    rooms,
    activeRoom,
    roomMessages,
    typingUsers,
    login,
    joinRoom,
    leaveRoom,
    sendRoomMessage,
    sendTypingStatus,
    createRoom
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

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current && activeRoom) {
      const element = messagesContainerRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [activeRoom, roomMessages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim() && activeRoom !== null) {
      sendRoomMessage(activeRoom, message);
      setMessage("");
    }
  };

  // Handle keydown events for sending messages
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle typing indicator
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (activeRoom !== null) {
      // Send typing indicator
      sendTypingStatus(activeRoom, true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set a new timeout to stop typing indicator after 2 seconds
      typingTimeoutRef.current = setTimeout(() => {
        if (activeRoom !== null) {
          sendTypingStatus(activeRoom, false);
        }
      }, 2000);
    }
  };

  // Handle creating a new room
  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      createRoom(newRoomName, newRoomDescription, newRoomCategory);
      setIsCreateRoomOpen(false);
      setNewRoomName("");
      setNewRoomDescription("");
    }
  };

  // Get typing users for active room
  const activeRoomTypingUsers = activeRoom !== null ? (typingUsers[activeRoom] || []) : [];
  
  // Filter rooms by category
  const filteredRooms = rooms.filter(room => room.category === activeTab);

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
            <h1 className="text-xl font-bold">Chat Rooms</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCreateRoomOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Room
            </Button>
            {isConnected ? (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Connected</span>
            ) : (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">Disconnected</span>
            )}
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 divide-x">
        {/* Rooms sidebar */}
        <div className="w-full max-w-xs border-r bg-muted/20 hidden md:block">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search rooms..." className="h-9" />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="campus">Campus</TabsTrigger>
                <TabsTrigger value="interests">Interests</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-2">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                    activeRoom === room.id ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                  onClick={() => joinRoom(room.id)}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{room.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {room.usersCount} active {room.usersCount === 1 ? 'user' : 'users'}
                    </p>
                  </div>
                </div>
              ))}
              
              {filteredRooms.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No rooms found in this category</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setIsCreateRoomOpen(true)}
                  >
                    Create Room
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {activeRoom !== null ? (
            <>
              {/* Chat header */}
              <div className="border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {rooms.find(r => r.id === activeRoom)?.name || 'Unknown Room'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {rooms.find(r => r.id === activeRoom)?.usersCount || 0} active users
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => activeRoom !== null && leaveRoom(activeRoom)}
                >
                  Leave Room
                </Button>
              </div>

              {/* Messages */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {(roomMessages[activeRoom] || []).map((msg, index) => {
                  const isCurrentUser = user?._id === msg.userId;
                  
                  return (
                    <div
                      key={index}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isCurrentUser && (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium">{msg.avatar}</span>
                        </div>
                      )}
                      <div>
                        {!isCurrentUser && (
                          <p className="text-xs text-muted-foreground mb-1">
                            {msg.sender}
                          </p>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            isCurrentUser
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
                    </div>
                  );
                })}
                
                {/* Typing indicators */}
                {activeRoomTypingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs">
                          {activeRoomTypingUsers[0].username.charAt(0)}
                        </span>
                      </div>
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-75"></div>
                          <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-150"></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activeRoomTypingUsers.length === 1
                            ? `${activeRoomTypingUsers[0].username} is typing...`
                            : `${activeRoomTypingUsers.length} people are typing...`}
                        </p>
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
                <h2 className="text-xl font-semibold mb-2">Select a chat room</h2>
                <p className="text-muted-foreground mb-4">Choose a room to start chatting</p>
                <Button onClick={() => setIsCreateRoomOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create a new room
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create room dialog */}
      <Dialog open={isCreateRoomOpen} onOpenChange={setIsCreateRoomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new chat room</DialogTitle>
            <DialogDescription>
              Create a new room for discussions. Choose a category that best fits the topic.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newRoomCategory}
                onValueChange={(value) => setNewRoomCategory(value as any)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="campus">Campus</SelectItem>
                  <SelectItem value="interests">Interests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateRoomOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRoom} disabled={!newRoomName.trim()}>
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 