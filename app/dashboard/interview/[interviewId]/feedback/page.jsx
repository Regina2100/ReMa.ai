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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
    if (numRating >= 8) return "text-green-500";
    if (numRating >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  const getRatingBgColor = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 8) return "bg-green-50 border-green-200";
    if (numRating >= 5) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center space= space-y-4">
          <Activity className="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
          <p className="text-lg text-gray-600">Analyzing your performance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        {feedbackList.length === 0 ? (
          <Card className="bg-white shadow-lg rounded-2xl border border-gray-100">
            <CardHeader className="text-center">
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="text-3xl font-bold text-gray-900 mt-4">
                No Feedback Available
              </h2>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                It looks like your interview feedback isn’t ready yet. Try again later or start a new session.
              </p>
              <Button
                onClick={() => router.replace("/dashboard")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200"
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Card */}
            <Card className="bg-white shadow-lg rounded-2xl border border-gray-100 mb-10">
              <CardHeader className="flex flex-col sm:flex-row items-center gap-6">
                <CheckCircle2 className="h-14 w-14 text-green-500" />
                <div className="text-center sm:text-left">
                  <h2 className="text-3xl font-bold text-gray-900">Interview Complete!</h2>
                  <p className="text-gray-600 mt-1">Here’s how you did</p>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Average Rating</p>
                  <p className={`text-4xl font-bold ${getRatingColor(averageRating)}`}>
                    {averageRating}/10
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Questions Answered</p>
                  <p className="text-4xl font-bold text-indigo-600">{feedbackList.length}</p>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Details */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-900">Detailed Feedback</h3>
                <p className="text-gray-600 mt-2">
                  Review your answers and see how to improve
                </p>
              </div>

              {feedbackList.map((item, index) => (
                <Collapsible
                  key={index}
                  open={openCollapsible === index}
                  onOpenChange={() => setOpenCollapsible(openCollapsible === index ? null : index)}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-200"
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center gap-4">
                        <Star className={`h-6 w-6 ${getRatingColor(item.rating)}`} />
                        <span className="text-lg font-medium text-gray-900 line-clamp-1">
                          {item.question}
                        </span>
                      </div>
                      {openCollapsible === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-6 bg-white">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Answer</h4>
                        <p className="bg-gray-50 p-4 rounded-xl text-sm text-gray-800 border border-gray-200">
                          {item.userAns || "No answer provided"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Expected Answer</h4>
                        <p className="bg-green-50 p-4 rounded-xl text-sm text-green-800 border border-green-200">
                          {item.correctAns || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Feedback</h4>
                      <p className={`${getRatingBgColor(item.rating)} p-4 rounded-xl text-sm text-gray-800`}>
                        {item.feedback}
                      </p>
                    </div>
                    <div className="mt-4 text-right">
                      <span className={`text-lg font-bold ${getRatingColor(item.rating)}`}>
                        Rating: {item.rating}/10
                      </span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>

            {/* Return Button */}
            <div className="text-center mt-10">
              <Button
                onClick={() => router.replace("/dashboard")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg shadow-md transition-all duration-200"
              >
                Back to Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Feedback;