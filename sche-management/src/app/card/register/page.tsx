"use client";

import Link from "next/link";
import { useState } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// Replace missing shadcn checkbox with native input for now
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function RegisterCardPage() {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<string>("");
  const [faculty, setFaculty] = useState("");
  const [university, setUniversity] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockCardNumber, setMockCardNumber] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!fullName || !studentId || !email || !phone || !dob || !gender || !university || !agree) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    setSubmitting(true);
    try {
      // Mock API delay and response
      await new Promise((r) => setTimeout(r, 700));
      const generated = `SCH-${(studentId || "000000").slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
      setMockCardNumber(generated);
      setSuccessOpen(true);
    } catch (err) {
      setError("Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <section className="container mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Đăng ký thẻ thành viên</CardTitle>
              <CardDescription>
                Tạo thẻ ảo để tích điểm thưởng khi tham gia sự kiện.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" placeholder="Nguyễn Văn A" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Mã sinh viên</Label>
                    <Input id="studentId" placeholder="SV123456" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" placeholder="09xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Ngày sinh</Label>
                    <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Giới tính</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty">Khoa/Ngành</Label>
                    <Input id="faculty" placeholder="Công nghệ thông tin" value={faculty} onChange={(e) => setFaculty(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">Trường đại học</Label>
                    <Input
                      id="university"
                      placeholder="Đại học Khoa học Tự nhiên"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input id="agree" type="checkbox" className="mt-1 h-4 w-4 border rounded" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <div className="space-y-1">
                    <Label htmlFor="agree">Tôi đồng ý với điều khoản và chính sách</Label>
                    <p className="text-sm text-muted-foreground">
                      Bằng việc đăng ký, bạn đồng ý cho phép sử dụng dữ liệu để quản lý tích điểm.
                    </p>
                  </div>
                </div>

                {error ? (
                  <p className="text-sm text-red-600">{error}</p>
                ) : null}

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={submitting} className="bg-orange-500 hover:bg-orange-600">
                    {submitting ? "Đang xử lý..." : "Đăng ký thẻ"}
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/">Quay lại trang chủ</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng ký thành công</DialogTitle>
            <DialogDescription>
              Thẻ ảo của bạn đã được tạo. Bạn có thể dùng để tích điểm khi tham gia sự kiện.
              {mockCardNumber ? (
                <span className="mt-2 block text-sm">Mã thẻ: <strong>{mockCardNumber}</strong></span>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/">Về trang chủ</Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/card/virtual">Xem thẻ ảo</Link>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}


