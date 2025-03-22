"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserCircle, BookOpen, MessageCircle } from "lucide-react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    
    if (isLoggedIn) {
      // Redirect to dashboard if already logged in
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <h1 className="text-2xl font-bold">CollegeMedia</h1>
          <nav className="hidden md:flex items-center gap-6">
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
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-24 md:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Connect with Your Campus Community
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    CollegeMedia helps you connect with classmates, join study groups, and stay updated on campus events.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="w-full">Get Started</Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full">Login</Button>
                  </Link>
                </div>
              </div>
              <img
                src="/placeholder.svg?height=550&width=750"
                width={550}
                height={550}
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
                  <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                    Everything you need to stay connected and collaborate with your campus community.
                  </p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center space-y-4 p-6 bg-muted/40 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-center">Course Collaboration</h3>
                  <p className="text-muted-foreground text-center">
                    Join course-specific groups to collaborate on assignments, share resources, and form study groups.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 p-6 bg-muted/40 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-center">Real-time Chat</h3>
                  <p className="text-muted-foreground text-center">
                    Stay connected with direct messaging and topic-based chat rooms for discussions with classmates.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 p-6 bg-muted/40 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-center">Campus Profile</h3>
                  <p className="text-muted-foreground text-center">
                    Create your academic profile to connect with students who share your interests and courses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 CollegeMedia. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/help" className="text-sm text-muted-foreground hover:underline">
              Help
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

