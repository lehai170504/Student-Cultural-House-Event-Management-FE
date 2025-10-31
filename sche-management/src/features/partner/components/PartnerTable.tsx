"use client";

import { useState, Suspense, lazy } from "react";
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
import { Plus, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { usePartners } from "../hooks/usePartners";
// @ts-ignore
import { toast, Toaster } from "sonner";

const CreatePartnerModal = lazy(() => import("./CreatePartnerModal"));
const TopUpPartnerModal = lazy(() => import("./TopUpPartnerModal"));

interface Partner {
  id: number;
  name: string;
  organizationType: string;
  contactEmail: string;
  contactPhone: string;
  walletId: number;
  createdAt: string;
  status: "ACTIVE" | "INACTIVE";
}

export default function PartnerTable() {
  const {
    list = [],
    loadingList,
    createNewPartner,
    loadAll,
    changePartnerStatus,
  } = usePartners();

  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  // State lưu trữ partner đang được nạp tiền
  const [topUp, setTopUp] = useState<Partner | null>(null);

  const filteredPartners: Partner[] = Array.isArray(list)
    ? list.filter((p: Partner) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const toggleStatus = async (
    id: number,
    currentStatus: "ACTIVE" | "INACTIVE"
  ) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const partnerName =
      filteredPartners.find((p) => p.id === id)?.name || "Đối tác";

    const success = await changePartnerStatus(id, newStatus);

    if (success) {
      loadAll();
      const statusText =
        newStatus === "ACTIVE" ? "Đã kích hoạt" : "Đã tạm dừng";
      toast.success(`${partnerName} ${statusText}`, {
        description: `Trạng thái của đối tác đã được cập nhật thành ${newStatus}.`,
      });
    } else {
      toast.error(`Cập nhật trạng thái thất bại`, {
        description: `Không thể thay đổi trạng thái của đối tác ${partnerName}. Vui lòng thử lại.`,
      });
    }
  };

  const handleTopUpSuccess = (partnerName: string, amount: number) => {
    setTopUp(null);

    loadAll();

    const formattedAmount = new Intl.NumberFormat("vi-VN").format(amount);
    toast.success(`Nạp tiền thành công cho ${partnerName}`, {
      description: `Đã nạp thành công ${formattedAmount} Coin.`,
      duration: 5000,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý đối tác
              </h1>
              <p className="text-lg text-gray-600">Quản lý các đối tác</p>
            </div>

            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              <Input
                placeholder="Tìm kiếm đối tác..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[200px]"
              />
              <Button
                className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
                onClick={() => setCreating(true)}
              >
                <Plus className="h-4 w-4" />
                Tạo mới
              </Button>
            </div>
          </div>

          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="px-6 py-3">STT</TableHead>
                  <TableHead className="px-6 py-3">Tên đối tác</TableHead>
                  <TableHead className="px-6 py-3">Loại tổ chức</TableHead>
                  <TableHead className="px-6 py-3">Email</TableHead>
                  <TableHead className="px-6 py-3">Số điện thoại</TableHead>
                  <TableHead className="px-6 py-3">Wallet ID</TableHead>
                  <TableHead className="px-6 py-3">Ngày tạo</TableHead>
                  <TableHead className="px-6 py-3">Trạng thái</TableHead>
                  <TableHead className="px-6 py-3 text-center">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingList ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : filteredPartners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      Không có đối tác nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPartners.map((partner, index) => (
                    <TableRow key={partner.id}>
                      <TableCell className="px-6 py-4">{index + 1}</TableCell>
                      <TableCell className="px-6 py-4">
                        {partner.name}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {partner.organizationType}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {partner.contactEmail}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {partner.contactPhone}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {partner.walletId}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {new Date(partner.createdAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <Button
                          size="sm"
                          variant={
                            partner.status === "ACTIVE" ? "default" : "outline"
                          }
                          className={
                            partner.status === "ACTIVE"
                              ? "bg-green-600 hover:bg-green-700 text-white w-[120px]"
                              : "border-red-500 text-red-600 hover:bg-red-50 w-[120px]"
                          }
                          onClick={() =>
                            toggleStatus(partner.id, partner.status)
                          }
                        >
                          <span className="flex items-center justify-center gap-1">
                            {partner.status === "ACTIVE" ? (
                              <>
                                <CheckCircle className="h-4 w-4" /> Hoạt động
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4" /> Tạm dừng
                              </>
                            )}
                          </span>
                        </Button>
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
                          onClick={() => setTopUp(partner)}
                        >
                          <DollarSign className="h-4 w-4" />
                          Nạp Coin
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Modal tạo mới */}
      {creating && (
        <Suspense fallback={<p>Đang tải...</p>}>
          <CreatePartnerModal
            open={creating}
            onClose={() => setCreating(false)}
            onCreate={async (data) => {
              const success = await createNewPartner(data);
              setCreating(false);

              if (success) {
                loadAll();
                toast.success("Tạo đối tác thành công", {
                  description: `Đối tác ${data.name} đã được thêm vào hệ thống.`,
                });
              } else {
                toast.error("Tạo đối tác thất bại", {
                  description:
                    "Đã xảy ra lỗi trong quá trình tạo đối tác. Vui lòng thử lại.",
                });
              }
            }}
          />
        </Suspense>
      )}

      {/* Modal Nạp tiền */}
      {topUp && (
        <Suspense fallback={<p>Đang tải...</p>}>
          <TopUpPartnerModal
            open={!!topUp}
            onClose={() => {
              setTopUp(null);
            }}
            onTopUpSuccess={handleTopUpSuccess}
            partnerId={topUp.walletId.toString()}
            partnerName={topUp.name}
          />
        </Suspense>
      )}

      <Toaster position="top-right" richColors />
    </main>
  );
}
