"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { PlusCircle, TrendingUp, Award } from 'lucide-react';

import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';

function Dashboard() {
  const { user } = useUser();
  const [interviewData, setInterviewData] = useState([]);
  const [isNewInterviewModalOpen, setIsNewInterviewModalOpen] = useState(false);
  const [statsCards, setStatsCards] = useState([
    { title: "Total Interviews", value: "0", icon: PlusCircle, gradient: "from-blue-500 to-blue-600" },
    { title: "Best Score", value: "N/A", icon: Award, gradient: "from-purple-500 to-purple-600" },
    { title: "Improvement Rate", value: "0%", icon: TrendingUp, gradient: "from-green-500 to-green-600" }
  ]);

  const fetchInterviews = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error("User email not found");
      return;
    }

    try {
      const response = await fetch('/api/fetchUserData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user.primaryEmailAddress.emailAddress })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch interview data');
      }

      const data = await response.json();
      const userSpecificInterviews = data.userAnswers.filter(
        interview => interview.userEmail === user.primaryEmailAddress.emailAddress
      );

      setInterviewData(userSpecificInterviews);

      const totalInterviews = userSpecificInterviews.length;
      const bestScore = totalInterviews > 0 
        ? Math.max(...userSpecificInterviews.map(item => parseInt(item.rating || '0')))
        : 0;
      const improvementRate = calculateImprovementRate(userSpecificInterviews);

      setStatsCards([
        { ...statsCards[0], value: totalInterviews.toString() },
        { ...statsCards[1], value: bestScore ? `${bestScore}/10` : 'N/A' },
        { ...statsCards[2], value: `${improvementRate}%` }
      ]);

      if (totalInterviews > 0) {
        toast.success(`Loaded ${totalInterviews} interview(s)`);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error(error.message || 'Failed to fetch interviews');
    }
  };

  const calculateImprovementRate = (interviews) => {
    if (interviews.length <= 1) return 0;
    const scores = interviews
      .map(interview => parseInt(interview.rating || '0'))
      .sort((a, b) => a - b);
    const improvement = ((scores[scores.length - 1] - scores[0]) / scores[0]) * 100;
    return Math.round(improvement);
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchInterviews();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome, {user?.firstName || 'Interviewer'}
            </h1>
            <p className="text-gray-600 text-sm">
              {user?.primaryEmailAddress?.emailAddress || 'Not logged in'}
            </p>
          </div>
          <button 
            onClick={() => setIsNewInterviewModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2.5 rounded-lg 
              hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-sm"
          >
            <PlusCircle className="w-4 h-4 inline mr-2" />
            New Interview
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all 
                border border-gray-100 group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${card.gradient} text-white`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                    {card.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interview Starter Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Start Mock Interview
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Practice your skills with AI-powered interviews tailored to your needs.
              </p>
              <AddNewInterview 
                isOpen={isNewInterviewModalOpen} 
                onClose={() => setIsNewInterviewModalOpen(false)} 
              />
            </div>
          </div>

          {/* Interview History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Interview History
              </h2>
              <InterviewList interviews={interviewData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;