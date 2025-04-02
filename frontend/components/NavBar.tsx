import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="text-2xl font-bold">
          CollegeMedia
        </Link>
        
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
          {user && (
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 