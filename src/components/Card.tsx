import Image from "next/image";
import React from "react";

interface Document {
  id: string;
  page_content: string;
  metadata?: {
    description?: string;
    digest?: string;
    image_url?: string;
    is_booked?: boolean;
    room_number?: string;
    room_size?: number;
  };
}

interface CardProps {
  document: Document;
}

const Card: React.FC<CardProps> = ({ document }) => {
  return (
    <div className="border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      {document?.metadata?.image_url && (
        <div className="relative w-full h-48">
          <Image
            src={document.metadata.image_url}
            alt="Room image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-2">{document.page_content}</h3>
            <p className="mb-1 text-sm">
              <span className="font-medium">Description:</span>{" "}
              {document.metadata?.description}
            </p>
            <p className="mb-1 text-sm">
              <span className="font-medium">Room:</span>{" "}
              {document.metadata?.room_number}
            </p>
            <p className="mb-1 text-sm">
              <span className="font-medium">Room Size:</span>{" "}
              {document.metadata?.room_size}㎡
            </p>
          </div>
          <div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                document.metadata?.is_booked
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {document.metadata?.is_booked ? "Booked" : "Available"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
