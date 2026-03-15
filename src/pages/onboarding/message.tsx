import { Link } from "wouter";
import { motion } from "framer-motion";
import { AuthLayout, pageTransition } from "@/components/layout";
import { useAuth } from "@/lib/auth";

export default function PersonalizedMessage() {
  const { user } = useAuth();
  const name = user?.name || "Friend";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }
  };

  return (
    <AuthLayout>
      <motion.div {...pageTransition} className="flex-1 flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card-design w-full max-w-sm mx-auto"
        >
          <motion.h1 variants={itemVariants} className="text-[28px] font-bold text-[#F4F4F4] mb-8">
            Dear <span className="text-[#F2B705]">{name}</span>,
          </motion.h1>
          
          <div className="text-[16px] text-[#F4F4F4] leading-relaxed space-y-6 mb-10">
            <motion.p variants={itemVariants}>
              Ramadan showed us what consistency can do.
            </motion.p>
            <motion.p variants={itemVariants}>
              But discipline shouldn't fade after Eid.
            </motion.p>
            <motion.p variants={itemVariants}>
              Start the day with Fajr.<br/>
              Build the habit.<br/>
              Grow stronger with your circle.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="text-center mb-10">
            <p className="text-[#9CA3AF] text-[14px] leading-relaxed italic">Falaq, a ray of light for better lives, lifted by the strength of our circles!</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/setup-circle" className="btn-primary w-full">
              Begin Your Journey
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}
