import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center h-screen rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-6xl font-bold tracking-tight">404 Not found</h3>
        <p className="text-sm text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to={"/"} className="mb-10">
          <Button className="mt-4">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
