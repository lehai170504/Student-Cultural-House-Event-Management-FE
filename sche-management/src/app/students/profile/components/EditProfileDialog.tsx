"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EditProfileDialogProps {
  open: boolean;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  formError: string | null;
  submitting: boolean;
  onFullNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onAvatarUrlChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditProfileDialog({
  open,
  fullName,
  phoneNumber,
  avatarUrl,
  formError,
  submitting,
  onFullNameChange,
  onPhoneNumberChange,
  onAvatarUrlChange,
  onClose,
  onSubmit,
}: EditProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
            <DialogDescription>Cập nhật thông tin hồ sơ của bạn.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="editFullName">Họ và tên *</Label>
              <Input
                id="editFullName"
                type="text"
                placeholder="Nhập họ và tên"
                value={fullName}
                onChange={(e) => onFullNameChange(e.target.value)}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="editPhoneNumber">Số điện thoại *</Label>
              <Input
                id="editPhoneNumber"
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phoneNumber}
                onChange={(e) => onPhoneNumberChange(e.target.value)}
                required
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="editAvatarUrl">URL Ảnh đại diện</Label>
              <Input
                id="editAvatarUrl"
                type="url"
                placeholder="Nhập URL ảnh đại diện"
                value={avatarUrl}
                onChange={(e) => onAvatarUrlChange(e.target.value)}
              />
            </div>

            {formError && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                {formError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

