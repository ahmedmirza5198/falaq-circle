import { AppLayout, pageTransition } from "@/components/layout";
import { useAppGetStreaks } from "@/hooks/use-streaks";
import { useAppSubmitFeedback } from "@/hooks/use-feedback";
import { Flame, Star, Loader2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const MILESTONES = [
  { days: 3, label: "Momentum", desc: "You've begun to build the habit." },
  { days: 7, label: "Habit Forming", desc: "A full week of waking up for His sake." },
  { days: 30, label: "Strong Routine", desc: "A month of consistency." },
  { days: 90, label: "Deep Consistency", desc: "A quarter of a year. It's part of who you are." },
  { days: 365, label: "A Year of Discipline", desc: "True mastery and steadfastness." }
];

export default function Journey() {
  const { data: streaks } = useAppGetStreaks();
  const submitFeedback = useAppSubmitFeedback();
  const { toast } = useToast();
  
  const [feedback, setFeedback] = useState("");

  const currentStreak = streaks?.fajrStreak || 0;

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    submitFeedback.mutate({ data: { type: "journey", content: feedback } }, {
      onSuccess: () => {
        toast({ title: "Feedback sent", description: "Thank you for sharing your thoughts." });
        setFeedback("");
      }
    });
  };

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="space-y-8">
        <header className="pt-2">
          <h1 className="text-[28px] font-bold text-[#F4F4F4]">Your Deen Journey</h1>
          <p className="text-[#9CA3AF] mt-2 leading-relaxed text-[16px]">
            We begin with the most important habit — starting the day with Fajr. Small steps. Stronger habits.
          </p>
        </header>

        <div className="card-design">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="font-semibold text-[20px]">Current Fajr Streak</h2>
              <p className="text-[16px] text-[#9CA3AF]">{currentStreak} Days</p>
            </div>
          </div>

          <div className="space-y-6 relative">
            <div className="absolute left-6 top-4 bottom-4 w-px bg-white/10"></div>
            
            {MILESTONES.map((m) => {
              const achieved = currentStreak >= m.days;
              const next = currentStreak < m.days && currentStreak >= (MILESTONES[MILESTONES.indexOf(m)-1]?.days || 0);
              
              return (
                <div key={m.days} className={`flex gap-5 relative z-10 transition-opacity duration-300 ${achieved ? 'opacity-100' : next ? 'opacity-70' : 'opacity-40'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-[#0A140E] shadow-lg ${achieved ? 'bg-[#0F6F55] text-white shadow-[#0F6F55]/20' : 'bg-[#1A2620] text-[#9CA3AF]'}`}>
                    {achieved ? <Check className="w-5 h-5" /> : <Star className="w-4 h-4" />}
                  </div>
                  <div className="pt-2 pb-4">
                    <h4 className={`font-semibold text-[16px] ${achieved ? 'text-[#0F6F55]' : 'text-[#F4F4F4]'}`}>
                      {m.days} Days: {m.label}
                    </h4>
                    <p className="text-[14px] text-[#9CA3AF] mt-1">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-design">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-5 h-5 text-[#F2B705]" />
            <h3 className="font-semibold text-[20px]">What's next for your journey?</h3>
          </div>
          <p className="text-[14px] text-[#9CA3AF] mb-6">
            Falaq Circle starts with the absolute basics and grows through the people walking the journey together.
          </p>
          <form onSubmit={handleFeedback} className="space-y-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Quran consistency, Dhikr reminders, Tahajjud tracking..."
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

function Check(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
