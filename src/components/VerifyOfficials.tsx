import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, User, Mail, Building2, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Official {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  image?: string;
  status: "pending" | "accepted" | "rejected";
}

interface VerifyOfficialsProps {
  onVerify: (officialIds: string[]) => void;
}

const mockOfficials: Official[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    department: "Human Resources",
    position: "Director",
    status: "pending",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@company.com",
    department: "Engineering",
    position: "Senior Administrator",
    status: "pending",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "e.davis@company.com",
    department: "Finance",
    position: "Manager",
    status: "pending",
  },
  {
    id: "4",
    name: "Robert Wilson",
    email: "r.wilson@company.com",
    department: "Operations",
    position: "Coordinator",
    status: "pending",
  },
];

const VerifyOfficials = ({ onVerify }: VerifyOfficialsProps) => {
  const [officials, setOfficials] = useState<Official[]>(mockOfficials);

  const handleAccept = (id: string) => {
    setOfficials((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "accepted" as const } : o))
    );
    onVerify([id]);
  };

  const handleReject = (id: string) => {
    setOfficials((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "rejected" as const } : o))
    );
  };

  const pendingOfficials = officials.filter((o) => o.status === "pending");
  const acceptedOfficials = officials.filter((o) => o.status === "accepted");
  const rejectedOfficials = officials.filter((o) => o.status === "rejected");

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl gradient-primary shadow-lg">
          <CheckCircle className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Verify Officials</h2>
          <p className="text-muted-foreground text-sm">Review and approve pending requests</p>
        </div>
      </div>

      {pendingOfficials.length > 0 && (
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Pending Requests ({pendingOfficials.length})
          </h3>
          <div className="space-y-3">
            {pendingOfficials.map((official) => (
              <div
                key={official.id}
                className="p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="w-14 h-14 border-2 border-border">
                    <AvatarImage src={official.image} alt={official.name} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                      {official.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{official.name}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {official.email}
                      </span>
                      <span className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {official.department}
                      </span>
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {official.position}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAccept(official.id)}
                      variant="success"
                      size="sm"
                      className="gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleReject(official.id)}
                      variant="destructive"
                      size="sm"
                      className="gap-1"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {acceptedOfficials.length > 0 && (
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-muted-foreground">Accepted</h3>
          <div className="space-y-3">
            {acceptedOfficials.map((official) => (
              <div
                key={official.id}
                className="p-4 rounded-xl border border-success/20 bg-success/5"
              >
                <div className="flex items-center gap-4">
                  <div className="p-1 rounded-full bg-success/10">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <Avatar className="w-10 h-10 border-2 border-success/20">
                    <AvatarImage src={official.image} alt={official.name} />
                    <AvatarFallback className="bg-success/10 text-success">
                      {official.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{official.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {official.position} • {official.department}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rejectedOfficials.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Rejected</h3>
          <div className="space-y-3">
            {rejectedOfficials.map((official) => (
              <div
                key={official.id}
                className="p-4 rounded-xl border border-destructive/20 bg-destructive/5"
              >
                <div className="flex items-center gap-4">
                  <div className="p-1 rounded-full bg-destructive/10">
                    <X className="w-5 h-5 text-destructive" />
                  </div>
                  <Avatar className="w-10 h-10 border-2 border-destructive/20">
                    <AvatarImage src={official.image} alt={official.name} />
                    <AvatarFallback className="bg-destructive/10 text-destructive">
                      {official.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{official.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {official.position} • {official.department}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingOfficials.length === 0 && acceptedOfficials.length === 0 && rejectedOfficials.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Pending Requests</h3>
          <p className="text-muted-foreground">All officials have been reviewed</p>
        </div>
      )}
    </div>
  );
};

export default VerifyOfficials;
