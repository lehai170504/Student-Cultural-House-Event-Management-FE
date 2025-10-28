"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />
      
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-white border-b">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
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
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Họ và tên *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
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
                          onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
            </div>

            {/* Contact Information & Map */}
            <div className="space-y-8">
              {/* Contact Info */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Địa chỉ</h3>
                      <p className="text-gray-600">
                        Nhà Văn Hóa Sinh Viên<br />
                        Đại học FPT<br />
                        Số 1 Lưu Hữu Phước, Đông Hoà, Dĩ An, Hồ Chí Minh
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Phone className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Điện thoại</h3>
                      <p className="text-gray-600">
                        <a href="tel:+84123456789" className="hover:text-orange-600 transition">
                          (028) 1234 5678
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Mail className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                      <p className="text-gray-600">
                        <a href="mailto:info@nvh.uit.edu.vn" className="hover:text-orange-600 transition">
                          info@nvh.uit.edu.vn
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Giờ làm việc</h3>
                      <p className="text-gray-600">
                        Thứ 2 - Thứ 6: 8:00 - 17:00<br />
                        Thứ 7: 8:00 - 12:00<br />
                        Chủ nhật: Nghỉ
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Google Maps */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Vị trí</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative w-full h-80 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15672.655835220361!2d106.78321383955081!3d10.875131200000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2sVNUHCM%20Student%20Cultural%20House!5e0!3m2!1sen!2s!4v1759644731955!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Vị trí Nhà Văn Hóa Sinh Viên"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Tại sao chọn chúng tôi?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Phản hồi nhanh</h3>
                <p className="text-gray-600">
                  Chúng tôi cam kết phản hồi mọi thắc mắc trong vòng 24 giờ.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Hỗ trợ 24/7</h3>
                <p className="text-gray-600">
                  Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Vị trí thuận tiện</h3>
                <p className="text-gray-600">
                  Tọa lạc tại trung tâm thành phố, dễ dàng di chuyển.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
