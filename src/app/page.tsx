"use client";
import { useState, useEffect, useCallback } from "react";
import ChatInterface from "@/components/ChatInterface";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Card from "@/components/Card";
import { FaRobot } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import AddData from "@/components/AddData";

// Define document type for better TypeScript support
interface Document {
  id: string;
  page_content: string;
  [key: string]: any; // For additional fields
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState(1);
  // Memoized fetch function
  const fetchDocumentsPage = useCallback(async (page = 0, pageSize = 10) => {
    setIsLoading(true);
    setError(null);
    const skip = page * pageSize;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ANALYTICS_ID}/get-documents/?skip=${skip}&limit=${pageSize}`
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data: Document[] = await response.json();
      setDocuments(data);
      return data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to load documents. Please try again.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch documents on mount
  useEffect(() => {
    fetchDocumentsPage();
  }, [fetchDocumentsPage]);

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && <p>Loading documents...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {documents.length === 0 && !isLoading && !error && (
          <p>No documents found.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((document, index) => (
            <Card key={index} document={document} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 right-5">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 mr-2">
              <FaRobot className="text-2xl" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount>
            <DropdownMenuItem asChild>
              <ChatInterface
                messages={chatMessages}
                setMessages={setChatMessages}
                setSessionId={setSessionId}
                sessionId={sessionId}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <FaPlus className="text-xl" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <AddData />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </main>
  );
}
