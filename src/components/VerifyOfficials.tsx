import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, User, Mail, Building2, Briefcase, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const BASE_URL = "https://glacier-backend-4r0g.onrender.com";

interface Official {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  photo?: string;
  isVerified: boolean;
  verifiedById?: number;
  createdAt: string;
  updatedAt: string;
}

const VerifyOfficials = () => {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({});

  // Fetch pending officials on component mount
  useEffect(() => {
    fetchOfficials();
  }, []);

  const fetchOfficials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/admin/officials`, {
        method: 'GET',
        credentials: 'include', // Include cookies for auth
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Filter only unverified officials
        const pendingOfficials = data.data.filter((official: Official) => !official.isVerified);
        setOfficials(pendingOfficials);
      } else {
        toast.error("Failed to fetch officials", {
          description: data.message || "Unable to load pending requests",
        });
      }
    } catch (error) {
      console.error('Fetch officials error:', error);
      toast.error("Failed to fetch officials", {
        description: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));

      const response = await fetch(`${BASE_URL}/admin/officials/verify/${id}`, {
        method: 'POST',
        credentials: 'include', // Include cookies for auth
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove the verified official from the list
        setOfficials(prev => prev.filter(official => official.id !== id));
        toast.success("Official verified!", {
          description: `${data.data.name} has been verified successfully`,
        });
      } else {
        toast.error("Verification failed!", {
          description: data.message || "Unable to verify official",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error("Verification failed!", {
        description: "Network error. Please try again.",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));

      const response = await fetch(`${BASE_URL}/admin/officials/decline/${id}`, {
        method: 'POST',
        credentials: 'include', // Include cookies for auth
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove the rejected official from the list
        setOfficials(prev => prev.filter(official => official.id !== id));
        toast.success("Official declined!", {
          description: `${data.data.name} has been removed from the system`,
        });
      } else {
        toast.error("Decline failed!", {
          description: data.message || "Unable to decline official",
        });
      }
    } catch (error) {
      console.error('Decline error:', error);
      toast.error("Decline failed!", {
        description: "Network error. Please try again.",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl gradient-primary shadow-lg">
          <CheckCircle className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Official Verification</h2>
          <p className="text-muted-foreground text-sm">Review and manage official applications</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6 border border-primary/10">
            <Loader2 className="w-10 h-10 text-primary/60 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">Loading Officials</h3>
          <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Fetching pending verification requests...
          </p>
        </div>
      ) : officials.length > 0 ? (
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <h3 className="text-lg font-medium text-foreground">
              Pending Review ({officials.length})
            </h3>
          </div>
          <div className="space-y-3">
            {officials.map((official) => (
              <div
                key={official.id}
                className="p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Avatar className="w-14 h-14 border-2 border-border flex-shrink-0">
                    <AvatarImage src={official.photo} alt={official.name} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                      {official.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{official.name}</h4>
                    <div className="flex flex-col gap-2 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{official.email}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{official.department}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{official.position}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                    <Button
                      onClick={() => handleAccept(official.id)}
                      variant="success"
                      size="sm"
                      className="gap-1 flex-1 sm:flex-none"
                      disabled={actionLoading[official.id]}
                    >
                      {actionLoading[official.id] ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {actionLoading[official.id] ? "Verifying..." : "Accept"}
                    </Button>
                    <Button
                      onClick={() => handleReject(official.id)}
                      variant="destructive"
                      size="sm"
                      className="gap-1 flex-1 sm:flex-none"
                      disabled={actionLoading[official.id]}
                    >
                      {actionLoading[official.id] ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      {actionLoading[official.id] ? "Declining..." : "Reject"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6 border border-primary/10">
            <CheckCircle className="w-10 h-10 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">All Clear</h3>
          <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
            No pending verification requests at this time. New requests will appear here when officials submit their applications.
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyOfficials;
