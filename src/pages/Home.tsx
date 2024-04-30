import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import SideNavBar from "@/components/SideNavBar"
import Header from "@/components/Header"
import { useState } from "react"

import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react"
import { CornerDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Home() {
  const [responseData, setResponseData] = useState("")
  const [newContent, setNewContent] = useState("")

  const postContent = async () => {
    const url =
      "https://pdf-reader-iota.vercel.app/answer?url=https://story-brain-files.s3.ap-southeast-1.amazonaws.com/pdf-reader/229defbb0cee6f02673a5cde290d0673e75a0dc31cec43989c8ab2a4eca7e1bb.pdf"

    const payload = [
      {
        role: "user",
        content: newContent,
      },
    ]

    console.log(payload)
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!response.body) {
        throw new Error("Response body is null")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let { value, done } = await reader.read()
      while (!done) {
        const chunk = decoder.decode(value)
        setResponseData(prev => prev + chunk)
        ;({ value, done } = await reader.read())
      }
    } catch (error: unknown) {
      console.error("Error:", error)
    }
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const textareaValue = e.currentTarget.message.value
    setNewContent(textareaValue)
    postContent()
  }

  return (
    <>
      <SignedIn>
        <ResizablePanelGroup direction="horizontal" className=" rounded-lg ">
          <ResizablePanel defaultSize={15}>
            <div className=" w-full h-full items-start justify-start ">
              <span className="font-semibold ">
                <SideNavBar activeLink="/home" />
              </span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={85}>
            <div className="flex flex-col h-full mb-6">
              <Header />

              <main className=" px-60  w-full  ">
                <div className=" pt-4 flex  flex-col rounded-xl bg-muted/50 ">
                  <ScrollArea className="h-[730px] w-auto rounded-md  px-10">
                    <div id="output" className="">
                      {responseData}
                    </div>
                  </ScrollArea>
                  <div className="flex-1 " />

                  <form
                    onSubmit={handleSubmit}
                    className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
                  >
                    <Label htmlFor="message" className="sr-only">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={newContent}
                      onChange={e => setNewContent(e.target.value)}
                      placeholder="Type your message here..."
                      className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                    />
                    <div className="flex items-center p-3 pt-0">
                      <Button
                        type="submit"
                        size="sm"
                        className="ml-auto gap-1.5"
                      >
                        Send
                        <CornerDownLeft className="size-3.5" />
                      </Button>
                    </div>
                  </form>
                </div>
              </main>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

export default Home
