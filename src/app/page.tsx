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
import { ChartBar } from "lucide-react";

// Define document type for better TypeScript support
interface Document {
  id: string;
  page_content: string;
  [key: string]: any; // For additional fields
}

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function
  const fetchDocumentsPage = useCallback(async (page = 0, pageSize = 10) => {
    setIsLoading(true);
    setError(null);
    const skip = page * pageSize;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/get-documents/?skip=${skip}&limit=${pageSize}`
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
console.log(documents);
  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && <p>Loading documents...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {documents.length === 0 && !isLoading && !error && (
          <p>No documents found.</p>
        )}
        {documents.map((document) => (
          <div
            key={document.id}
            className="p-4 border rounded-md shadow-sm"
          >
            <h3 className="text-lg font-medium">{document.page_content}</h3>
            <p className="text-gray-500">{document?.name}</p>
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <ChartBar className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" >
            <DropdownMenuItem asChild>
              <ChatInterface />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </main>
  );
}