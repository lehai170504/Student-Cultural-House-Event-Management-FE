"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Calendar,
  Award,
  History,
  Settings,
  Loader2,
} from "lucide-react";
import ProfileDetails from "./components/ProfileDetails";
import PointBalanceCard from "./components/PointBalanceCard";
import EditProfile from "./components/EditProfile";
import ActivityHistory from "./components/ActivityHistory";
import ProfileSettings from "./components/ProfileSettings";
import VoucherManagement from "./components/VoucherManagement";
import QRCodeCard from "./components/QRCodeCard";
import {
  fetchUserProfile,
  updateUserProfile,
  clearError,
} from "../../../features/users/slices/userSlice";

// Mock data - thay thế bằng dữ liệu thực từ Redux store
const mockUser = {
  userName: "john_doe",
  fullName: "Nguyễn Văn A",
  email: "john.doe@example.com",
  phoneNumber: "0123456789",
  avatarUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  faculty: "Công nghệ thông tin",
  interests: ["Lập trình", "Thiết kế", "Sự kiện", "Thể thao"],
  qrCodeIdentifier: "STU2024001",
  pointBalance: 1250,
  joinDate: "2024-01-15",
  totalPoints: 1250,
  level: "Gold",
  eventsAttended: 15,
  eventsOrganized: 3,
};

const mockRecentActivities = [
  {
    id: 1,
    type: "event_attended",
    title: 'Tham gia sự kiện "Workshop React"',
    date: "2024-01-20",
    points: 50,
  },
  {
    id: 2,
    type: "event_organized",
    title: 'Tổ chức sự kiện "Tech Talk"',
    date: "2024-01-18",
    points: 100,
  },
  {
    id: 3,
    type: "points_earned",
    title: "Hoàn thành feedback sự kiện",
    date: "2024-01-15",
    points: 25,
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useAppDispatch();
  const { currentUser, loading, error, isUpdating } = useAppSelector(
    (state: any) => state.user
  );

  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, currentUser]);

  const handleUpdateUser = (updatedUser: any) => {
    dispatch(updateUserProfile(updatedUser));
    setIsEditing(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setActiveTab("details");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    dispatch(clearError());
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "event_attended":
        return <Calendar className="h-4 w-4 text-green-500" />;
      case "event_organized":
        return <Award className="h-4 w-4 text-blue-500" />;
      case "points_earned":
        return <Award className="h-4 w-4 text-yellow-500" />;
      default:
        return <History className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => dispatch(fetchUserProfile())}>
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  // Use currentUser data with fallback to mock data for additional fields
  const userData = {
    ...currentUser,
    joinDate: "2024-01-15",
    totalPoints: 1250,
    level: "Gold",
    eventsAttended: 15,
    eventsOrganized: 3,
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.avatarUrl} alt={userData.fullName} />
                <AvatarFallback className="text-lg">
                  {userData.fullName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userData.fullName}
                  </h1>
                  <Badge variant="secondary" className="w-fit">
                    {userData.level}
                  </Badge>
                </div>

                <p className="text-gray-600">@{userData.userName}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {userData.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {userData.phoneNumber}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {userData.address}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleEditProfile}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                Chỉnh sửa
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-80">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {userData.totalPoints}
              </div>
              <div className="text-sm text-gray-500">Điểm tích lũy</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {userData.eventsAttended}
              </div>
              <div className="text-sm text-gray-500">Sự kiện tham gia</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {userData.eventsOrganized}
              </div>
              <div className="text-sm text-gray-500">Sự kiện tổ chức</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="details">Chi tiết</TabsTrigger>
          <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          <TabsTrigger value="activities">Hoạt động</TabsTrigger>
          <TabsTrigger value="vouchers">Voucher</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PointBalanceCard
              points={userData.totalPoints}
              level={userData.level}
            />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Hoạt động gần đây
                </CardTitle>
                <CardDescription>
                  Lịch sử hoạt động của bạn trong 30 ngày qua
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRecentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      +{activity.points} điểm
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          {isEditing ? (
            <EditProfile
              user={userData}
              onSave={handleUpdateUser}
              onCancel={handleCancelEdit}
            />
          ) : (
            <ProfileDetails user={userData} onUpdate={handleUpdateUser} />
          )}
        </TabsContent>

        <TabsContent value="qrcode">
          <div className="max-w-md mx-auto">
            <QRCodeCard
              qrCodeIdentifier={userData.qrCodeIdentifier}
              studentName={userData.fullName}
              studentId={userData.userName}
            />
          </div>
        </TabsContent>

        <TabsContent value="activities">
          <ActivityHistory />
        </TabsContent>

        <TabsContent value="vouchers">
          <VoucherManagement />
        </TabsContent>

        <TabsContent value="settings">
          <ProfileSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
