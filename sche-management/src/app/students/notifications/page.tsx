"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2, CheckCircle2, Circle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import type { NotificationStatus } from "@/features/notifications/types/notification";

export default function StudentNotificationsPage() {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    loadNotifications,
    setNotificationsRead,
  } = useNotifications();

  const [filterStatus, setFilterStatus] = useState<NotificationStatus | "ALL">("ALL");
  const [filteredNotifications, setFilteredNotifications] = useState(notifications);

  // Load notifications khi component mount - lấy tất cả thông báo (size lớn)
  // Và tự động reload mỗi 3 giây để lấy thông báo mới nhất
  useEffect(() => {
    // Load ngay lập tức
    loadNotifications({ size: 1000 }); // Lấy tối đa 1000 thông báo

    // Setup interval để reload mỗi 3 giây
    const interval = setInterval(() => {
      loadNotifications({ size: 1000 });
    }, 3000); // 3 giây = 3000ms

    // Cleanup interval khi component unmount
    return () => {
      clearInterval(interval);
    };
  }, [loadNotifications]);

  // Filter notifications khi filterStatus hoặc notifications thay đổi
  useEffect(() => {
    if (filterStatus === "ALL") {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(
        notifications.filter(
          (item) => (item.status || "").toUpperCase() === filterStatus.toUpperCase()
        )
      );
    }
  }, [filterStatus, notifications]);

  const handleMarkAsRead = async (deliveryId: string) => {
    await setNotificationsRead([deliveryId]);
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = filteredNotifications
      .filter((item) => (item.status || "").toUpperCase() === "UNREAD")
      .map((item) => item.deliveryId);
    if (unreadIds.length > 0) {
      await setNotificationsRead(unreadIds);
    }
  };

  const formatTime = (value: string) => {
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return value;
      }
      return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return value;
    }
  };

  const readCount = notifications.filter(
    (item) => (item.status || "").toUpperCase() === "READ"
  ).length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex mt-20 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-8 w-8 text-orange-500" />
            Thông báo của tôi
          </h1>
          <p className="text-gray-600 mt-1">
            Tổng: {notifications.length} thông báo | Đã đọc: {readCount} | Chưa đọc: {unreadCount}
          </p>
        </div>
      </div>

      {/* Filter và Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Lọc thông báo
            </CardTitle>
            {filteredNotifications.some(
              (item) => (item.status || "").toUpperCase() === "UNREAD"
            ) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value as NotificationStatus | "ALL")}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả ({notifications.length})</SelectItem>
                <SelectItem value="UNREAD">Chưa đọc ({unreadCount})</SelectItem>
                <SelectItem value="READ">Đã đọc ({readCount})</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadNotifications({ size: 1000 })}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                "Làm mới"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách thông báo ({filteredNotifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-2" />
                <p className="text-gray-600">Đang tải thông báo...</p>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {filterStatus === "ALL"
                  ? "Chưa có thông báo nào"
                  : `Không có thông báo ${filterStatus === "READ" ? "đã đọc" : "chưa đọc"}`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((item) => {
                const isUnread = (item.status || "").toUpperCase() === "UNREAD";
                return (
                  <div
                    key={item.deliveryId}
                    className={`border rounded-lg p-4 transition-colors ${
                      isUnread
                        ? "bg-orange-50 border-orange-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {isUnread ? (
                            <Circle className="h-4 w-4 text-orange-500 fill-orange-500" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-gray-400" />
                          )}
                          <h3
                            className={`font-semibold ${
                              isUnread ? "text-orange-600" : "text-gray-800"
                            }`}
                          >
                            {item.eventTitle || "Thông báo"}
                          </h3>
                          <Badge
                            variant={isUnread ? "default" : "secondary"}
                            className={
                              isUnread
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            }
                          >
                            {isUnread ? "Chưa đọc" : "Đã đọc"}
                          </Badge>
                        </div>
                        {item.messageContent && (
                          <p className="text-sm text-gray-700 whitespace-pre-line mb-2">
                            {item.messageContent}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatTime(item.sentAt)}
                        </p>
                        {item.eventId && (
                          <p className="text-xs text-gray-400 mt-1">
                            Event ID: {item.eventId}
                          </p>
                        )}
                      </div>
                      {isUnread && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(item.deliveryId)}
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                        >
                          Đánh dấu đã đọc
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

