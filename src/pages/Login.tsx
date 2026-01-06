import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import AdminLogin from "@/components/AdminLogin";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('https://glacier-backend-1.onrender.com/admin/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user data and token
        localStorage.setItem("currentUser", JSON.stringify(data.data));
        localStorage.setItem("isLoggedIn", "true");
        toast.success("Login successful!", {
          description: `Welcome back, ${data.data.name}`,
        });
        // Navigate to register page
        navigate("/register");
      } else {
        toast.error("Login failed!", {
          description: data.message || "Invalid email or password",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed!", {
        description: "Network error. Please try again.",
      });
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
          <p className="text-muted-foreground">Secure administrative access</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl shadow-elevated border border-border p-6 sm:p-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <AdminLogin onLogin={handleLogin} />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
};

export default Login;