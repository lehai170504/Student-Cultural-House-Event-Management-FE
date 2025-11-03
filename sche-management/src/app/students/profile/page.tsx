"use client";

import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { studentService } from "@/features/students/services/studentService";
import type { StudentProfile } from "@/features/students/types/student";
import ProfileCard from "./components/ProfileCard";
import ProfileLoading from "./components/ProfileLoading";
import EditProfileDialog from "./components/EditProfileDialog";

export default function StudentProfilePage() {
  const auth = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state for edit profile
  const [editFullName, setEditFullName] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  
  // Get email from auth profile
  const userEmail = auth.user?.profile?.email || "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await studentService.getProfile();
        setProfile(data);
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        console.error("Error status:", err?.response?.status);
        // If profile not found or error, redirect to onboarding
        if (err?.response?.status === 404 || err?.response?.status === 400) {
          // Profile chưa được tạo, redirect về onboarding
          router.push("/onboarding/profile-completion");
        } else {
          // Other errors - show error message
          toast.error("Không thể tải thông tin hồ sơ", {
            description: err?.response?.data?.message || "Vui lòng thử lại sau.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleOpenEditDialog = () => {
    if (profile) {
      setEditFullName(profile.fullName);
      setEditPhoneNumber(profile.phoneNumber);
      setEditAvatarUrl(profile.avatarUrl || "");
      setEditError(null);
      setShowEditDialog(true);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editFullName.trim() || !editPhoneNumber.trim()) {
      setEditError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setSubmitting(true);
      setEditError(null);
      
      // Update profile
      const updatedProfile = await studentService.updateProfile({
        fullName: editFullName.trim(),
        phoneNumber: editPhoneNumber.trim(),
        avatarUrl: editAvatarUrl.trim() || undefined,
      });
      
      setProfile(updatedProfile);
      setShowEditDialog(false);
      toast.success("Cập nhật hồ sơ thành công!", {
        description: "Thông tin của bạn đã được lưu.",
      });
    } catch (err: any) {
      setEditError(err?.response?.data?.message || "Không thể cập nhật profile");
      console.error(err);
      toast.error("Cập nhật hồ sơ thất bại", {
        description: err?.response?.data?.message || "Vui lòng thử lại.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <ProfileLoading />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  // Nếu không loading nhưng không có profile, hiển thị thông báo
  if (!loading && !profile) {
    return (
      <>
        <div className="w-full max-w-4xl mx-auto mt-20 p-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Chưa có hồ sơ
            </h2>
            <p className="text-yellow-700 mb-4">
              Bạn cần hoàn thiện hồ sơ trước khi sử dụng tính năng này.
            </p>
            <Button 
              onClick={() => router.push("/onboarding/profile-completion")}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Hoàn thiện hồ sơ ngay
            </Button>
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <>
      {profile && (
        <ProfileCard 
          profile={profile} 
          userEmail={userEmail}
          onEditClick={handleOpenEditDialog}
        />
      )}

      <EditProfileDialog
        open={showEditDialog}
        fullName={editFullName}
        phoneNumber={editPhoneNumber}
        avatarUrl={editAvatarUrl}
        formError={editError}
        submitting={submitting}
        onFullNameChange={setEditFullName}
        onPhoneNumberChange={setEditPhoneNumber}
        onAvatarUrlChange={setEditAvatarUrl}
        onClose={() => setShowEditDialog(false)}
        onSubmit={handleUpdateProfile}
      />

      <Toaster position="top-right" richColors />
    </>
  );
}
