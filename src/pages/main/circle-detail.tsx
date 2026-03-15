import { AppLayout, pageTransition } from "@/components/layout";
import { useAppGetCircle } from "@/hooks/use-circles";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { ArrowLeft, Flame, Trophy, Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CircleDetail() {
  const [, params] = useRoute("/circles/:id");
  const id = params?.id || "";
  
  const { data: circle, isLoading } = useAppGetCircle(id);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (circle?.inviteCode) {
      navigator.clipboard.writeText(circle.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) return <AppLayout><div className="flex justify-center py-32"><div className="animate-spin w-10 h-10 border-4 border-[#0F6F55] border-t-transparent rounded-full"></div></div></AppLayout>;
  if (!circle) return <AppLayout><div className="text-center py-32 text-[#9CA3AF]">Circle not found</div></AppLayout>;

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="space-y-8">
        <header className="flex items-center gap-4 pt-2">
          <Link href="/circles" className="p-3 -ml-3 text-[#9CA3AF] hover:text-[#F4F4F4] transition-colors rounded-full bg-white/5">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-[24px] font-bold text-[#F4F4F4] truncate">{circle.name}</h1>
        </header>

        <div className="card-design border-[#0F6F55]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0F6F55]/20 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[14px] font-semibold text-[#0F6F55] mb-2 uppercase tracking-wider">Group Streak</p>
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                <span className="text-[40px] font-bold leading-none">{circle.circleStreak}</span>
              </div>
            </div>
            <button 
              onClick={handleCopyCode}
              className="bg-black/60 hover:bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-xl text-[14px] font-medium flex items-center gap-2 border border-white/10 transition-all shadow-lg active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-[#0F6F55]" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : circle.inviteCode}
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6 px-2">
            <Trophy className="w-5 h-5 text-[#F2B705]" />
            <h3 className="font-semibold text-[20px]">Leaderboard</h3>
          </div>
          
          <div className="card-design !p-0 overflow-hidden">
            {circle.members.map((member, idx) => (
              <motion.div 
                key={member.userId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center justify-between p-5 ${idx !== circle.members.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <div className={`font-bold w-6 text-center text-[18px] ${idx === 0 ? 'text-[#F2B705] drop-shadow-[0_0_5px_rgba(242,183,5,0.5)]' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-[#9CA3AF]'}`}>
                    {idx + 1}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#1A2620] flex items-center justify-center text-[18px] font-bold border border-white/10 text-white shadow-inner">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-[16px]">{member.name}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                  <Flame className={`w-4 h-4 ${member.fajrStreak > 0 ? 'text-orange-500' : 'text-[#9CA3AF]'}`} />
                  <span className="font-bold text-[16px]">{member.fajrStreak}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
