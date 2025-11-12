"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquare } from "lucide-react";

interface ContactFormProps {
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ContactForm({
  formData,
  onInputChange,
  onSubmit,
}: ContactFormProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <MessageSquare className="h-6 w-6 text-orange-500" />
          Gửi tin nhắn
        </CardTitle>
        <p className="text-gray-600">
          Điền thông tin bên dưới và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Họ và tên *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="Nhập họ và tên"
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="Nhập email"
                className="mt-2"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Chủ đề</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={onInputChange}
              placeholder="Nhập chủ đề"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="message">Nội dung tin nhắn *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={onInputChange}
              placeholder="Nhập nội dung tin nhắn..."
              className="mt-2 min-h-[120px]"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            <Send className="h-4 w-4 mr-2" />
            Gửi tin nhắn
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

