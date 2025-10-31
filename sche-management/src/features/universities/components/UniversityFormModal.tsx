"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUniversities } from "../hooks/useUniversities";
import type { CreateUniversity, UpdateUniversity } from "../types/universities";
import { toast } from "sonner"; // import toast

interface UniversityFormModalProps {
  open: boolean;
  onClose: () => void;
  university?: { id: number; name: string; code: string; domain: string };
}

export default function UniversityFormModal({
  open,
  onClose,
  university,
}: UniversityFormModalProps) {
  const { create, update, loadAll, saving } = useUniversities();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [domain, setDomain] = useState("");

  // Reset hoặc điền dữ liệu khi university thay đổi
  useEffect(() => {
    if (university) {
      setName(university.name);
      setCode(university.code);
      setDomain(university.domain);
    } else {
      setName("");
      setCode("");
      setDomain("");
    }
  }, [university]);

  const handleSave = async () => {
    if (!name.trim() || !code.trim() || !domain.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin trường!");
      return;
    }

    const data: CreateUniversity | UpdateUniversity = { name, code, domain };

    try {
      if (university?.id) {
        await update(university.id, data);
        toast.success("Cập nhật trường thành công!");
      } else {
        await create(data);
        toast.success("Thêm trường thành công!");
      }
      onClose();
      await loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Lưu trường thất bại!");
    }
  };

  // Reset form khi modal đóng
  const handleClose = () => {
    setName("");
    setCode("");
    setDomain("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>
            {university ? "Cập nhật trường" : "Thêm trường"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tên trường
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mã trường
            </label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Domain
            </label>
            <Input value={domain} onChange={(e) => setDomain(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            className="bg-orange-500"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
