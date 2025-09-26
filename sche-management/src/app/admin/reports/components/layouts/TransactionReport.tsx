"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TransactionReport() {
  const transactions = [
    { id: "TXN001", user: "Nguyen Van A", amount: 500000, status: "Completed" },
    { id: "TXN002", user: "Tran Thi B", amount: 200000, status: "Pending" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            Thành công
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
            Đang xử lí
          </Badge>
        );
      case "Failed":
        return (
          <Badge className="bg-red-500 text-white hover:bg-red-600">
            Thất bại
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="shadow-md border rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-orange-600">
          Thống kê giao dịch
        </CardTitle>
        <p className="text-sm text-gray-500">
          Lịch sử giao dịch gần đây của người dùng
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Người dùng</TableHead>
              <TableHead className="font-semibold">Thành tiền</TableHead>
              <TableHead className="font-semibold">Tình trạng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow
                key={txn.id}
                className="hover:bg-orange-50 transition-colors"
              >
                <TableCell className="font-mono">{txn.id}</TableCell>
                <TableCell>{txn.user}</TableCell>
                <TableCell className="font-semibold text-gray-700">
                  {txn.amount.toLocaleString()} VND
                </TableCell>
                <TableCell>{getStatusBadge(txn.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
