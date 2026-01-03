import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, UserPlus, CheckCircle, ArrowLeft, Key } from "lucide-react";
import { toast } from "sonner";
import RegisterAdmin from "@/components/RegisterAdmin";
import VerifyOfficials from "@/components/VerifyOfficials";
import UpdatePassword from "@/components/UpdatePassword";

type StepType = "verify" | "register" | "updatePassword";

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<StepType>("verify");

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const handleRegister = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('position', data.position);
      formData.append('department', data.department);
      if (data.image) {
        formData.append('photo', data.image);
      }

      const response = await fetch('https://glacier-backend-4r0g.onrender.com/admin/register', {
        method: 'POST',
        credentials: 'include', // Include cookies for auth
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast.success("Administrator registered!", {
          description: `${responseData.data.name} has been added successfully`,
        });
        // Stay on register page
      } else {
        toast.error("Registration failed!", {
          description: responseData.message || "Failed to register admin",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed!", {
        description: "Network error. Please try again.",
      });
    }
  };

  const handleVerify = (ids: string[]) => {
    console.log("Verified:", ids);
    toast.success(`${ids.length} official(s) verified!`, {
      description: "They now have access to the system",
    });
    // Optionally reset or show completion
    // localStorage.removeItem("isLoggedIn");
    // navigate("/");
  };

  const handlePasswordUpdate = async (oldPassword: string, newPassword: string) => {
    try {
      const response = await fetch('https://glacier-backend-4r0g.onrender.com/admin/updatepassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for auth
        body: JSON.stringify({
          current_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Password updated successfully!", {
          description: "Your password has been changed.",
        });
      } else {
        toast.error("Password update failed!", {
          description: data.message || "Failed to update password",
        });
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast.error("Password update failed!", {
        description: "Network error. Please try again.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://glacier-backend-4r0g.onrender.com/admin/signout', {
        method: 'POST',
        credentials: 'include', // Include cookies for auth
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear local storage
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        toast.success("Logged out successfully!");
        navigate("/");
      } else {
        // Even if API call fails, clear local storage and redirect
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        navigate("/");
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if network error, clear local storage and redirect
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10 px-4 sm:px-0">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-elevated mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">Administrative dashboard</p>
        </div>

        {/* Logout Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Logged in as: <span className="font-medium text-foreground">
              {(() => {
                const currentUser = localStorage.getItem("currentUser");
                return currentUser ? JSON.parse(currentUser).name : "Unknown";
              })()}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1.5 bg-muted/50 rounded-xl mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <button
            onClick={() => setCurrentStep("verify")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentStep === "verify"
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Verify Officials</span>
            <span className="sm:hidden">Verify</span>
          </button>
          <button
            onClick={() => setCurrentStep("register")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentStep === "register"
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Admin</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button
            onClick={() => setCurrentStep("updatePassword")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentStep === "updatePassword"
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline">Update Password</span>
            <span className="sm:hidden">Password</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-2xl shadow-elevated border border-border p-6 sm:p-8" style={{ animationDelay: "200ms" }}>
          {currentStep === "verify" && (
            <div className="space-y-6">
              <VerifyOfficials onVerify={handleVerify} />
              <div className="flex justify-between pt-4 border-t border-border">
                <button
                  onClick={() => setCurrentStep("updatePassword")}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
                >
                  <Key className="w-4 h-4" />
                  Update Password
                </button>
                <button
                  onClick={() => setCurrentStep("register")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  Add New Admin
                </button>
              </div>
            </div>
          )}
          {currentStep === "register" && (
            <div className="space-y-6">
              <RegisterAdmin onRegister={handleRegister} />
              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  onClick={() => setCurrentStep("verify")}
                  className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Verification
                </button>
              </div>
            </div>
          )}
          {currentStep === "updatePassword" && (
            <div className="space-y-6">
              <UpdatePassword onPasswordUpdate={handlePasswordUpdate} />
              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  onClick={() => setCurrentStep("verify")}
                  className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Verification
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
};

export default Register;