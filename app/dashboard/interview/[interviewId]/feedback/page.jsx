"use client";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Activity,
  Star,
  BarChart2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Feedback = ({ params }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCollapsible, setOpenCollapsible] = useState(null);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);

      setFeedbackList(result);

      const validRatings = result
        .map((item) => parseFloat(item.rating))
        .filter((rating) => !isNaN(rating));
      const totalRating = validRatings.reduce((sum, rating) => sum + rating, 0);
      const avgRating =
        validRatings.length > 0 ? (totalRating / validRatings.length).toFixed(1) : "N/A";

      setAverageRating(avgRating);
    } catch (error) {
      console.error("Feedback fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 8) return "text-green-600";
    if (numRating >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingBgColor = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 8) return "bg-green-50 border-green-100";
    if (numRating >= 5) return "bg-yellow-50 border-yellow-100";
    return "bg-red-50 border-red-100";
  };

  const getRatingCategory = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 8) return "Exceptional";
    if (numRating >= 6.5) return "Strong";
    if (numRating >= 5) return "Fair";
    return "Needs Work";
  };

  const getPerformanceInsight = (avgRating) => {
    const numRating = parseFloat(avgRating);
    if (numRating >= 8) return "Outstanding performance! You showcased deep expertise and clarity.";
    if (numRating >= 6.5) return "Solid effort! Polish your responses to stand out even more.";
    if (numRating >= 5) return "Good start! Focus on depth and structure for better results.";
    return "More practice needed. Strengthen your core concepts and delivery.";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 px-6 max-w-md"
        >
          <div className="relative mx-auto w-28 h-28">
            <Activity className="absolute inset-0 w-full h-full text-indigo-600 animate-spin" />
            <motion.div
              className="absolute inset-0 w-full h-full border-4 border-indigo-200 rounded-full"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Analyzing Your Performance</h3>
          <p className="text-gray-600 text-lg">Generating detailed insights from your interview...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-16 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {feedbackList.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white shadow-2xl rounded-3xl border-0 overflow-hidden">
              <CardHeader className="text-center pb-0 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full opacity-50"></div>
                <div className="mx-auto bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Feedback Not Available</h2>
              </CardHeader>
              <CardContent className="text-center space-y-4 pt-4">
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  It seems your interview hasn’t been completed or processed yet.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pb-8">
                <Button
                  onClick={() => router.replace("/dashboard")}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-10 py-3 rounded-full shadow-lg transition-all duration-300 text-lg"
                >
                  Back to Dashboard
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            {/* Summary Card */}
            <Card className="bg-white shadow-2xl rounded-3xl border-0 overflow-hidden relative">
              <div className="absolute right-0 top-0 h-32 w-32 bg-indigo-100 rounded-bl-full opacity-50"></div>
              <CardHeader className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-6 mb-6"
                >
                  <div className="bg-green-50 p-4 rounded-full shadow-sm">
                    <CheckCircle2 className="h-14 w-14 text-green-600" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 tracking-tight">
                      Interview Feedback
                    </h2>
                    <p className="text-gray-600 text-lg mt-1">Your Performance Overview</p>
                  </div>
                </motion.div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>
              </CardHeader>
              <CardContent className="px-8 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="col-span-1"
                  >
                    <div className="bg-gray-50 rounded-3xl p-8 text-center h-full flex flex-col justify-between shadow-md">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Overall Rating</p>
                        <div className="mt-3 flex justify-center items-baseline">
                          <span className={cn("text-6xl font-extrabold", getRatingColor(averageRating))}>
                            {averageRating}
                          </span>
                          <span className="text-2xl text-gray-400 ml-2">/10</span>
                        </div>
                        <Badge className={cn(
                          "mt-3 px-4 py-1 rounded-full text-sm font-semibold",
                          parseFloat(averageRating) >= 8 ? "bg-green-100 text-green-800" :
                          parseFloat(averageRating) >= 6.5 ? "bg-blue-100 text-blue-800" :
                          parseFloat(averageRating) >= 5 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        )}>
                          {getRatingCategory(averageRating)}
                        </Badge>
                      </div>
                      <Progress 
                        value={parseFloat(averageRating) * 10} 
                        className="h-3 mt-6"
                        indicatorClassName={cn(
                          parseFloat(averageRating) >= 8 ? "bg-green-600" :
                          parseFloat(averageRating) >= 5 ? "bg-yellow-600" :
                          "bg-red-600"
                        )}
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="col-span-1 lg:col-span-2"
                  >
                    <div className="bg-gray-50 rounded-3xl p-8 h-full shadow-md">
                      <div className="flex items-center gap-3 mb-4">
                        <BarChart2 className="h-6 w-6 text-indigo-600" />
                        <h4 className="text-lg font-semibold text-gray-900">Performance Insight</h4>
                      </div>
                      <p className="text-gray-700 text-base leading-relaxed">{getPerformanceInsight(averageRating)}</p>
                      <div className="mt-6 grid grid-cols-2 gap-6">
                        {[
                          { icon: Clock, color: "blue", label: "Questions", value: feedbackList.length },
                          { icon: Star, color: "purple", label: "Best Score", value: `${Math.max(...feedbackList.map(item => parseFloat(item.rating) || 0)).toFixed(1)}/10` }
                        ].map((stat, idx) => (
                          <div key={idx} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                            <div className={`bg-${stat.color}-50 p-3 rounded-full`}>
                              <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{stat.label}</p>
                              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 tracking-tight">
                  Detailed Analysis
                </h3>
                <p className="text-gray-600 text-lg mt-3 max-w-lg mx-auto">
                  Dive into your responses and actionable feedback
                </p>
              </div>

              {feedbackList.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Collapsible
                    open={openCollapsible === index}
                    onOpenChange={() => setOpenCollapsible(openCollapsible === index ? null : index)}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center gap-5">
                          <div className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-full shadow-sm",
                            parseFloat(item.rating) >= 8 ? "bg-green-50" :
                            parseFloat(item.rating) >= 5 ? "bg-yellow-50" :
                            "bg-red-50"
                          )}>
                            <Star className={`h-6 w-6 ${getRatingColor(item.rating)}`} />
                          </div>
                          <div className="flex flex-col text-left max-w-md">
                            <span className="text-xl font-semibold text-gray-900 line-clamp-1">
                              Question {index + 1}
                            </span>
                            <span className="text-base text-gray-600 line-clamp-1">
                              {item.question}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className={`text-xl font-bold ${getRatingColor(item.rating)}`}>
                            {item.rating}/10
                          </span>
                          {openCollapsible === index ? (
                            <ChevronUp className="h-6 w-6 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-6 w-6 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-0">
                      <div className="border-t border-gray-100">
                        <div className="p-6 bg-gray-50">
                          <p className="text-gray-900 text-lg font-semibold mb-2">Question:</p>
                          <p className="text-gray-700 text-base leading-relaxed">{item.question}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 p-6">
                          <div>
                            <h4 className="flex items-center gap-3 text-base font-semibold text-gray-800 mb-4">
                              <div className="bg-indigo-50 p-2 rounded-full shadow-sm">
                                <div className="w-5 h-5 bg-indigo-600 rounded-full"></div>
                              </div>
                              Your Response
                            </h4>
                            <div className="bg-white p-5 rounded-2xl text-base text-gray-800 border border-gray-200 shadow-md h-full">
                              {item.userAns || "No response provided"}
                            </div>
                          </div>
                          <div>
                            <h4 className="flex items-center gap-3 text-base font-semibold text-gray-800 mb-4">
                              <div className="bg-green-50 p-2 rounded-full shadow-sm">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              </div>
                              Expected Response
                            </h4>
                            <div className="bg-green-50 p-5 rounded-2xl text-base text-green-800 border border-green-200 shadow-md h-full">
                              {item.correctAns || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="px-6 pb-6 mt-10">
                          <h4 className="flex items-center gap-3 text-base font-semibold text-gray-800 mb-4">
                            <div className={cn(
                              "p-2 rounded-full shadow-sm",
                              parseFloat(item.rating) >= 8 ? "bg-green-50" :
                              parseFloat(item.rating) >= 5 ? "bg-yellow-50" :
                              "bg-red-50"
                            )}>
                              <Star className={`h-5 w-5 ${getRatingColor(item.rating)}`} />
                            </div>
                            Feedback & Tips
                          </h4>
                          <div className={cn(
                            "p-5 rounded-2xl text-base text-gray-800 shadow-md",
                            getRatingBgColor(item.rating)
                          )}>
                            {item.feedback}
                          </div>
                          <div className="mt-6 flex justify-between items-center">
                            <Badge className={cn(
                              "px-4 py-1.5 rounded-full text-sm font-semibold",
                              parseFloat(item.rating) >= 8 ? "bg-green-100 text-green-800" :
                              parseFloat(item.rating) >= 6.5 ? "bg-blue-100 text-blue-800" :
                              parseFloat(item.rating) >= 5 ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            )}>
                              {getRatingCategory(item.rating)}
                            </Badge>
                            <span className={`text-xl font-bold ${getRatingColor(item.rating)}`}>
                              {item.rating}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              ))}
            </motion.div>

            {/* Return Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-center mt-12 mb-8"
            >
              <Button
                onClick={() => router.replace("/dashboard")}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-10 py-4 rounded-full shadow-xl transition-all duration-300 flex items-center gap-3 text-lg font-semibold"
              >
                Return to Dashboard
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feedback;