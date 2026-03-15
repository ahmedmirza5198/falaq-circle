import { AppLayout, pageTransition } from "@/components/layout";
import { useAppGetMyCircles } from "@/hooks/use-circles";
import { Link } from "wouter";
import { Users, Plus, ChevronRight, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function Circles() {
  const { data: circles, isLoading } = useAppGetMyCircles();

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="space-y-8">
        <header className="pt-2">
          <h1 className="text-[28px] font-bold text-[#F4F4F4]">Your Circles</h1>
          <p className="text-[#9CA3AF] mt-1 text-[16px]">Discipline shared is discipline multiplied.</p>
        </header>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/setup-circle" className="card-design flex flex-col items-center justify-center text-center gap-3 p-6 hover:border-[#0F6F55]/50 group">
            <div className="w-12 h-12 bg-[#0F6F55]/20 rounded-full flex items-center justify-center text-[#0F6F55] group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[16px] font-semibold text-[#F4F4F4]">Create</span>
          </Link>
          <Link href="/setup-circle" className="card-design flex flex-col items-center justify-center text-center gap-3 p-6 hover:border-[#F2B705]/50 group">
            <div className="w-12 h-12 bg-[#F2B705]/20 rounded-full flex items-center justify-center text-[#F2B705] group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[16px] font-semibold text-[#F4F4F4]">Join</span>
          </Link>
        </div>

        <div>
          <h3 className="font-semibold text-[20px] mb-2">Active Circles</h3>
          <p className="text-[#9CA3AF] text-[13px] mb-6 leading-relaxed">At least one person in the group needs to pray Fajr to keep the streak alive.</p>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-[100px] card-design skeleton-pulse"></div>)}
            </div>
          ) : circles?.length === 0 ? (
            <div className="text-center py-16 card-design border-dashed">
              <Users className="w-12 h-12 text-[#9CA3AF]/30 mx-auto mb-4" />
              <p className="text-[#9CA3AF] text-[16px]">You haven't joined any circles yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {circles?.map((circle, index) => (
                <motion.div
                  key={circle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/circles/${circle.id}`} className="block card-design !p-5 group hover:border-[#0F6F55]/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0F6F55] to-[#15826A] border-2 border-[#0A140E] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {circle.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-[18px] text-[#F4F4F4] group-hover:text-[#0F6F55] transition-colors mb-1">{circle.name}</h4>
                          <p className="text-[14px] text-[#9CA3AF] flex items-center gap-2">
                            <span>{circle.memberCount} members</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                            <span className="text-orange-400 flex items-center font-medium"><Flame className="w-3.5 h-3.5 mr-1" /> {circle.circleStreak}d</span>
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-[#9CA3AF] group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AppLayout>
  );
}
