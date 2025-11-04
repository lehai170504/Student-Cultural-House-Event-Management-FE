"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Mail, User2, CircleDot } from "lucide-react";
import type { AuthResponse } from "@/features/auth/types/auth";

interface ViewUserDetailProps {
  open: boolean;
  onClose: () => void;
  onEdit?: (user: AuthResponse) => void;
  user?: AuthResponse;
}

export default function ViewUserDetail({
  open,
  onClose,
  onEdit,
  user,
}: ViewUserDetailProps) {
  if (!user) return null;

  const data = user.data;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Chi tiết tài khoản
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-3">
          {/* Full Name */}
          <div className="flex items-center gap-3">
            <User2 className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-gray-500">Họ tên</Label>
              <p className="font-semibold text-gray-800">
                {data.fullName || "—"}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-gray-500">Email</Label>
              <p className="font-medium text-gray-800">{data.email || "—"}</p>
            </div>
          </div>

          {/* ID */}
          <div className="flex items-center gap-3">
            <CircleDot className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-gray-500">ID</Label>
              <p className="font-medium text-gray-800">{data.id}</p>
            </div>
          </div>

          {/* Cognito Sub */}
          <div className="flex items-center gap-3">
            <CircleDot className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-gray-500">Cognito Sub</Label>
              <p className="font-medium text-gray-800">{data.cognitoSub}</p>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-center gap-3">
            <CircleDot className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-gray-500">Ngày tạo</Label>
              <p className="font-medium text-gray-800">
                {new Date(data.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {onEdit && (
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600"
              onClick={() => onEdit(user)}
            >
              Chỉnh sửa
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
