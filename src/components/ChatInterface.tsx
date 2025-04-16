"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    console.log(userMessage);
    try {
      console.log(
        `Sending request to: ${
          process.env.NEXT_PUBLIC_ANALYTICS_ID
        }/chat/?msg=${encodeURIComponent(userMessage)}`
      );
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ANALYTICS_ID}/chat/?msg=${encodeURIComponent(
          userMessage
        )}`,
        {
          method: "POST",
        }
      );

      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.text();
      console.log("Response data:", data);
      setMessages((prev) => [...prev, { role: "assistant", content: data }]);
    } catch (error) {
      console.error("Error details:", error);
      // ...
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-[400px] h-[60vh] mx-auto p-2 mr-2 ">
      <h2 className="text-center border-b">Chat with your documents</h2>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="whitespace-pre-wrap">
                {message.role === "user"
                  ? message.content
                  : message.content
                      .split("\n")
                      .filter(
                        (line) =>
                          !line.includes("Pages vs components") &&
                          !line.trim().startsWith("my-next-app/") &&
                          !line.includes("Step 1 Create") &&
                          !line.includes("Step 2 Create")
                      )
                      .join("\n")}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="p-4 rounded-lg text-black bg-gray-100 animate-pulse">
            <p>Loading...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center justify-center mt-3 w-[90%] mx-auto">
        <form onSubmit={handleSubmit} className="flex-1 flex gap-4 ">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask question about the document"
            className="flex-1 p-2 border rounded "
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
