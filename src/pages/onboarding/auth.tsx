import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { AuthLayout, pageTransition } from "@/components/layout";
import { useAppCreateSession } from "@/hooks/use-users";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const createSession = useAppCreateSession();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleLogin = (provider: "google" | "apple") => {
    setLoadingProvider(provider);
    createSession.mutate({
      data: { provider }
    }, {
      onSuccess: (data) => {
        login(data.token, data.user);
        if (data.isNew) {
          setLocation("/name");
        } else {
          setLocation("/home");
        }
      },
      onError: () => {
        setLoadingProvider(null);
        toast({
          title: "Sign in failed",
          description: "Could not sign in at this time. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <AuthLayout>
      <motion.div {...pageTransition} className="flex-1 flex flex-col">
        <div className="mt-8 mb-auto">
          <Link href="/welcome" className="text-[#9CA3AF] hover:text-[#F4F4F4] transition-colors p-2 -ml-2 inline-flex items-center justify-center rounded-full bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-[28px] font-bold mb-2">Join Falaq Circle</h1>
          <p className="text-[#9CA3AF] text-[14px] mb-8">Start building better lives, one Fajr at a time.</p>

          <div className="space-y-[16px]">
            <button 
              onClick={() => handleLogin("google")}
              disabled={loadingProvider !== null}
              className="btn-primary w-full flex items-center justify-center gap-3 bg-gradient-to-br from-[#0F6F55] to-[#15826A] text-white disabled:opacity-50"
            >
              {loadingProvider === "google" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Continue with Google
            </button>
            
            <button 
              onClick={() => handleLogin("apple")}
              disabled={loadingProvider !== null}
              className="btn-primary w-full flex items-center justify-center gap-3 bg-gradient-to-br from-[#0F6F55] to-[#15826A] text-white disabled:opacity-50"
            >
              {loadingProvider === "apple" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.05 15.65c-.04 1.76 1.48 2.89 1.54 2.92-.01.03-.23.82-.78 1.63-.48.69-1 1.38-1.74 1.41-.74.02-1-.43-1.84-.43-.84 0-1.12.42-1.84.45-.74.03-1.31-.73-1.8-1.42-1.04-1.49-1.83-4.21-1.3-6.07.26-.92.83-1.68 1.57-2.13.71-.43 1.53-.54 2.29-.54.74 0 1.43.3 1.9.3.47 0 1.28-.35 2.18-.35.94 0 1.69.18 2.34.58-.33.19-1.49.87-1.52 2.64M14.97 4.96c.39-.48.65-1.16.57-1.84-.63.03-1.34.42-1.74.89-.35.41-.67 1.11-.58 1.78.7.05 1.37-.36 1.75-.83"/>
                </svg>
              )}
              Continue with Apple
            </button>
          </div>
        </div>
        
        <div className="mt-auto pt-8 text-center">
          <p className="text-[14px] text-[#9CA3AF]">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
