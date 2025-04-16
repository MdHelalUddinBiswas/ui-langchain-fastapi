"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FormData {
  room_number: string;
  description: string;
  room_size: number;
  image_url?: string;
  is_booked: boolean;
  page_content: string;
  metadata: {
    description: string;
    room_number: string;
    room_size: number;
    image_url?: string;
    is_booked: boolean;
  };
}

const AddData = () => {
  const [formData, setFormData] = useState<FormData>({
    room_number: "",
    description: "",
    room_size: 0,
    image_url: "",
    is_booked: false,
    page_content: "",
    metadata: {
      description: "",
      room_number: "",
      room_size: 0,
      image_url: "",
      is_booked: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Structure the data to match FastAPI model
    const requestData = [{
      room_number: formData.room_number,
      description: formData.description,
      room_size: parseFloat(formData.room_size.toString()), // Ensure it's a float
      image_url: formData.image_url || null, // Make it null if empty
      is_booked: formData.is_booked,
      page_content: formData.page_content,
      metadata: {}
    }];

    console.log('Sending data:', requestData);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ANALYTICS_ID}/add-documents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.detail || 'Failed to add document');
      }

      // Reset form after successful submission
      setFormData({
        room_number: "",
        description: "",
        room_size: 0,
        image_url: "",
        is_booked: false,
        page_content: "",
        metadata: {
          description: "",
          room_number: "",
          room_size: 0,
          image_url: "",
          is_booked: false,
        },
      });

      alert("Document added successfully!");
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Failed to add document. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      metadata: {
        ...prev.metadata,
        [name]: newValue,
      },
    }));
  };

  return (
    <div className="w-[400px] p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Room</CardTitle>
          <CardDescription>
            Enter the details for a new room listing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room_number">Room Number</Label>
              <Input
                id="room_number"
                name="room_number"
                value={formData.room_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page_content">Title</Label>
              <Input
                id="page_content"
                name="page_content"
                value={formData.page_content}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room_size">Room Size (㎡)</Label>
              <Input
                type="number"
                id="room_size"
                name="room_size"
                value={formData.room_size}
                onChange={handleChange}
                required
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required
                type="url"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_booked"
                name="is_booked"
                checked={formData.is_booked}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_booked: checked,
                    metadata: {
                      ...prev.metadata,
                      is_booked: checked,
                    },
                  }))
                }
              />
              <Label htmlFor="is_booked">Room is booked</Label>
            </div>

            <Button type="submit" className="w-full">
              Add Room
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddData;
