import { AppLayout, pageTransition } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { useAppGetStreaks } from "@/hooks/use-streaks";
import { useAppGetMyCircles } from "@/hooks/use-circles";
import { useAppUpdateMe } from "@/hooks/use-users";
import { LogOut, Flame, Footprints, Edit2, Loader2, Camera, User as UserIcon } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, logout } = useAuth();
  const { data: streaks, isLoading: streaksLoading } = useAppGetStreaks();
  const { data: circles, isLoading: circlesLoading } = useAppGetMyCircles();
  const updateMe = useAppUpdateMe();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Update state when user changes
  useEffect(() => {
    if (user?.name) {
      setEditName(user.name);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setLocation("/welcome");
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    
    updateMe.mutate({ data: { name: editName } }, {
      onSuccess: () => {
        setIsEditing(false);
        toast({ title: "Profile updated", description: "Your changes have been saved." });
      }
    });
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({ title: "Image upload", description: "This feature is coming soon." });
    }
  };

  const daysSinceJoin = user?.createdAt 
    ? Math.max(1, Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 3600 * 24)))
    : 1;

  const circlesCount = circles?.length || 0;

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="space-y-8">
        <header className="pt-6 text-center flex flex-col items-center">
          <div 
            onClick={handleAvatarClick}
            className={`relative w-28 h-28 rounded-full bg-[#0F6F55] border-4 border-[#050A08] flex items-center justify-center shadow-[0_0_30px_rgba(15,111,85,0.3)] mb-5 overflow-hidden ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}`}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[40px] font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-12 h-12" />}
              </span>
            )}
            
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div 
                key="editing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-[250px] mx-auto space-y-3"
              >
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-design text-center text-lg"
                  placeholder="Your Name"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={updateMe.isPending}
                    className="btn-primary flex-1 h-10 text-[14px]"
                  >
                    {updateMe.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </button>
                  <button 
                    onClick={() => { setIsEditing(false); setEditName(user?.name || ""); }}
                    className="px-4 py-2 bg-white/10 rounded-xl text-[14px] font-medium hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="viewing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-[28px] font-bold text-[#F4F4F4] flex items-center gap-2 justify-center">
                  {user?.name || "User"} 
                </h1>
                <p className="text-[#9CA3AF] text-[16px] mt-1 font-medium">{daysSinceJoin} Days on Falaq Circle</p>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <div className="grid grid-cols-2 gap-4">
          <div className="card-design flex flex-col items-center justify-center p-6">
            <Flame className="w-8 h-8 text-orange-500 mb-3 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
            {streaksLoading ? (
              <div className="w-12 h-8 skeleton-pulse rounded mb-1"></div>
            ) : (
              <span className="text-[28px] font-bold">{streaks?.fajrStreak || 0}</span>
            )}
            <span className="text-[12px] text-[#9CA3AF] font-semibold uppercase tracking-wider mt-1">Fajr Streak</span>
          </div>
          <div className="card-design flex flex-col items-center justify-center p-6">
            <Footprints className="w-8 h-8 text-[#0F6F55] mb-3 drop-shadow-[0_0_10px_rgba(15,111,85,0.5)]" />
            {streaksLoading ? (
              <div className="w-12 h-8 skeleton-pulse rounded mb-1"></div>
            ) : (
              <span className="text-[28px] font-bold">{streaks?.stepsStreak || 0}</span>
            )}
            <span className="text-[12px] text-[#9CA3AF] font-semibold uppercase tracking-wider mt-1">Steps Streak</span>
          </div>
        </div>

        <div className="card-design p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-[16px]">Community</h3>
            {circlesLoading ? (
              <div className="w-8 h-6 skeleton-pulse rounded"></div>
            ) : (
              <span className="text-[20px] font-bold text-[#F2B705]">{circlesCount}</span>
            )}
          </div>
          <p className="text-[#9CA3AF] text-[14px]">Active Circles Joined</p>
        </div>

        <div className="space-y-4 pt-4">
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full card-design !p-4 flex items-center justify-between group hover:border-[#0F6F55]/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#9CA3AF] group-hover:text-[#0F6F55] group-hover:bg-[#0F6F55]/10 transition-colors">
                <Edit2 className="w-5 h-5" />
              </div>
              <span className="font-medium text-[16px]">Edit Profile</span>
            </div>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full card-design !p-4 flex items-center justify-between group border-red-500/20 hover:border-red-500/50 bg-red-500/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-medium text-[16px] text-red-500">Sign Out</span>
            </div>
          </button>
        </div>
      </motion.div>
    </AppLayout>
  );
}
