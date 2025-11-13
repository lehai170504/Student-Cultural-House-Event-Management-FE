import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactMap() {
  return (
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
  );
}

