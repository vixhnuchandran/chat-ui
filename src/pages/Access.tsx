import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { Brain } from "lucide-react"
import { useUser } from "@clerk/clerk-react"

const Access = () => {
  const { isSignedIn } = useUser()
  const navigate = useNavigate()
  if (isSignedIn) {
    navigate("/home")
  }

  return (
    <header className="flex flex-col justify-center items-center h-screen  ">
      <div className="flex justify-center items-center space-x-2 mb-6">
        <Brain size={48} />
        <span className="text-3xl font-semibold">Chat-UI</span>
      </div>
      <div className="space-x-3 mb-28">
        <Link to={"https://classic-rooster-19.accounts.dev/sign-in"}>
          <Button variant={"outline"} className="w-[150px]">
            Login
          </Button>
        </Link>
        <Link to={"https://classic-rooster-19.accounts.dev/sign-up"}>
          <Button variant={"outline"} className="w-[150px]">
            SignUp
          </Button>
        </Link>
      </div>
    </header>
  )
}

export default Access
