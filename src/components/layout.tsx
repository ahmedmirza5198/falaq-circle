import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Home, Compass, Heart, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
};

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] text-foreground flex flex-col items-center justify-center w-full relative overflow-hidden" style={{ background: "linear-gradient(160deg, #020617 0%, #03140F 50%, #064E3B 100%)" }}>
      <main className="w-full max-w-md mx-auto min-h-[100dvh] flex flex-col relative z-10 px-6 py-12">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center" style={{ background: "linear-gradient(160deg, #020617 0%, #03140F 50%, #064E3B 100%)" }}>
      <div className="w-8 h-8 rounded-full border-4 border-[#0F6F55]/30 border-t-[#0F6F55] animate-spin"></div>
    </div>;
  }

  if (!isAuthenticated) {
    window.location.href = "/welcome";
    return null;
  }

  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/journey", icon: Compass, label: "Journey" },
    { href: "/circles", icon: null, label: "Circles", isCenter: true },
    { href: "/health", icon: Heart, label: "Health" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-[100dvh] text-foreground w-full relative pb-24 font-sans" style={{ background: "linear-gradient(160deg, #020617 0%, #03140F 50%, #064E3B 100%)" }}>
      <main className="w-full max-w-md mx-auto min-h-full px-5 py-8">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-0 inset-x-0 z-50 pb-safe pt-2 px-2" style={{ background: "rgba(5,10,8,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
        <div className="w-full max-w-md mx-auto flex items-center justify-around h-16 relative">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href === "/circles" && location.startsWith("/circles"));
            
            if (item.isCenter) {
              return (
                <Link key={item.href} href={item.href} className="relative group -mt-8">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 overflow-hidden border ${
                    isActive 
                      ? "border-[#F2B705]/50 scale-110 shadow-[0_0_20px_rgba(242,183,5,0.3)]" 
                      : "border-white/10 shadow-black/50"
                  }`} style={{ background: "rgba(5,10,8,0.7)" }}>
                    {/* Icon-only: shows bottom ~50% of the stacked logo PNG */}
                    <div
                      className={`transition-all duration-200 ${isActive ? "opacity-100" : "opacity-55 saturate-50"}`}
                      style={{
                        width: 44, height: 44, overflow: "hidden", position: "relative",
                        filter: isActive ? "drop-shadow(0 0 6px rgba(242,183,5,0.5))" : "none"
                      }}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}logo-transparent.png`}
                        alt="Circles"
                        style={{ width: 44, height: 88, objectFit: "cover", objectPosition: "center bottom", display: "block", position: "absolute", bottom: 0 }}
                      />
                    </div>
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="bottom-nav-indicator"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2B705] shadow-[0_0_10px_#F2B705]"
                    />
                  )}
                </Link>
              );
            }

            const Icon = item.icon!;

            return (
              <Link key={item.href} href={item.href} className="relative group w-16 h-full flex flex-col items-center justify-center gap-1">
                <Icon className={`w-6 h-6 transition-all duration-200 ${
                  isActive ? "text-[#F2B705]" : "text-[#9CA3AF] group-hover:text-white"
                }`} />
                {isActive && (
                  <motion.div 
                    layoutId="bottom-nav-indicator"
                    className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#F2B705] shadow-[0_0_10px_#F2B705]"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
