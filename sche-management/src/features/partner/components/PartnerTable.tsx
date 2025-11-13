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
import { Partner } from "../types/partner";
// @ts-ignore
import { toast, Toaster } from "sonner";

const CreatePartnerModal = lazy(() => import("./CreatePartnerModal"));
const TopUpPartnerModal = lazy(() => import("./TopUpPartnerModal"));
const PartnerWalletDetail = lazy(() => import("./PartnerWalletDetail"));

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
  const [topUp, setTopUp] = useState<Partner | null>(null);
  const [viewWallet, setViewWallet] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const filteredPartners: Partner[] = Array.isArray(list)
    ? list.filter((p: Partner) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const toggleStatus = async (
    id: string,
    currentStatus: "ACTIVE" | "INACTIVE"
  ) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const partnerName =
      filteredPartners.find((p) => String(p.id) === id)?.name || "Đối tác";

    const success = await changePartnerStatus(id, newStatus);
    if (success) {
      loadAll();
      toast.success(
        `${partnerName} ${
          newStatus === "ACTIVE" ? "Đã kích hoạt" : "Đã tạm dừng"
        }`
      );
    } else {
      toast.error(`Cập nhật trạng thái thất bại`, {
        description: `Không thể thay đổi trạng thái của đối tác ${partnerName}.`,
      });
    }
  };

  const handleTopUpSuccess = (partnerName: string, amount: number) => {
    setTopUp(null);
    loadAll();
    const formattedAmount = new Intl.NumberFormat("vi-VN").format(amount);
    toast.success(`Nạp tiền thành công cho ${partnerName}`, {
      description: `Đã nạp ${formattedAmount} Coin.`,
      duration: 5000,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <section className="bg-white rounded-2xl shadow p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Quản lý đối tác
            </h1>
            <p className="text-gray-500 mt-1">
              Danh sách và trạng thái các đối tác
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Input
              placeholder="Tìm kiếm đối tác..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64"
            />
            <Button
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setCreating(true)}
            >
              <Plus className="h-4 w-4" /> Tạo mới
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                {[
                  "STT",
                  "Tên đối tác",
                  "Loại tổ chức",
                  "Email",
                  "Số điện thoại",
                  "Ngày tạo",
                  "Trạng thái",
                  "Hành động",
                ].map((title) => (
                  <TableHead
                    key={title}
                    className="px-4 py-3 text-left text-gray-700"
                  >
                    {title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loadingList ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-gray-500"
                  >
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : filteredPartners.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-gray-500"
                  >
                    Không có đối tác nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredPartners.map((partner, index) => (
                  <TableRow
                    key={partner.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-4 py-3">{index + 1}</TableCell>
                    <TableCell className="px-4 py-3 font-medium">
                      {partner.name}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {partner.organizationType}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {partner.contactEmail}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {partner.contactPhone}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {new Date(partner.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3">
                      <Button
                        size="sm"
                        className={`w-28 flex items-center justify-center gap-1 ${
                          partner.status === "ACTIVE"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "border border-red-500 text-red-600 hover:bg-red-50"
                        }`}
                        onClick={() => toggleStatus(partner.id, partner.status)}
                      >
                        {partner.status === "ACTIVE" ? (
                          <>
                            <CheckCircle className="h-4 w-4" /> Hoạt động
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" /> Tạm dừng
                          </>
                        )}
                      </Button>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3 flex flex-col md:flex-row gap-2 justify-center">
                      <Button
                        size="sm"
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => setTopUp(partner)}
                      >
                        <DollarSign className="h-4 w-4" /> Nạp Coin
                      </Button>

                      <Button
                        size="sm"
                        className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white"
                        onClick={() =>
                          setViewWallet({
                            id: partner.walletId || "",
                            name: partner.name,
                          })
                        }
                      >
                        Xem Số Dư
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Modals */}
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
                  description: "Lỗi khi tạo đối tác, thử lại.",
                });
              }
            }}
          />
        </Suspense>
      )}

      {topUp && (
        <Suspense fallback={<p>Đang tải...</p>}>
          <TopUpPartnerModal
            open={!!topUp}
            onClose={() => setTopUp(null)}
            onTopUpSuccess={handleTopUpSuccess}
            partnerId={topUp.id.toString()}
            partnerName={topUp.name}
          />
        </Suspense>
      )}

      {viewWallet && (
        <Suspense fallback={<p>Đang tải...</p>}>
          <PartnerWalletDetail
            open={!!viewWallet}
            onClose={() => setViewWallet(null)}
            walletId={viewWallet.id}
            partnerName={viewWallet.name}
          />
        </Suspense>
      )}

      <Toaster position="top-right" richColors />
    </main>
  );
}
