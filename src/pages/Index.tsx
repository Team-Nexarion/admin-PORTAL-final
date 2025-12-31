import { useState } from "react";
import { Shield, LogIn, UserPlus, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import AdminLogin from "@/components/AdminLogin";
import RegisterAdmin from "@/components/RegisterAdmin";
import VerifyOfficials from "@/components/VerifyOfficials";

type TabType = "login" | "register" | "verify";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("login");

  const tabs = [
    { id: "login" as TabType, label: "Login", icon: LogIn },
    { id: "register" as TabType, label: "Register Admin", icon: UserPlus },
    { id: "verify" as TabType, label: "Verify Officials", icon: CheckCircle },
  ];

  const handleLogin = (email: string, password: string) => {
    if (email === "demo@" && password === "demo1234") {
      toast.success("Login successful!", {
        description: "Welcome back, Administrator",
      });
    } else {
      toast.error("Login failed!", {
        description: "Invalid email or password",
      });
    }
  };

  const handleRegister = (data: any) => {
    console.log("Register:", data);
    toast.success("Administrator registered!", {
      description: `${data.name} has been added successfully`,
    });
  };

  const handleVerify = (ids: string[]) => {
    console.log("Verified:", ids);
    toast.success(`${ids.length} official(s) verified!`, {
      description: "They now have access to the system",
    });
  };

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-elevated mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">Secure administrative access</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 bg-muted/50 rounded-xl mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-2xl shadow-elevated border border-border p-6 sm:p-8" style={{ animationDelay: "200ms" }}>
          {activeTab === "login" && <AdminLogin onLogin={handleLogin} />}
          {activeTab === "register" && <RegisterAdmin onRegister={handleRegister} />}
          {activeTab === "verify" && <VerifyOfficials onVerify={handleVerify} />}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
};

export default Index;
