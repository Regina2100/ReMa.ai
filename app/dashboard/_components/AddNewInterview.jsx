"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle, Sparkles, Wand2 } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Job Role Suggestions
const JOB_ROLE_SUGGESTIONS = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Cloud Engineer',
  'Mobile App Developer',
  'UI/UX Designer'
];

// Tech Stack Suggestions
const TECH_STACK_SUGGESTIONS = {
  'Full Stack Developer': 'React, Node.js, Express, MongoDB, TypeScript',
  'Frontend Developer': 'React, Vue.js, Angular, TypeScript, Tailwind CSS',
  'Backend Developer': 'Python, Django, Flask, Java Spring, PostgreSQL',
  'Software Engineer': 'Java, C++, Python, AWS, Microservices',
  'DevOps Engineer': 'Docker, Kubernetes, Jenkins, AWS, Azure',
  'Data Scientist': 'Python, TensorFlow, PyTorch, Pandas, NumPy',
  'Machine Learning Engineer': 'Python, scikit-learn, Keras, TensorFlow',
  'Cloud Engineer': 'AWS, Azure, GCP, Terraform, Kubernetes',
  'Mobile App Developer': 'React Native, Flutter, Swift, Kotlin',
  'UI/UX Designer': 'Figma, Sketch, Adobe XD, InVision'
};

function AddNewInterview({ isOpen, onClose }) {
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  // Auto-suggest tech stack based on job role
  const autoSuggestTechStack = (role) => {
    const suggestion = TECH_STACK_SUGGESTIONS[role];
    if (suggestion) {
      setJobDescription(suggestion);
      toast.info(`Suggested tech stack for ${role}`);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const inputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}.
    Generate 5 interview questions and answers in JSON format.`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();
      const cleanedResponse = responseText.replace(/```json\n?|```/g, '').trim();
      const mockResponse = JSON.parse(cleanedResponse);

      const res = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(mockResponse),
          jobPosition: jobPosition,
          jobDesc: jobDescription,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY'),
        }).returning({ mockId: MockInterview.mockId });

      toast.success('Interview created successfully!');
      router.push(`dashboard/interview/${res[0]?.mockId}`);
      onClose();
    } catch (error) {
      console.error("Error generating interview:", error);
      toast.error('Failed to create interview.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setJobPosition("");
    setJobDescription("");
    setJobExperience("");
  };

  return (
    <div>
      <button
        onClick={() => { setOpenDialog(true); resetForm(); }}
        className="w-full p-6 border rounded-xl bg-white hover:bg-gray-50 
          shadow-sm hover:shadow-md transition-all duration-200 group"
      >
        <div className="flex items-center justify-center gap-2">
          <Wand2 className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-gray-900 group-hover:text-indigo-600">
            Create New Interview
          </span>
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-xl sm:max-w-2xl p-6 bg-white rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              New AI Mock Interview
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Fill in the details to generate your personalized interview questions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Job Role/Position
              </label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="e.g., Full Stack Developer"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  list="jobRoles"
                  required
                  className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 
                    rounded-lg transition-all"
                />
                <datalist id="jobRoles">
                  {JOB_ROLE_SUGGESTIONS.map(role => (
                    <option key={role} value={role} />
                  ))}
                </datalist>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => autoSuggestTechStack(jobPosition)}
                  disabled={!jobPosition}
                  className="hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Job Description/Tech Stack
              </label>
              <Textarea
                placeholder="e.g., React, Node.js, MongoDB"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
                className="min-h-[100px] border-gray-200 focus:ring-indigo-500 
                  focus:border-indigo-500 rounded-lg transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <Input
                placeholder="e.g., 5"
                type="number"
                min="0"
                max="70"
                value={jobExperience}
                onChange={(e) => setJobExperience(e.target.value)}
                required
                className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 
                  rounded-lg transition-all"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="hover:bg-gray-100 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white 
                  transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Interview
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;