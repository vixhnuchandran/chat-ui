import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FilePenLineIcon, Trash2Icon } from "lucide-react"
import { Label } from "@/components/ui/label"
import Header from "@/components/Header"
import { useEffect, useState } from "react"
import axios from "axios"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

interface Document {
  id: number
  name: string
  url: string
  uploaded_at: string
  tags: string[]
}
import { useNavigate } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react"

const Documents = () => {
  const { toast } = useToast()

  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filename, setFilename] = useState("")
  const [tags, setTags] = useState("")
  const [isValidPDF, setIsValidPDF] = useState(false)

  const [editedDocument, setEditedDocument] = useState<Partial<Document>>({})
  const navigate = useNavigate()
  const { isSignedIn } = useUser()

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/")
    }
  }, [navigate, isSignedIn])

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch("https://db-link.vercel.app/api/read")
      const data = await response.json()
      const updatedDocuments = data.map((doc: Document) => ({
        ...doc,
        uploaded_at: new Date(doc.uploaded_at).toISOString().split("T")[0],
      }))
      setDocuments(updatedDocuments)
      return Promise.resolve()
    } catch (error) {
      console.error("Error fetching documents:", error)
      return Promise.reject(error)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
      setIsValidPDF(true)
    } else {
      setSelectedFile(null)
      setIsValidPDF(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile || !isValidPDF) {
      toast({
        variant: "destructive",
        title: "Invalid PDF file.",
      })
      return
    }

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const uploadResponse = await axios.post(
        "https://pdf-reader-iota.vercel.app/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      const { file_url } = uploadResponse.data

      await axios.post("https://db-link.vercel.app/api/create", {
        name: filename,
        url: file_url,
        tags: tags.split(","),
      })

      console.log("Document uploaded successfully.")
      fetchDocuments()
      toast({
        description: "Document uploaded successfully.",
        className: "text-left",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    }

    setSelectedFile(null)
    setFilename("")
    setTags("")
    setIsValidPDF(false)
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://db-link.vercel.app/api/delete/${id}`)
      console.log("Document deleted successfully.")
      fetchDocuments()
      toast({
        description: "Document deleted successfully.",
        className: "text-left",
      })
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof Document
  ): void => {
    const { value } = e.target
    setEditedDocument(prevDocument => ({
      ...prevDocument,
      [fieldName]: value.trim(),
    }))
  }

  const handleUpdate = async (documentId: number) => {
    console.log(editedDocument)
    try {
      await axios.put(
        `https://db-link.vercel.app/api/update/${documentId}`,
        editedDocument
      )
      console.log("Document updated successfully.")
      fetchDocuments()
    } catch (error) {
      console.error("Error updating document:", error)
    }
  }
  return (
    <>
      <SignedIn>
        <Header />
        <main className="">
          <Card className="">
            <CardHeader className="w-full">
              <div className="flex justify-between">
                <div>
                  <CardTitle>Document Base</CardTitle>
                  <CardDescription>Manage documents</CardDescription>
                </div>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Upload</Button>
                    </DialogTrigger>
                    <DialogContent className="">
                      <DialogHeader>
                        <DialogTitle>Upload</DialogTitle>
                        <DialogDescription>pdf only.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Input
                            id="filename"
                            type="file"
                            accept=".pdf"
                            className="col-span-4"
                            onChange={handleFileChange}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Filename
                          </Label>
                          <Input
                            id="filename"
                            placeholder="AGM YYYY-YYYY"
                            className="col-span-3"
                            onChange={e => setFilename(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Tags
                          </Label>
                          <Input
                            id="tags"
                            placeholder="separated by commas (tag1,tag2,...)"
                            className="col-span-3"
                            onChange={e => setTags(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="submit" onClick={handleSubmit}>
                            Submit
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Sl.no</TableHead>
                    <TableHead className="text-center">Document</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((document, index) => (
                    <TableRow key={index} className="bg-accent">
                      <TableCell className="text-center">
                        <div className="font-medium">{index + 1}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        {document.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {document.uploaded_at}
                      </TableCell>
                      <TableCell className="space-x-2 text-center">
                        {document.tags &&
                          document.tags.map((tag: string, tagIndex: number) => (
                            <Badge
                              key={tagIndex}
                              className="text-xs light:bg-gray-300 dark:bg-gray-700 "
                              variant="secondary"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex ">
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant={"link"}>
                                  <FilePenLineIcon className="h-5 w-5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="">
                                <DialogHeader></DialogHeader>
                                <Card className="">
                                  <CardHeader>
                                    <CardTitle className="text-2xl">
                                      Edit
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid gap-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="name">Filename</Label>
                                        <Input
                                          id="name"
                                          type="text"
                                          defaultValue={document.name}
                                          value={editedDocument.name}
                                          onChange={e =>
                                            handleInputChange(e, "name")
                                          }
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <div className="flex items-center">
                                          <Label htmlFor="tags">Tags</Label>
                                        </div>
                                        <Input
                                          id="tags"
                                          type="text"
                                          defaultValue={document.tags}
                                          value={editedDocument.tags}
                                          onChange={e =>
                                            handleInputChange(e, "tags")
                                          }
                                        />
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button
                                      type="submit"
                                      onClick={() => handleUpdate(document.id)}
                                    >
                                      Submit
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant={"link"}>
                                <Trash2Icon className="h-5 w-5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete this document.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(document.id)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
export default Documents
