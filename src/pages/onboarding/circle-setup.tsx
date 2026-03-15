import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { AuthLayout, pageTransition } from "@/components/layout";
import { Users, Plus, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAppCreateCircle, useAppJoinCircle } from "@/hooks/use-circles";
import { useToast } from "@/hooks/use-toast";

export default function CircleSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [inputValue, setInputValue] = useState("");
  
  const createCircle = useAppCreateCircle();
  const joinCircle = useAppJoinCircle();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    createCircle.mutate({ data: { name: inputValue } }, {
      onSuccess: () => setLocation("/home"),
      onError: () => toast({ title: "Error", description: "Could not create circle", variant: "destructive" })
    });
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    joinCircle.mutate({ data: { inviteCode: inputValue } }, {
      onSuccess: () => setLocation("/home"),
      onError: () => toast({ title: "Error", description: "Invalid invite code", variant: "destructive" })
    });
  };

  return (
    <AuthLayout>
      <motion.div {...pageTransition} className="flex-1 flex flex-col pt-12 pb-6">
        <div className="w-full max-w-sm mx-auto">
          {mode === "choose" && (
            <>
              <h1 className="text-[28px] font-bold mb-3 text-center">Stronger together.</h1>
              <p className="text-[#9CA3AF] mb-10 text-[16px] text-center">
                Habits form best when shared. Create a circle for your friends, or join an existing one.
              </p>

              <div className="space-y-4">
                <button 
                  onClick={() => setMode("create")}
                  className="card-design w-full flex items-center p-6 hover:border-[#0F6F55]/50 group text-left !bg-black/40"
                >
                  <div className="w-12 h-12 bg-[#0F6F55]/20 text-[#0F6F55] rounded-xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[16px]">Create a Circle</h3>
                    <p className="text-[#9CA3AF] text-[14px]">Start a new group</p>
                  </div>
                </button>

                <button 
                  onClick={() => setMode("join")}
                  className="card-design w-full flex items-center p-6 hover:border-[#F2B705]/50 group text-left !bg-black/40"
                >
                  <div className="w-12 h-12 bg-[#F2B705]/20 text-[#F2B705] rounded-xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[16px]">Join a Circle</h3>
                    <p className="text-[#9CA3AF] text-[14px]">Have an invite code?</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {(mode === "create" || mode === "join") && (
            <div className="card-design">
              <button type="button" onClick={() => setMode("choose")} className="text-[#9CA3AF] hover:text-white mb-6 text-sm flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              
              {mode === "create" ? (
                <form onSubmit={handleCreate}>
                  <h1 className="text-[28px] font-bold mb-8">Name your circle</h1>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. Dawn Chasers"
                    className="input-design text-lg py-4 mb-6"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || createCircle.isPending}
                    className="btn-primary"
                  >
                    {createCircle.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create Circle"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleJoin}>
                  <h1 className="text-[28px] font-bold mb-8">Enter invite code</h1>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. ABCD12"
                    className="input-design text-lg py-4 mb-6 uppercase"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || joinCircle.isPending}
                    className="btn-primary"
                  >
                    {joinCircle.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Join Circle"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {mode === "choose" && (
          <div className="mt-auto pt-12 text-center">
            <Link href="/home" className="text-[#9CA3AF] font-medium flex items-center justify-center gap-2 hover:text-[#F4F4F4] transition-colors">
              Skip for now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </motion.div>
    </AuthLayout>
  );
}
