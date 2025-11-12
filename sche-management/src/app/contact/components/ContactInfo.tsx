import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactInfo() {
  const contactItems = [
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: (
        <>
          Nhà Văn Hóa Sinh Viên<br />
          Đại học FPT<br />
          Số 1 Lưu Hữu Phước, Đông Hoà, Dĩ An, Hồ Chí Minh
        </>
      ),
    },
    {
      icon: Phone,
      title: "Điện thoại",
      content: (
        <a href="tel:+84123456789" className="hover:text-orange-600 transition">
          (028) 1234 5678
        </a>
      ),
    },
    {
      icon: Mail,
      title: "Email",
      content: (
        <a href="mailto:info@nvh.uit.edu.vn" className="hover:text-orange-600 transition">
          info@nvh.uit.edu.vn
        </a>
      ),
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: (
        <>
          Thứ 2 - Thứ 6: 8:00 - 17:00<br />
          Thứ 7: 8:00 - 12:00<br />
          Chủ nhật: Nghỉ
        </>
      ),
    },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Thông tin liên hệ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {contactItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Icon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

