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
  avatarFile: File | null;
  avatarPreview: string | null;
  formError: string | null;
  submitting: boolean;
  onFullNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onAvatarFileChange: (file: File | null, preview: string | null) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditProfileDialog({
  open,
  fullName,
  phoneNumber,
  avatarFile,
  avatarPreview,
  formError,
  submitting,
  onFullNameChange,
  onPhoneNumberChange,
  onAvatarFileChange,
  onClose,
  onSubmit,
}: EditProfileDialogProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarFileChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onAvatarFileChange(null, null);
    }
  };
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

            {/* Avatar File Upload */}
            <div className="space-y-2">
              <Label htmlFor="editAvatarFile">Ảnh đại diện</Label>
              <div className="space-y-2">
                {avatarPreview && (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  id="editAvatarFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500">
                  Chọn file ảnh (JPG, PNG, GIF) - Tối đa 5MB
                </p>
              </div>
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

