import { AppLayout, pageTransition } from "@/components/layout";
import { useAppGetStreaks } from "@/hooks/use-streaks";
import { useAppGetTodaySteps } from "@/hooks/use-steps";
import { useAppSubmitFeedback } from "@/hooks/use-feedback";
import { ProgressRing } from "@/components/ui/progress-ring";
import { MessageSquare, Loader2, Footprints, Target } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Health() {
  const { data: streaks } = useAppGetStreaks();
  const { data: stepsLog } = useAppGetTodaySteps();
  const submitFeedback = useAppSubmitFeedback();
  const { toast } = useToast();
  
  const [feedback, setFeedback] = useState("");

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    submitFeedback.mutate({ data: { type: "health", content: feedback } }, {
      onSuccess: () => {
        toast({ title: "Feedback sent", description: "Thanks for helping us improve health tracking!" });
        setFeedback("");
      }
    });
  };

  const currentSteps = stepsLog?.steps || 0;
  const goalSteps = 5000;
  const progress = currentSteps / goalSteps;

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="space-y-8">
        <header className="pt-2">
          <h1 className="text-[28px] font-bold text-[#F4F4F4]">Your Health Journey</h1>
          <p className="text-[#9CA3AF] mt-2 leading-relaxed text-[16px]">
            Strong lives need strong bodies. Step by step. Day by day.
          </p>
        </header>

        <div className="card-design flex flex-col items-center text-center">
          <div className="mb-8 w-full flex justify-between items-center px-2">
            <div className="text-left">
              <p className="text-[14px] text-[#9CA3AF] flex items-center gap-1.5 mb-1"><Target className="w-4 h-4 text-[#0F6F55]" /> Daily Goal</p>
              <p className="font-semibold text-[20px]">{goalSteps.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[14px] text-[#9CA3AF] flex items-center gap-1.5 mb-1 justify-end"><Footprints className="w-4 h-4 text-[#F2B705]" /> Streak</p>
              <p className="font-semibold text-[20px]">{streaks?.stepsStreak || 0} Days</p>
            </div>
          </div>
          
          <ProgressRing progress={progress} size={200} strokeWidth={16} color="#0F6F55">
            <div className="text-center">
              <span className="block text-[40px] font-bold font-display leading-tight">{currentSteps.toLocaleString()}</span>
              <span className="text-[14px] text-[#9CA3AF] uppercase tracking-widest font-medium">Steps</span>
            </div>
          </ProgressRing>
          
          <p className="mt-8 text-[16px] text-[#9CA3AF] font-medium">
            {currentSteps >= goalSteps 
              ? <span className="text-[#0F6F55]">Goal reached. Excellent work today.</span>
              : `${(goalSteps - currentSteps).toLocaleString()} more steps to reach your goal.`}
          </p>
        </div>

        <div className="card-design">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-5 h-5 text-[#F2B705]" />
            <h3 className="font-semibold text-[20px]">What would help your health?</h3>
          </div>
          <p className="text-[14px] text-[#9CA3AF] mb-6">
            Falaq Circle starts with the absolute basics and grows through the people walking the journey together.
          </p>
          <form onSubmit={handleFeedback} className="space-y-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Step goals, workouts, sleep tracking, fasting routines..."
              className="input-design min-h-[120px] resize-none"
            />
            <button 
              type="submit"
              disabled={!feedback.trim() || submitFeedback.isPending}
              className="btn-primary"
            >
              {submitFeedback.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Suggestion"}
            </button>
          </form>
        </div>
      </motion.div>
    </AppLayout>
  );
}
