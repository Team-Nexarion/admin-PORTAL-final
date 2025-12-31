import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, User, Building2, Briefcase, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Official {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  image?: string;
  requestedAt: string;
  verified: boolean;
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
    requestedAt: "2 hours ago",
    verified: false,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@company.com",
    department: "Engineering",
    position: "Senior Administrator",
    requestedAt: "5 hours ago",
    verified: false,
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "e.davis@company.com",
    department: "Finance",
    position: "Manager",
    requestedAt: "1 day ago",
    verified: false,
  },
  {
    id: "4",
    name: "Robert Wilson",
    email: "r.wilson@company.com",
    department: "Operations",
    position: "Coordinator",
    requestedAt: "2 days ago",
    verified: false,
  },
];

const VerifyOfficials = ({ onVerify }: VerifyOfficialsProps) => {
  const [officials, setOfficials] = useState<Official[]>(mockOfficials);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === officials.filter((o) => !o.verified).length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(officials.filter((o) => !o.verified).map((o) => o.id));
    }
  };

  const handleVerify = () => {
    onVerify(selectedIds);
    setOfficials((prev) =>
      prev.map((o) => (selectedIds.includes(o.id) ? { ...o, verified: true } : o))
    );
    setSelectedIds([]);
  };

  const pendingOfficials = officials.filter((o) => !o.verified);
  const verifiedOfficials = officials.filter((o) => o.verified);

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedIds.length === pendingOfficials.length && pendingOfficials.length > 0}
                onCheckedChange={toggleAll}
                id="select-all"
              />
              <label htmlFor="select-all" className="text-sm font-medium text-foreground cursor-pointer">
                Select All ({pendingOfficials.length} pending)
              </label>
            </div>
            {selectedIds.length > 0 && (
              <Button onClick={handleVerify} variant="success" size="sm">
                Verify Selected ({selectedIds.length})
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {pendingOfficials.map((official) => (
              <div
                key={official.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  selectedIds.includes(official.id)
                    ? "border-primary bg-accent/50 shadow-card"
                    : "border-border bg-card hover:border-primary/50 hover:shadow-card"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedIds.includes(official.id)}
                    onCheckedChange={() => toggleSelection(official.id)}
                    id={`official-${official.id}`}
                  />
                  <Avatar className="w-12 h-12 border-2 border-border">
                    <AvatarImage src={official.image} alt={official.name} />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {official.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground truncate">{official.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning-foreground border border-warning/20">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{official.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {official.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {official.position}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {official.requestedAt}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {verifiedOfficials.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Recently Verified</h3>
          <div className="space-y-3">
            {verifiedOfficials.map((official) => (
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
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground truncate">{official.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                        Verified
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{official.position} • {official.department}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingOfficials.length === 0 && verifiedOfficials.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Pending Requests</h3>
          <p className="text-muted-foreground">All officials have been verified</p>
        </div>
      )}
    </div>
  );
};

export default VerifyOfficials;
