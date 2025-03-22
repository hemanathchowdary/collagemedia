"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users, Heart, MessageSquare, Share, MoreHorizontal, Image, Smile, MapPin, LogOut } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { toast } from "sonner"

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    // Get user data from localStorage
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
    
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    
    toast.success('Logged out successfully')
    router.push('/login')
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  // Sample posts data
  const posts = [
    {
      id: 1,
      author: {
        name: "Alex Johnson",
        avatar: "AJ",
        department: "Computer Science",
      },
      content:
        "Just finished my final project for Web Development class! Check out this responsive website I built using React and Next.js. So proud of how it turned out! #WebDev #Programming",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      shares: 3,
      image: "/placeholder.svg?height=300&width=600",
    },
    {
      id: 2,
      author: {
        name: "Sarah Williams",
        avatar: "SW",
        department: "Biology",
      },
      content:
        "Our research team just published a paper on sustainable ecosystems! It's been a long journey but so worth it. Thanks to everyone who supported us through this process.",
      timestamp: "5 hours ago",
      likes: 42,
      comments: 15,
      shares: 7,
    },
    {
      id: 3,
      author: {
        name: "Campus Events",
        avatar: "CE",
        department: "Official",
      },
      content:
        "🎉 Spring Festival is happening this weekend! Join us for food, music, and fun activities on the main quad. Don't miss the live performances starting at 7 PM on Saturday!",
      timestamp: "Yesterday",
      likes: 87,
      comments: 23,
      shares: 31,
      image: "/placeholder.svg?height=300&width=600",
    },
  ]

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="font-bold text-xl">
              CollegeMedia
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
            <Link href="/courses" className="text-sm font-medium hover:underline">
              Courses
            </Link>
            <Link href="/chat" className="text-sm font-medium hover:underline">
              Chat
            </Link>
            <Link href="/chatrooms" className="text-sm font-medium hover:underline">
              Chatrooms
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <Avatar>
                    {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                    <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-[1fr_2fr_1fr]">
          {/* Left sidebar */}
          <div className="space-y-6 hidden md:block">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Computer Science 101", "Data Structures", "Web Development"].map((course, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{course}</p>
                        <p className="text-xs text-muted-foreground">
                          {["Mon/Wed", "Tue/Thu", "Friday"][i]} • {["10:00 AM", "1:30 PM", "3:00 PM"][i]}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link href="/courses">
                    <Button variant="outline" className="w-full mt-2">
                      View All Courses
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Chatrooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["CS Study Group", "Campus Events", "Job Opportunities"].map((room, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{room}</p>
                        <p className="text-xs text-muted-foreground">{[42, 18, 31][i]} active users</p>
                      </div>
                    </div>
                  ))}
                  <Link href="/chatrooms">
                    <Button variant="outline" className="w-full mt-2">
                      View All Chatrooms
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content - Posts feed */}
          <div className="space-y-6">
            {/* Create post card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                    <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <Textarea placeholder="What's on your mind?" className="resize-none" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Image className="h-4 w-4 mr-2" />
                          Photo
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          Location
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Smile className="h-4 w-4 mr-2" />
                          Feeling
                        </Button>
                      </div>
                      <Button size="sm">Post</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{post.author.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.author.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>{post.author.department}</span>
                          <span className="mx-1">•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{post.content}</p>
                  {post.image && (
                    <div className="rounded-md overflow-hidden mb-4">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post attachment"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>{post.likes} likes</div>
                    <div>
                      {post.comments} comments • {post.shares} shares
                    </div>
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="py-2">
                  <div className="flex items-center justify-between w-full">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6 hidden lg:block">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Spring Festival", date: "This Weekend", location: "Main Quad" },
                    { name: "Career Fair", date: "Next Tuesday", location: "Student Center" },
                    { name: "Hackathon", date: "May 15-16", location: "Engineering Building" },
                  ].map((event, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-sm font-medium">{event.name}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{event.date}</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Events
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>People You May Know</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Emily Davis", department: "Computer Science", mutual: 5 },
                    { name: "Michael Brown", department: "Engineering", mutual: 3 },
                    { name: "Lisa Chen", department: "Business", mutual: 2 },
                  ].map((person, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{person.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {person.department} • {person.mutual} mutual connections
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

