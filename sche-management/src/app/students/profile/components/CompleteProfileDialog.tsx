"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CompleteProfileDialogProps {
  open: boolean;
  phoneNumber: string;
  avatarUrl: string;
  formError: string | null;
  submitting: boolean;
  onPhoneNumberChange: (value: string) => void;
  onAvatarUrlChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CompleteProfileDialog({
  open,
  phoneNumber,
  avatarUrl,
  formError,
  submitting,
  onPhoneNumberChange,
  onAvatarUrlChange,
  onSubmit,
}: CompleteProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" showCloseButton={false}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Hoàn thiện hồ sơ</DialogTitle>
            <DialogDescription>
              Bạn cần cung cấp thêm thông tin để hoàn thiện hồ sơ của mình.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phoneNumber}
                onChange={(e) => onPhoneNumberChange(e.target.value)}
                required
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">URL Ảnh đại diện *</Label>
              <Input
                id="avatarUrl"
                type="url"
                placeholder="Nhập URL ảnh đại diện"
                value={avatarUrl}
                onChange={(e) => onAvatarUrlChange(e.target.value)}
                required
              />
            </div>

            {formError && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                {formError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Hoàn thành"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

