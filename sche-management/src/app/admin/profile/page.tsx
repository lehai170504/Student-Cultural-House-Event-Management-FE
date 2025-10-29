"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Shield, User, TicketPercent } from "lucide-react";
import EditProfile from "@/components/admin/profile/EditProfile";

export default function Profile() {
  const [admin, setAdmin] = useState({
    name: "Nguyễn Văn Admin",
    email: "admin@example.com",
    role: "Administrator",
    avatar: "https://i.pravatar.cc/150?img=32",
    stats: {
      events: 24,
      users: 120,
      vouchers: 8,
    },
  });

  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarImage src={admin.avatar} />
            <AvatarFallback>
              {admin.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center sm:text-left space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {admin.name}
            </CardTitle>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Shield className="w-4 h-4 text-primary" />
              <Badge variant="secondary">{admin.role}</Badge>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{admin.email}</span>
            </div>
          </div>

          <div className="ml-auto">
            <Button onClick={() => setOpenEdit(true)}>
              Chỉnh sửa thông tin
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {/* Users */}
        <Card className="shadow">
          <CardContent className="p-6 text-center">
            <User className="w-6 h-6 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{admin.stats.users}</p>
            <p className="text-gray-600">Người dùng</p>
          </CardContent>
        </Card>

        {/* Events */}
        <Card className="shadow">
          <CardContent className="p-6 text-center">
            <Shield className="w-6 h-6 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">{admin.stats.events}</p>
            <p className="text-gray-600">Sự kiện</p>
          </CardContent>
        </Card>

        {/* Vouchers */}
        <Card className="shadow">
          <CardContent className="p-6 text-center">
            <TicketPercent className="w-6 h-6 mx-auto text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{admin.stats.vouchers}</p>
            <p className="text-gray-600">Voucher</p>
          </CardContent>
        </Card>
      </div>

      {/* Modal Edit Profile */}
      <EditProfile
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        admin={admin}
        onSave={(data) => setAdmin((prev) => ({ ...prev, ...data }))}
      />
    </div>
  );
}
