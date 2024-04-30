import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react"
import { HomeIcon } from "lucide-react"
import { ModeToggle } from "./theme/mode-toggle"

const Header = () => {
  const location = useLocation()

  const isHomePath =
    location.pathname === "/home" || location.pathname === "/home/"
  const isDocumentsPath =
    location.pathname === "/documents" || location.pathname === "/documents/"

  return (
    <header className="flex justify-between items-center  px-4 pt-4">
      <div>
        {isHomePath && (
          <Link to={"/documents"} className="flex justify-between items-center">
            <Button variant="outline">
              <span className="text-md">Document base</span>
            </Button>
          </Link>
        )}
        {isDocumentsPath && (
          <Link to={"/home"} className="flex justify-between items-center">
            <Button variant="link">
              <HomeIcon className="h-5" />
            </Button>
          </Link>
        )}
      </div>
      <div className="flex items-center space-x-3 justify-center align-middle">
        <ModeToggle />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  )
}

export default Header
