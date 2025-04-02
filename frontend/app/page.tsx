import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserCircle, BookOpen, MessageCircle } from "lucide-react"

export default function Home() {
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
            <Link href="/profile" className="text-sm font-medium hover:underline">
              Profile
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
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Connect with Your College Community
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Chat with classmates, access course materials, and join topic-based chatrooms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link href="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <MessageCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Direct Messaging</h3>
                <p className="text-muted-foreground">
                  Connect with your classmates through private messages and stay in touch.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Course Access</h3>
                <p className="text-muted-foreground">
                  Access all your course materials in one place, organized by semester and subject.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <UserCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Topic Chatrooms</h3>
                <p className="text-muted-foreground">
                  Join predefined chatrooms based on interests, courses, or campus activities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
            <p className="text-sm text-muted-foreground">© 2025 CollegeMedia. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6">
              <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

