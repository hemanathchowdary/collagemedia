"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Phone, Video, MoreVertical } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { useAuth } from "@/lib/contexts/AuthContext"
import chatService, { Chat, Message } from "@/lib/services/chatService"
import { toast } from "sonner"

// Type for contact display in the UI
interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastSeen: string;
  status: "online" | "offline";
  unreadCount?: number;
}

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [activeContact, setActiveContact] = useState<string | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  
  const { user } = useAuth()

  // Fetch chats on load
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats = await chatService.getChats()
        
        // Convert chats to contacts format
        const contactsList: Contact[] = chats.map(chat => {
          // Find the other participant (not the current user)
          const otherParticipant = Array.isArray(chat.participants) 
            ? chat.participants.find(p => 
                typeof p !== 'string' && p._id !== user?._id
              ) 
            : null
          
          // Get name and avatar
          const name = typeof otherParticipant === 'string' 
            ? 'Unknown' 
            : otherParticipant?.name || 'Unknown'
            
          // Create avatar initials
          const avatar = name.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()

          // Return formatted contact
          return {
            id: chat._id,
            name,
            avatar,
            lastSeen: 'Unknown',
            status: "offline",
            unreadCount: 0 // We'd set this from unread messages count
          }
        })
        
        setContacts(contactsList)
        
        // If there are chats, fetch messages for the first one
        if (chats.length > 0) {
          setActiveContact(chats[0]._id)
          await fetchMessages(chats[0]._id)
        }
      } catch (error) {
        console.error("Error fetching chats:", error)
        toast.error("Failed to load chats")
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchChats()
    }
  }, [user])
  
  // Fetch messages for a specific chat
  const fetchMessages = async (chatId: string) => {
    try {
      const chat = await chatService.getChat(chatId)
      if (Array.isArray(chat.messages)) {
        // Update messages state
        setMessages(prev => ({
          ...prev,
          [chatId]: chat.messages as Message[]
        }))
        
        // Mark chat as read
        await chatService.markChatAsRead(chatId)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Failed to load messages")
    }
  }
  
  // Switch active contact and fetch messages
  const handleContactSelect = async (contactId: string) => {
    setActiveContact(contactId)
    
    // If we don't have messages for this chat yet, fetch them
    if (!messages[contactId]) {
      await fetchMessages(contactId)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !activeContact) return
    
    setSendingMessage(true)
    try {
      const sentMessage = await chatService.sendMessage(activeContact, message.trim())
      
      // Update messages list
      setMessages(prev => ({
        ...prev,
        [activeContact]: [...(prev[activeContact] || []), sentMessage]
      }))
      
      // Clear input
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message")
    } finally {
      setSendingMessage(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen flex-col">
        <NavBar />
        <div className="flex flex-1 items-center justify-center">
          <p>Loading chats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Contacts sidebar */}
        <div className="w-full max-w-xs border-r bg-muted/20 hidden md:block">
          <div className="p-4">
            <Input placeholder="Search contacts..." className="mb-4" />
            <div className="space-y-2">
              {contacts.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No contacts yet</p>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                      activeContact === contact.id ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                    onClick={() => handleContactSelect(contact.id)}
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
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground truncate">New messages</p>
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs">
                            {contact.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat area */}
        {activeContact ? (
          <div className="flex flex-1 flex-col">
            {/* Chat header */}
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {contacts.find(c => c.id === activeContact)?.avatar}
                    </span>
                  </div>
                  {contacts.find(c => c.id === activeContact)?.status === "online" && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {contacts.find(c => c.id === activeContact)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {contacts.find(c => c.id === activeContact)?.lastSeen}
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
              {messages[activeContact] && messages[activeContact].length > 0 ? (
                messages[activeContact].map((msg, index) => {
                  // Determine if the message is from the current user
                  const isCurrentUser = typeof msg.sender === 'string' 
                    ? msg.sender === user?._id 
                    : msg.sender._id === user?._id
                    
                  return (
                    <div key={index} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                  disabled={sendingMessage}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={!message.trim() || sendingMessage}>
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}

