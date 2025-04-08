"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { PlusCircle, TrendingUp, Award, BarChart2, RefreshCw, Loader2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import AddNewInterview from './_components/AddNewInterview';
import InterviewItemCard from './_components/InterviewItemCard';

function Dashboard() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isNewInterviewModalOpen, setIsNewInterviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statsCards, setStatsCards] = useState([
    { title: "Total Interviews", value: "0", icon: BarChart2, gradient: "from-indigo-600 to-blue-500", trend: "up" },
    { title: "Best Score", value: "N/A", icon: Award, gradient: "from-amber-500 to-orange-500", trend: "neutral" },
    { title: "Improvement Rate", value: "0%", icon: TrendingUp, gradient: "from-emerald-500 to-teal-500", trend: "up" }
  ]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchInterviewData();
    }
  }, [user]);

  const fetchInterviewData = async () => {
    setIsLoading(true);
    try {
      // Fetch Mock Interviews
      const interviews = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));

      // Fetch User Answers
      const response = await fetch('/api/fetchUserData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user.primaryEmailAddress.emailAddress })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user answers');
      }

      const data = await response.json();
      const userSpecificAnswers = data.userAnswers.filter(
        answer => answer.userEmail === user.primaryEmailAddress.emailAddress
      );

      setInterviewList(interviews);
      setUserAnswers(userSpecificAnswers);

      // Update stats
      const totalInterviews = interviews.length;
      const bestScore = userSpecificAnswers.length > 0
        ? Math.max(...userSpecificAnswers.map(item => parseInt(item.rating || '0')))
        : 0;
      const improvementRate = calculateImprovementRate(userSpecificAnswers);

      setStatsCards([
        { ...statsCards[0], value: totalInterviews.toString() },
        { ...statsCards[1], value: bestScore ? `${bestScore}/10` : 'N/A' },
        { ...statsCards[2], value: `${improvementRate}%` }
      ]);

      if (totalInterviews === 0) {
        toast.info("No previous interviews found. Create your first one!");
      } else {
        toast.success(`Loaded ${totalInterviews} interview(s)`);
      }
    } catch (error) {
      console.error("Error fetching interview data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateImprovementRate = (answers) => {
    if (answers.length <= 1) return 0;
    const scores = answers
      .map(answer => parseInt(answer.rating || '0'))
      .sort((a, b) => a - b);
    const improvement = ((scores[scores.length - 1] - scores[0]) / scores[0]) * 100;
    return isFinite(improvement) ? Math.round(improvement) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl p-2 md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 tracking-tight">
              Hello, {user?.firstName || 'Interviewer'}
            </h1>
            <p className="text-gray-600 text-sm md:text-base font-medium bg-gray-100/50 px-3 py-1 rounded-full inline-block">
              {user?.primaryEmailAddress?.emailAddress || 'Not logged in'}
            </p>
          </div>
          <button
            onClick={() => setIsNewInterviewModalOpen(true)}
            className="relative group bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-full 
              hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg 
              hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <span className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 group-hover:animate-bounce" />
              New Interview
            </span>
            <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              whileHover={{ scale: 1.04, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative bg-white rounded-3xl p-6 shadow-md border border-gray-100 overflow-hidden group"
            >
              <div className="flex items-center gap-5 z-10 relative">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300`}>
                  <card.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
                    {card.value}
                  </p>
                </div>
              </div>
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 rounded-bl-full transition-opacity duration-300`}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Interview Starter Card */}
          <motion.div
            whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-md border border-gray-100 flex flex-col justify-between 
              bg-gradient-to-br from-indigo-50/30 via-white to-blue-50/30 transition-all duration-300"
          >
            <div>
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-4">
                Start Mock Interview
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Master your interview skills with AI-powered practice sessions tailored to your career path.
              </p>
            </div>
            <AddNewInterview
              isOpen={isNewInterviewModalOpen}
              onClose={() => setIsNewInterviewModalOpen(false)}
            />
          </motion.div>

          {/* Interview History */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  Interview History
                </h2>
                <button
                  onClick={fetchInterviewData}
                  className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium 
                    text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 transition-all duration-300 
                    shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                  )}
                  Refresh
                  <span className="absolute inset-0 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                </button>
              </div>

              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center py-20"
                >
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                </motion.div>
              ) : interviewList.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  <FileText className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <p className="text-gray-700 text-xl font-semibold">No Interviews Yet</p>
                  <p className="text-gray-500 mt-3 text-base">Create your first mock interview to begin your journey!</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {interviewList.map((interview, index) => (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
                    >
                      <InterviewItemCard interview={interview} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;