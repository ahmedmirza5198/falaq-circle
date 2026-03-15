import { Link } from "wouter";
import { motion } from "framer-motion";
import { AuthLayout, pageTransition } from "@/components/layout";

export default function Welcome() {
  return (
    <AuthLayout>
      <motion.div {...pageTransition} className="flex-1 flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{ 
            opacity: { duration: 0.8, ease: "easeOut" },
            scale: { duration: 0.8, ease: "easeOut" },
            y: { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: 0.8 }
          }}
          className="mb-10 relative flex items-center justify-center"
        >
          {/* Ambient glow layer */}
          <div className="absolute w-56 h-56 rounded-full blur-3xl opacity-60" style={{ background: "radial-gradient(circle, rgba(242,183,5,0.3) 0%, rgba(15,111,85,0.2) 50%, transparent 70%)" }} />
          {/* Full logo with text — shows top ~58% of the stacked PNG (the with-text version) */}
          <div className="relative overflow-hidden" style={{ width: 220, height: 148, filter: "drop-shadow(0 0 20px rgba(242,183,5,0.25))" }}>
            <img 
              src={`${import.meta.env.BASE_URL}logo-transparent.png`}
              alt="Falaq Circle"
              style={{ width: 220, height: 220, objectFit: "cover", objectPosition: "top center", display: "block" }}
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-[28px] font-bold mb-4 leading-tight">
            Better Lives,<br/>
            <span className="text-[#F2B705]">One Fajr at a Time</span>
          </h1>
          <p className="text-[#9CA3AF] text-[16px] mb-12 leading-relaxed max-w-[280px] mx-auto">
            Discipline built in Ramadan shouldn't end with it.<br/><br/>Begin your journey toward consistency today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full mt-auto flex justify-center"
        >
          <Link href="/auth" className="btn-primary w-auto min-w-[200px] text-[16px]">
            Bismillah!
          </Link>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}
