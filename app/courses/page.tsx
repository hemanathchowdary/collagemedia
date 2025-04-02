import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FileText, Users } from "lucide-react"

export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      code: "CS101",
      instructor: "Dr. Alan Turing",
      schedule: "Mon/Wed 10:00 AM - 11:30 AM",
      materials: 12,
      students: 45,
    },
    {
      id: 2,
      title: "Data Structures and Algorithms",
      code: "CS201",
      instructor: "Dr. Ada Lovelace",
      schedule: "Tue/Thu 1:30 PM - 3:00 PM",
      materials: 18,
      students: 32,
    },
    {
      id: 3,
      title: "Web Development",
      code: "CS301",
      instructor: "Prof. Tim Berners-Lee",
      schedule: "Friday 3:00 PM - 6:00 PM",
      materials: 24,
      students: 28,
    },
    {
      id: 4,
      title: "Database Systems",
      code: "CS401",
      instructor: "Dr. Edgar Codd",
      schedule: "Mon/Wed 2:00 PM - 3:30 PM",
      materials: 15,
      students: 22,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Courses</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 container py-6 px-4 md:px-6">
        <Tabs defaultValue="current">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="current">Current Semester</TabsTrigger>
              <TabsTrigger value="past">Past Courses</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Download Materials
            </Button>
          </div>

          <TabsContent value="current" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>
                      {course.code} • {course.instructor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{course.schedule}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{course.materials} course materials</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{course.students} enrolled students</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Course
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">Past Courses</h3>
              <p>Your completed courses from previous semesters will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upcoming Courses</h3>
              <p>Your future courses for upcoming semesters will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

