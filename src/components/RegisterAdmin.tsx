import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, User, Mail, Building2, Briefcase, Upload, X } from "lucide-react";

const BASE_URL = "https://glacier-backend-1.onrender.com";

interface AdminData {
  name: string;
  email: string;
  password: string;
  image: File | null;
  department: string;
  position: string;
}

const RegisterAdmin = () => {
  const [formData, setFormData] = useState<AdminData>({
    name: "",
    email: "",
    password: "default123", // Default password for new admins
    image: null,
    department: "",
    position: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("position", formData.position);
      fd.append("department", formData.department);
      if (formData.image) {
        fd.append("photo", formData.image);
      }

      const res = await fetch(`${BASE_URL}/admin/register`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Admin registration failed");
        return;
      }

      alert("Admin registered successfully");
      console.log("Registered admin:", data.data);
    } catch (error) {
      console.error("Register admin error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl gradient-primary shadow-lg">
          <UserPlus className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Register Admin</h2>
          <p className="text-muted-foreground text-sm">Add a new administrator</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Profile Image</Label>
          <div className="flex items-center gap-4">
            <div className="relative">
              {imagePreview ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-card">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-accent transition-all"
                >
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 5MB.</p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="name"
              type="text"
        
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-11 h-12 bg-muted/50 border-border focus:border-primary"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="reg-email" className="text-sm font-medium text-foreground">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="reg-email"
              type="text"
              
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-11 h-12 bg-muted/50 border-border focus:border-primary"
              required
            />
          </div>
        </div>

       
        {/* Department - Text Input */}
        <div className="space-y-2">
          <Label htmlFor="department" className="text-sm font-medium text-foreground">
            Department
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="department"
              type="text"
              placeholder="Enter department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="pl-11 h-12 bg-muted/50 border-border focus:border-primary"
              required
            />
          </div>
        </div>

        {/* Position - Text Input */}
        <div className="space-y-2">
          <Label htmlFor="position" className="text-sm font-medium text-foreground">
            Position
          </Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="position"
              type="text"
              placeholder="Enter position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="pl-11 h-12 bg-muted/50 border-border focus:border-primary"
              required
            />
          </div>
        </div>

        <Button type="submit" variant="gradient" className="w-full" size="lg">
          Register Administrator
        </Button>
      </form>
    </div>
  );
};

export default RegisterAdmin;
