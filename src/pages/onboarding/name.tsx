import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { AuthLayout, pageTransition } from "@/components/layout";
import { useState } from "react";
import { useAppUpdateMe } from "@/hooks/use-users";
import { Loader2 } from "lucide-react";

export default function NameInput() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const updateMe = useAppUpdateMe();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    updateMe.mutate({ data: { name: name.trim() } }, {
      onSuccess: () => setLocation("/message")
    });
  };

  return (
    <AuthLayout>
      <motion.div {...pageTransition} className="flex-1 flex flex-col justify-center">
        <div className="card-design w-full max-w-sm mx-auto">
          <h1 className="text-[28px] font-bold mb-8 text-center">What should we call you?</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="input-design text-lg py-4"
              autoFocus
            />
            
            <button 
              type="submit"
              disabled={!name.trim() || updateMe.isPending}
              className="btn-primary"
            >
              {updateMe.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Continue"}
            </button>
          </form>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
