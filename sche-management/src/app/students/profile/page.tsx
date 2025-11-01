"use client";

import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { toast, Toaster } from "sonner";
import { studentService } from "@/features/students/services/studentService";
import type { StudentProfile } from "@/features/students/types/student";
import ProfileCard from "./components/ProfileCard";
import ProfileLoading from "./components/ProfileLoading";
import EditProfileDialog from "./components/EditProfileDialog";

export default function StudentProfilePage() {
  const auth = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state for complete profile
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  
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
        // If any error getting profile, show complete profile dialog
        setShowCompleteDialog(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim() || !avatarUrl.trim()) {
      setFormError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      
      // Complete profile
      const completedProfile = await studentService.completeProfile({
        phoneNumber: phoneNumber.trim(),
        avatarUrl: avatarUrl.trim(),
      });
      
      setProfile(completedProfile);
      setShowCompleteDialog(false);
      setPhoneNumber("");
      setAvatarUrl("");
      toast.success("Hoàn thiện hồ sơ thành công!", {
        description: "Chào mừng bạn đến với hệ thống.",
      });
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Không thể hoàn thiện profile");
      console.error(err);
      toast.error("Hoàn thiện hồ sơ thất bại", {
        description: err?.response?.data?.message || "Vui lòng thử lại.",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
