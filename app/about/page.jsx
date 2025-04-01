"use client";
import { useState } from "react";
import {
  Users,
  Target,
  Award,
  Briefcase,
  BookOpen,
  Rocket,
  ChevronRight,
  Star,
  BarChart,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutUsPage = () => {
  const [activeTab, setActiveTab] = useState("mission");

  const tabContent = {
    mission: {
      icon: <Target className="h-7 w-7 text-white" />,
      title: "Our Mission",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            At ReMa.ai, we're on a mission to revolutionize interview preparation by delivering personalized, AI-driven coaching tailored to your unique career aspirations.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our goal is to bridge the gap between practice and success, empowering you to unlock your full potential and confidently step into your dream role.
          </p>
          <div className="mt-8 flex items-center justify-center sm:justify-start">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 w-12 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">{i}K+</span>
                </div>
              ))}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Professionals coached</p>
              <p className="text-sm text-gray-600">and counting</p>
            </div>
          </div>
        </div>
      ),
    },
    story: {
      icon: <BookOpen className="h-7 w-7 text-white" />,
      title: "Our Story",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            ReMa.ai was born from a personal journey—facing the challenges of interview prep as a solo developer. I set out to build a platform that simplifies the process and boosts confidence.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            This project is a testament to passion and innovation, evolving into a powerful tool that's helping professionals worldwide achieve career growth.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {["2025", "2025", "2025"].map((year, i) => (
              <div key={year} className="relative">
                <div className="h-1 bg-gradient-to-r from-blue-200 to-indigo-200 absolute top-4 w-full"></div>
                <div className={`h-8 w-8 rounded-full ${i === 2 ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gradient-to-r from-blue-200 to-indigo-300"} mx-auto relative z-10 flex items-center justify-center`}>
                  {i === 2 && <div className="h-3 w-3 bg-white rounded-full"></div>}
                </div>
                <p className="text-center mt-2 font-medium">{year}</p>
                <p className="text-xs text-center text-gray-600">
                  {i === 0 && "Founded"}
                  {i === 1 && "First 1K users"}
                  {i === 2 && "First 5K users"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    approach: {
      icon: <Rocket className="h-7 w-7 text-white" />,
      title: "Our Approach",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            We harness cutting-edge AI algorithms to craft dynamic, contextually relevant interview questions based on your professional background and goals.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            With real-time analysis and actionable feedback, ReMa.ai helps you refine your skills with every practice session, ensuring continuous improvement.
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Success Rate", value: "94%" },
              { label: "Questions", value: "10K+" },
              { label: "Industries", value: "25+" },
              { label: "Satisfaction", value: "4.9/5" },
            ].map((stat) => (
              <div key={stat.label} className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg">
                <p className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-2xl">{stat.value}</p>
                <p className="text-sm text-gray-700">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  };

  const coreValues = [
    {
      icon: <Star className="h-14 w-14 text-white" />,
      title: "Continuous Learning",
      description: "We're committed to evolving and delivering better tools for your growth.",
    },
    {
      icon: <Users className="h-14 w-14 text-white" />,
      title: "Empowerment",
      description: "Building your confidence to achieve professional success.",
    },
    {
      icon: <Shield className="h-14 w-14 text-white" />,
      title: "Excellence",
      description: "Crafting high-quality features to streamline your preparation.",
    },
  ];

  const testimonials = [
    {
      quote: "ReMa.ai transformed my interview preparation. I landed my dream job after just two weeks of practice!",
      name: "Sarah J.",
      role: "Software Engineer",
    },
    {
      quote: "The personalized feedback helped me identify and improve my weaknesses. Truly game-changing.",
      name: "Michael T.",
      role: "Product Manager",
    },
    {
      quote: "As a career switcher, I needed focused preparation. ReMa.ai delivered exactly what I needed.",
      name: "Priya K.",
      role: "Data Scientist",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
        <div className="inline-block p-2 px-4 bg-blue-100 rounded-full text-indigo-700 font-medium text-sm mb-6">
            Trusted by 1,000+ frehsers
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold nohemi tracking-tight mb-6">
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">ReMa.ai</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
            Empowering professionals to master interviews with intelligent, personalized AI coaching.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg shadow-lg text-lg font-medium transition-all duration-300"
            >
              <a href="/dashboard">Start Your Journey</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gradient-to-r  bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-lg shadow-sm text-lg font-medium transition-all duration-300"
            >
              <a href="#">View Plans</a>
            </Button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white shadow-xl rounded-3xl border border-gray-100 mb-20 overflow-hidden backdrop-blur-sm bg-white/90">
          <div className="flex flex-col sm:flex-row">
            {Object.keys(tabContent).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-6 px-8 flex items-center justify-center gap-3 transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                }`}
              >
                <div className={`${activeTab === tab ? "" : "bg-gradient-to-r from-blue-500 to-indigo-600"} p-2 rounded-full`}>
                  {tabContent[tab].icon}
                </div>
                <span className="text-lg nohemi">{tabContent[tab].title}</span>
              </button>
            ))}
          </div>
          <div className="p-10 min-h-64">
            {tabContent[activeTab].content}
          </div>
        </div>

        {/* Core Values Section */}
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-3xl shadow-xl border border-gray-100 p-10 mb-20">
          <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 nohemi">
            Our Core Values
          </h2>
          <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto mb-12">
            These principles guide everything we do to ensure we deliver exceptional value to our users.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-md border border-blue-100 hover:transform hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-6 p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-md w-20 h-20 mx-auto">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-center mb-4 nohemi transition-colors duration-200">
                  {value.title}
                </h3>
                <p className="text-gray-700 text-center text-lg leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 nohemi">
            What Our Users Say
          </h2>
          <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto mb-12">
            Join thousands of professionals who've transformed their careers with ReMa.ai.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg border border-gray-100 relative"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  "
                </div>
                <p className="text-gray-700 mb-6 relative z-10">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-3xl shadow-xl p-12 text-center">
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles className="h-20 w-20 text-white" />
          </div>
          <h3 className="text-3xl font-bold nohemi text-white mb-4">
            Ready to Ace Your Next Interview?
          </h3>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of professionals who've already transformed their interview skills with ReMa.ai.
          </p>
          <Button
            asChild
            className="bg-white hover:bg-blue-50  bg-clip-text px-8 py-6 rounded-lg shadow-lg text-lg font-bold transition-all duration-300"
          >
            <a href="/dashboard">Start Your Free Trial Today</a>
          </Button>
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center text-blue-100 gap-2 sm:gap-0">
            <p>No credit card required</p>
            <span className="hidden sm:block mx-2">•</span>
            <p>14-day free trial</p>
            <span className="hidden sm:block mx-2">•</span>
            <p>Cancel anytime</p>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl nohemi font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Have Questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Find answers to commonly asked questions about ReMa.ai.
          </p>
          <Button
            asChild
            variant="outline"
            className="border-blue-200 hover:border-indigo-300  text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 inline-flex items-center gap-2"
          >
            <a href="/docs">
              Visit our Docs
              <ChevronRight className="h-4 w-4 text-indigo-600" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;