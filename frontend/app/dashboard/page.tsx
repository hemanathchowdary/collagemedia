import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Bell } from "lucide-react"

export default function Dashboard() {
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
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 px-4 md:px-6">
        <div className="flex flex-col gap-4 md:gap-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Your latest conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">U{i}</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">User {i}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Hey, did you get the notes from yesterday's class?
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">2m ago</div>
                    </div>
                  ))}
                  <Link href="/chat">
                    <Button variant="outline" className="w-full mt-2">
                      View All Messages
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Courses</CardTitle>
                <CardDescription>Your current semester courses</CardDescription>
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
                <CardDescription>Popular discussion groups</CardDescription>
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
                        <p className="text-xs text-muted-foreground">
                          {[42, 18, 31][i]} active users • {["2", "5", "1"][i]} new messages
                        </p>
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
        </div>
      </main>
    </div>
  )
}

