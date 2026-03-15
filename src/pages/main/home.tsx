import { AppLayout, pageTransition } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { useAppGetTodayFajr, useAppLogFajr } from "@/hooks/use-fajr";
import { useAppGetTodaySteps, useAppLogSteps } from "@/hooks/use-steps";
import { useAppGetStreaks } from "@/hooks/use-streaks";
import { ProgressRing } from "@/components/ui/progress-ring";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Check, Plus, Loader2, Sun } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const { data: fajrLog } = useAppGetTodayFajr();
  const { data: stepsLog } = useAppGetTodaySteps();
  const { data: streaks } = useAppGetStreaks();
  
  const logFajr = useAppLogFajr();
  const logSteps = useAppLogSteps();
  
  const [stepsInput, setStepsInput] = useState("");
  const [showStepsInput, setShowStepsInput] = useState(false);
  const [isAnimatingFajr, setIsAnimatingFajr] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const hasLoggedFajr = fajrLog?.prayed || logFajr.isSuccess;

  const handleLogFajr = () => {
    setIsAnimatingFajr(true);
    // Button scale down happens via CSS/framer motion
    
    // Play sunrise animation sequence
    setTimeout(() => {
      logFajr.mutate({}, {
        onSuccess: () => {
          setShowSuccess(true);
        }
      });
    }, 600);
  };

  const handleLogSteps = (e: React.FormEvent) => {
    e.preventDefault();
    const steps = parseInt(stepsInput);
    if (!isNaN(steps) && steps > 0) {
      logSteps.mutate({ data: { steps } }, {
        onSuccess: () => {
          setShowStepsInput(false);
          setStepsInput("");
        }
      });
    }
  };

  const currentSteps = stepsLog?.steps || 0;
  const goalSteps = 5000;
  const stepsProgress = currentSteps / goalSteps;
  const stepsReached = currentSteps >= goalSteps;

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="space-y-8">
        <header className="pt-2">
          <h1 className="text-[28px] font-bold text-[#F4F4F4]">
            Assalamualaikum, <span className="text-[#F2B705]">{user?.name?.split(' ')[0] || 'Friend'}</span>
          </h1>
          <p className="text-[#9CA3AF] mt-1 text-[16px]">This new day brings new possibilities.</p>
        </header>

        {/* Integrity Card */}
        <div className="card-design relative overflow-hidden">
          <h3 className="font-semibold text-[20px] mb-4">Integrity</h3>
          <div className="text-[16px] text-[#9CA3AF] leading-relaxed space-y-4 whitespace-pre-wrap">
            Discipline begins with honesty.{"\n\n"}This is between you and your intentions.{"\n\n"}Log what you truly complete.
          </div>
        </div>

        {/* Fajr Card */}
        <div className={`card-design relative overflow-hidden flex flex-col items-center text-center min-h-[240px] justify-center transition-all duration-300 ${hasLoggedFajr || showSuccess ? 'shadow-[0_0_40px_rgba(242,183,5,0.15)] border-[#F2B705]/20' : ''}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(242,183,5,0.15)_0%,transparent_60%)] opacity-50 pointer-events-none"></div>
          
          <AnimatePresence mode="wait">
            {!hasLoggedFajr && !isAnimatingFajr && !showSuccess ? (
              <motion.div 
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col items-center z-10"
              >
                <div className="flex items-center gap-2 text-[#F2B705] font-medium mb-4">
                  <Sun className="w-4 h-4" />
                  <span className="text-[14px]">Fajr</span>
                </div>
                <h2 className="text-[20px] font-semibold mb-6">Did you pray Fajr today?</h2>
                <button
                  onClick={handleLogFajr}
                  className="btn-primary w-full shadow-[0_0_20px_rgba(15,111,85,0.3)] hover:shadow-[0_0_30px_rgba(15,111,85,0.5)]"
                >
                  I prayed Fajr, Alhamdulillah
                </button>
              </motion.div>
            ) : isAnimatingFajr && !showSuccess ? (
              <motion.div
                key="animating"
                className="w-full h-full absolute inset-0 flex items-end justify-center overflow-hidden"
              >
                <motion.div 
                  initial={{ width: "0%", opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 h-[2px] bg-[#F2B705] z-10"
                />
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 20, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-t from-[#F2B705] to-orange-400 blur-sm absolute -bottom-12"
                />
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full flex flex-col items-center z-10"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F2B705] to-orange-500 mb-4 shadow-[0_0_30px_rgba(242,183,5,0.5)] flex items-center justify-center">
                  <Check className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-[20px] font-semibold text-[#F2B705] mb-2">Alhamdulillah.</h2>
                <p className="text-[14px] text-[#9CA3AF] mb-4 px-4">
                  Alhamdulillah, {user?.name?.split(' ')[0] || 'friend'}. Carry this intention through your day.
                </p>
                
                {streaks && (streaks.fajrStreak > 0 || logFajr.isSuccess) && (
                  <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-[14px]">Fajr Streak: {(streaks?.fajrStreak || 0) + (logFajr.isSuccess && streaks?.fajrStreak === 0 ? 1 : 0)} days</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Steps Card */}
        <div className="card-design">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-[20px]">Daily Steps</h2>
            <span className="text-[14px] font-medium text-[#9CA3AF] bg-white/5 px-3 py-1 rounded-full">
              Goal: {goalSteps.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <ProgressRing progress={stepsProgress} size={110} strokeWidth={10} color={stepsReached ? "#0F6F55" : "#F2B705"}>
              <div className="text-center">
                <span className="block text-2xl font-bold font-display">{currentSteps > 999 ? (currentSteps/1000).toFixed(1) + 'k' : currentSteps}</span>
              </div>
            </ProgressRing>

            <div className="flex-1">
              {stepsReached ? (
                <div className="text-[14px] text-[#9CA3AF]">
                  <p className="font-medium text-[#0F6F55] mb-1">Goal reached!</p>
                  Your body kept pace with your discipline today.
                </div>
              ) : showStepsInput ? (
                <form onSubmit={handleLogSteps} className="flex flex-col gap-3">
                  <input
                    type="number"
                    value={stepsInput}
                    onChange={(e) => setStepsInput(e.target.value)}
                    placeholder="Enter steps..."
                    className="input-design text-[14px] py-2.5"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button type="submit" disabled={logSteps.isPending} className="btn-primary h-10 px-0 flex-1 text-[14px]">
                      {logSteps.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </button>
                    <button type="button" onClick={() => setShowStepsInput(false)} className="px-4 text-[14px] text-[#9CA3AF] hover:text-white transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-[14px]">
                  <p className="text-[#9CA3AF] mb-4">{Math.max(0, goalSteps - currentSteps)} more to go.</p>
                  <button 
                    onClick={() => setShowStepsInput(true)}
                    className="btn-primary h-10 w-full text-[14px] gap-2 !bg-white/10 hover:!bg-white/20 !shadow-none border border-white/5"
                  >
                    <Plus className="w-4 h-4" /> Log Steps
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </motion.div>
    </AppLayout>
  );
}
