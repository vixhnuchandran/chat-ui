import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BrainIcon, MessageSquareTextIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SideNavBarProps {
  activeLink: string
}
interface Document {
  id: number
  name: string
  url: string
  uploaded_at: string
  tags: string[]
}

const SideNavBar: React.FC<SideNavBarProps> = ({ activeLink }) => {
  const [open, setOpen] = React.useState(false)
  const [selectedDoc, setSelectedDoc] = React.useState<Document>()
  const [docs, setDocs] = useState<Document[]>([])
  const [chats, setChats] = useState<{ name: string }[]>([
    { name: "chat1-vndfuigvbnsdflvndskvsd" },
    { name: "chat2-rwyrwyrfgjdfhffbsbsddg" },
    { name: "chat3-vasdvbasdbdbdbncbcbbcb" },
    { name: "chat4-bzdbsdcbbcbcbsegdbdndf" },
    { name: "chat5-avqebsdbsdffcngmymggnm" },
    { name: "chat6-vasdvdbsdbfnfvngngjnmg" },
    { name: "chat7-vsavedbsndfnfgmhkghmhm" },
    { name: "chat8-vsdvsdvbsdfbfbnfbfbnfb" },
  ])

  const fetchDocuments = async () => {
    try {
      const response = await fetch("https://db-link.vercel.app/api/read")
      const data = await response.json()

      setDocs(data)
      return Promise.resolve()
    } catch (error) {
      console.error("Error fetching documents:", error)
      return Promise.reject(error)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleAddChat = () => {
    if (selectedDoc) {
      const updatedChats = [...chats, { name: selectedDoc.name }]
      setChats(updatedChats)
    }
  }
  return (
    <>
      <div className="flex h-full flex-col gap-2 overflow-auto">
        <div className="flex  items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/home" className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 font-semibold">
              <BrainIcon className="h-6 w-6 " />
              <span className="">Chat-UI</span>
            </div>
            <div className="flex items-center">
              <MessageSquareTextIcon className="h-5 w-5  hover:bg-muted " />
            </div>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {chats.map((chat, index) => (
              <Link
                key={index}
                to={`#${chat.name}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  activeLink === `/${chat.name}`
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                {chat.name}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={"outline"}
                className=" py-2 px-4 rounded-lg mb-4 mx-4  w-64"
              >
                New chat
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2 mt-auto">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild className="flex justify-between ">
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-label="Load a preset..."
                        aria-expanded={open}
                        className="flex-1 "
                      >
                        {selectedDoc ? selectedDoc.name : "Select a document"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search presets..." />
                        <CommandList>
                          <CommandEmpty>No presets found.</CommandEmpty>
                          <CommandGroup heading="Documents">
                            {docs.map(doc => (
                              <CommandItem
                                key={doc.id}
                                onSelect={() => {
                                  setSelectedDoc(doc)
                                  setOpen(false)
                                }}
                              >
                                {doc.name}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    selectedDoc?.name === doc.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="px-3"
                  onClick={handleAddChat}
                >
                  <span className="sr-only">Copy</span>
                  <Plus className="h-6 w-6 font-bold" />
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose>
                  <Button variant={"secondary"}>Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}

export default SideNavBar
