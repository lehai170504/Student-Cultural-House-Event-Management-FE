"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Mail, User2, Shield, CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ViewUserDetailProps {
  open: boolean;
  onClose: () => void;
  onEdit?: (user: User) => void;
  user?: {
    id?: number;
    name: string;
    email: string;
    role: "student" | "org" | "booth";
    status: "active" | "inactive";
  };
}

const roleLabels: Record<
  "student" | "org" | "booth",
  { label: string; color: string }
> = {
  student: { label: "Sinh viên", color: "bg-blue-100 text-blue-700" },
  org: { label: "Ban tổ chức", color: "bg-purple-100 text-purple-700" },
  booth: { label: "Gian hàng", color: "bg-pink-100 text-pink-700" },
};

const statusLabels = {
  active: { label: "Hoạt động", color: "bg-green-100 text-green-700" },
  inactive: { label: "Khóa", color: "bg-red-100 text-red-700" },
};

export default function ViewUserDetail({
  open,
  onClose,
  user,
}: ViewUserDetailProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Chi tiết tài khoản
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Họ tên */}
          <div className="flex items-center gap-3">
            <User2 className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-gray-500">Họ tên</Label>
              <p className="font-semibold text-gray-800">{user.name}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-gray-500">Email</Label>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
          </div>

          {/* Vai trò */}
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-gray-500">Vai trò</Label>
              <Badge
                className={`${
                  roleLabels[user.role].color
                } px-3 py-1 rounded-full`}
              >
                {roleLabels[user.role].label}
              </Badge>
            </div>
          </div>

          {/* Trạng thái */}
          <div className="flex items-center gap-3">
            <CircleDot
              className={`h-5 w-5 ${
                user.status === "active" ? "text-green-500" : "text-red-500"
              }`}
            />
            <div>
              <Label className="text-gray-500">Trạng thái</Label>
              <Badge
                className={`${
                  statusLabels[user.status].color
                } px-3 py-1 rounded-full`}
              >
                {statusLabels[user.status].label}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
