"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";
import { Trash, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onStart = () => {
    router.push(`/dashboard/interview/${interview?.mockId}`);
  };

  const onFeedbackPress = () => {
    router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
  };

  const onDelete = async () => {
    try {
      await db.delete(MockInterview).where(eq(MockInterview.mockId, interview?.mockId));
      setIsDialogOpen(false);
      toast.success("Interview deleted successfully", { duration: 3000 });
      router.refresh();
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview", { description: error.message });
    }
  };

  return (
    <div className="relative bg-white border border-gray-100 shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow duration-200">
      {/* Delete Button */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full w-8 h-8"
        onClick={() => setIsDialogOpen(true)}
      >
        <Trash className="h-4 w-4" />
      </Button>

      {/* Card Content */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          {interview?.jobPosition}
        </h2>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Experience:</span> {interview?.jobExperience} Year(s)
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Created:</span> {interview?.createdAt}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <Button
          size="sm"
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
          onClick={onFeedbackPress}
        >
          Feedback
        </Button>
        <Button
          size="sm"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200"
          onClick={onStart}
        >
          Start
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 transform transition-all duration-200 scale-100">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-bold text-gray-900">Delete Interview</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this interview? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                onClick={onDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewItemCard;