"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useUniversities } from "../hooks/useUniversities";
import type { CreateUniversity, UpdateUniversity } from "../types/universities";

interface UniversityFormModalProps {
  open: boolean;
  onClose: () => void;
  university?: { id: string; name: string; code: string; domain: string };
}

function UniversityFormModal({
  open,
  onClose,
  university,
}: UniversityFormModalProps) {
  const { create, update, loadAll, saving } = useUniversities();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [domain, setDomain] = useState("");

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
          <Button variant="secondary" onClick={onClose}>
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

export default function UniversityTable() {
  const { list = [], loadingList, remove, loadAll } = useUniversities();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUniversity, setEditUniversity] = useState<any>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const filteredUniversities = Array.isArray(list)
    ? list.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  const openModal = (university?: any) => {
    setEditUniversity(university ?? null);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleDelete = (id: string) => {
    setConfirmingId(id);
  };

  const cancelDelete = () => {
    toast("Hủy xóa trường!");
    setConfirmingId(null);
  };

  const confirmDelete = async () => {
    if (confirmingId === null) return;
    try {
      await remove(confirmingId);
      await loadAll();
      toast.success("Xóa trường thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Xóa trường thất bại!");
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div>
      {/* Toaster */}
      <Toaster position="top-right" richColors />

      {/* Search + Add */}
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
          onClick={() => openModal()}
        >
          <Plus className="w-4 h-4" />
          Thêm trường
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Mã</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingList ? (
            <TableRow>
              <TableCell colSpan={5}>Đang tải...</TableCell>
            </TableRow>
          ) : filteredUniversities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>Không có trường nào</TableCell>
            </TableRow>
          ) : (
            filteredUniversities.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.code}</TableCell>
                <TableCell>{u.domain}</TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    className="flex items-center gap-1 px-2 py-1 rounded-md
                      border-2 border-orange-500 bg-white text-orange-500 font-medium
                      transition-all duration-200
                      hover:bg-orange-500 hover:text-white hover:scale-105
                      active:scale-95 shadow-sm"
                    size="sm"
                    onClick={() => openModal(u)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(u.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Modal Form */}
      <UniversityFormModal
        open={modalOpen}
        onClose={closeModal}
        university={editUniversity}
      />

      {/* Confirm Delete Modal */}
      {confirmingId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded shadow-md flex flex-col gap-4">
            <p>Bạn có chắc chắn muốn xóa trường này?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cancelDelete}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
