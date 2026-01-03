import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Key } from "lucide-react";
import { toast } from "sonner";

const BASE_URL = "https://glacier-backend-4r0g.onrender.com";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!", {
        description: "Please make sure your new passwords match.",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password too short!", {
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/admin/updatepassword`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: formData.oldPassword,
          new_password: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Password update failed");
        return;
      }

      toast.success("Password updated successfully!", {
        description: "Your password has been changed.",
      });

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Update password error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl gradient-primary shadow-lg">
          <Key className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Update Password</h2>
          <p className="text-muted-foreground text-sm">Change your account password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="old-password" className="text-sm font-medium text-foreground">
            Current Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="old-password"
              type={showOldPassword ? "text" : "password"}
              placeholder="Enter current password"
              value={formData.oldPassword}
              onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
              className="pl-11 pr-11 h-12 bg-muted/50 border-border focus:border-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-sm font-medium text-foreground">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="pl-11 pr-11 h-12 bg-muted/50 border-border focus:border-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
            Confirm New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="pl-11 pr-11 h-12 bg-muted/50 border-border focus:border-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button type="submit" variant="gradient" className="w-full" size="lg">
          Update Password
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassword;