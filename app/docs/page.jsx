"use client";

import React, { useState, useEffect } from "react";
import { Search, X, ChevronDown, ChevronRight, ArrowRight, ExternalLink, Menu, Code, BookOpen, FileText, HelpCircle, Home } from "lucide-react";

const DocumentationPage = () => {
  const [activeTab, setActiveTab] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // Documentation content data
  const documentationData = {
    "getting-started": {
      title: "Getting Started",
      content: [
        {
          title: "Sign Up or Log In",
          description: "Create an account or log in using Clerk authentication.",
          keywords: ["sign up", "login", "account", "authentication", "clerk"]
        },
        {
          title: "Configure Your Profile",
          description: "Set up your profile with career goals and experience level.",
          keywords: ["profile", "configuration", "setup", "preferences"]
        },
        {
          title: "Start Your First Interview",
          description: "Choose an interview type and begin practicing.",
          keywords: ["interview", "start", "practice", "begin"]
        }
      ]
    },
    "features": {
      title: "Features",
      content: [
        {
          title: "User Authentication",
          description: "Secure authentication system using Clerk.",
          keywords: ["authentication", "security", "clerk", "login"]
        },
        {
          title: "Interview Customization",
          description: "Configure interviews with various parameters.",
          keywords: ["customize", "settings", "parameters", "options"]
        },
        {
          title: "AI Question Generation",
          description: "Gemini-powered algorithm for interview questions.",
          keywords: ["AI", "questions", "generation", "gemini"]
        },
        {
          title: "Analysis Engine",
          description: "Real-time feedback system with actionable insights.",
          keywords: ["analysis", "feedback", "insights", "evaluation"]
        }
      ]
    },
    "guides": {
      title: "User Guides",
      content: [
        {
          title: "Preparing for Technical Interviews",
          description: "Practice coding interviews with our platform.",
          keywords: ["technical", "coding", "practice", "preparation"]
        },
        {
          title: "Mastering Behavioral Questions",
          description: "Techniques for behavioral questions.",
          keywords: ["behavioral", "questions", "techniques", "stories"]
        },
        {
          title: "Analyzing Your Performance",
          description: "Interpret feedback and improve based on analysis.",
          keywords: ["performance", "analysis", "feedback", "improve"]
        },
        {
          title: "Interview Customization",
          description: "Creating specialized interview scenarios.",
          keywords: ["customization", "scenarios", "specialized", "specific"]
        }
      ]
    },
    "api": {
      title: "API Reference",
      content: [
        {
          title: "Authentication",
          description: "API authentication with API keys.",
          keywords: ["API", "authentication", "keys", "headers"]
        },
        {
          title: "Endpoints",
          description: "Available API endpoints and methods.",
          keywords: ["endpoints", "API", "methods", "requests"]
        }
      ]
    },
    "faqs": {
      title: "FAQs",
      content: [
        {
          title: "How accurate is the AI feedback?",
          description: "Our AI analysis engine has been trained on thousands of real interview responses.",
          keywords: ["accuracy", "AI", "feedback", "training"]
        },
        {
          title: "Can I use ReMa.ai for company-specific preparation?",
          description: "Yes! You can customize interview scenarios for specific companies.",
          keywords: ["company-specific", "customize", "preparation"]
        },
        {
          title: "Is there a limit to how many interviews I can practice?",
          description: "Free accounts get 5 interviews per month. Premium is unlimited.",
          keywords: ["limit", "interviews", "free", "premium"]
        },
        {
          title: "How do I export my interview results?",
          description: "From your dashboard, select any completed interview and click Export.",
          keywords: ["export", "results", "download", "PDF", "JSON"]
        }
      ]
    }
  };
  
  // Function to handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    // Search through all documentation data
    const results = [];
    Object.keys(documentationData).forEach(section => {
      documentationData[section].content.forEach(item => {
        // Search in title, description and keywords
        if (
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
        ) {
          results.push({
            section,
            sectionTitle: documentationData[section].title,
            ...item
          });
        }
      });
    });
    
    setSearchResults(results);
    setShowSearchResults(true);
  };
  
  // Function to handle search result click
  const handleSearchResultClick = (section) => {
    setActiveTab(section);
    setShowSearchResults(false);
    setSearchQuery("");
  };
  
  // Click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearchResults && !event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchResults]);
  
  const sidebarLinks = [
    { id: "getting-started", label: "Getting Started", icon: <Home size={18} /> },
    { id: "features", label: "Features", icon: <FileText size={18} /> },
    { id: "guides", label: "User Guides", icon: <BookOpen size={18} /> },
    { id: "api", label: "API Reference", icon: <Code size={18} /> },
    { id: "faqs", label: "FAQs", icon: <HelpCircle size={18} /> }
  ];
  
  const features = [
    {
      title: "User Authentication",
      description: "Our secure authentication system uses Clerk to manage user accounts, profiles, and progress tracking.",
      code: `// Example: Accessing user data
import { useAuth } from '@clerk/nextjs';

function ProfileComponent() {
  const { userId, sessionId, getToken } = useAuth();
  // ...
}`
    },
    {
      title: "Interview Customization",
      description: "Configure interviews with various parameters to tailor the experience to your needs.",
      code: `// Example: Setting up interview options
const interviewOptions = {
  type: "technical", // "technical", "behavioral", "mixed"
  difficulty: "intermediate", // "beginner", "intermediate", "advanced"
  duration: 30, // in minutes
  topics: ["react", "javascript", "algorithms"]
};`
    },
    {
      title: "AI Question Generation",
      description: "Our Gemini-powered algorithm creates contextually relevant interview questions.",
      code: `// Example: Fetching dynamic questions
async function getNextQuestion(interviewId, previousAnswers) {
  const response = await fetch('/api/questions/generate', {
    method: 'POST',
    body: JSON.stringify({ interviewId, previousAnswers })
  });
  return response.json();
}`
    },
    {
      title: "Analysis Engine",
      description: "Real-time feedback system that evaluates responses and provides actionable insights.",
      code: `// Example: Getting response analysis
async function analyzeAnswer(questionId, answer) {
  const analysis = await fetch('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ questionId, answer })
  });
  return analysis.json();
}`
    }
  ];
  
  const renderContent = () => {
    switch(activeTab) {
      case "getting-started":
        return (
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Home className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 nohemi">Getting Started with ReMa.ai</h2>
            </div>
            <p className="mb-8 text-gray-700 text-lg">ReMa.ai is an interview preparation platform that uses artificial intelligence to simulate realistic interview experiences. Follow these steps to begin your interview preparation journey:</p>
            
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Sign Up or Log In",
                  description: "Create an account or log in using Clerk authentication. This allows us to save your progress and customize your experience.",
                  code: `// Authentication endpoint
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}`
                },
                {
                  step: 2,
                  title: "Configure Your Profile",
                  description: "Set up your profile with your career goals, experience level, and target positions to receive tailored interview questions.",
                  code: `// Profile configuration
PATCH /api/user/profile
{
  "experienceLevel": "mid-level",
  "targetPosition": "Frontend Developer",
  "targetIndustries": ["tech", "finance"],
  "preferredLanguages": ["javascript", "typescript"]
}`
                },
                {
                  step: 3,
                  title: "Start Your First Interview",
                  description: "Choose an interview type and difficulty level, then begin practicing with AI-generated questions.",
                  code: `// Create a new interview session
POST /api/interviews
{
  "type": "technical",
  "difficulty": "intermediate",
  "duration": 30,
  "focusAreas": ["react", "state-management"]
}`
                }
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex">
                    {/* Step number circle */}
                    <div className="bg-indigo-600 text-white flex items-center justify-center w-16 text-xl font-bold">
                      {item.step}
                    </div>
                    <div className="p-6 flex-1">
                      <h3 className="text-xl font-semibold nohemi text-gray-800">{item.title}</h3>
                      <p className="my-3 text-gray-600">{item.description}</p>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-x-auto">
                        <pre className="text-sm text-gray-700 font-mono">{item.code}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2 nohemi">Ready to begin?</h3>
              <p className="text-indigo-700 mb-4">Start your interview preparation journey today with ReMa.ai</p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium transition-colors flex items-center">
                Start your first interview <ArrowRight className="ml-2" size={18} />
              </button>
            </div>
          </div>
        );
      
      case "features":
        return (
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <FileText className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 nohemi">Features and API Reference</h2>
            </div>
            <p className="mb-8 text-gray-700 text-lg">ReMa.ai offers several powerful features to enhance your interview preparation. Here's a detailed overview of each feature and its implementation.</p>
            
            <div className="grid grid-cols-1 gap-8">
              {features.map((feature, index) => (
                <div key={feature.title} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white h-10 w-10 rounded-full flex items-center justify-center font-bold mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold nohemi text-gray-800">{feature.title}</h3>
                        <p className="mt-2 text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 overflow-x-auto">
                    <pre className="text-sm text-gray-700 font-mono">{feature.code}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "guides":
        return (
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <BookOpen className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 nohemi">User Guides</h2>
            </div>
            <p className="mb-8 text-gray-700 text-lg">Learn how to get the most out of ReMa.ai with these comprehensive guides.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Preparing for Technical Interviews",
                  description: "A step-by-step guide to practicing coding interviews with our platform.",
                  link: "/guides/technical-interviews",
                  icon: <Code size={20} />
                },
                {
                  title: "Mastering Behavioral Questions",
                  description: "Techniques for structuring compelling stories and answers to common behavioral questions.",
                  link: "/guides/behavioral-questions",
                  icon: <FileText size={20} />
                },
                {
                  title: "Analyzing Your Performance",
                  description: "How to interpret feedback and improve based on the AI analysis.",
                  link: "/guides/performance-analysis",
                  icon: <FileText size={20} />
                },
                {
                  title: "Interview Customization",
                  description: "Creating specialized interview scenarios for specific roles or companies.",
                  link: "/guides/custom-scenarios",
                  icon: <FileText size={20} />
                }
              ].map((guide) => (
                <div key={guide.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-4">
                      {guide.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg nohemi">{guide.title}</h3>
                      <p className="text-gray-600 mt-2 mb-4">{guide.description}</p>
                      <a href={guide.link} className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center mt-2 transition-colors">
                        Read guide <ArrowRight className="ml-1" size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      
      case "faqs":
        return (
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <HelpCircle className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 nohemi">Frequently Asked Questions</h2>
            </div>
            <p className="mb-8 text-gray-700 text-lg">Find answers to common questions about ReMa.ai.</p>
            
            <div className="space-y-4">
              {[
                {
                  question: "How accurate is the AI feedback?",
                  answer: "Our AI analysis engine has been trained on thousands of real interview responses and calibrated with input from hiring managers across various industries. While no AI system is perfect, our feedback accuracy rates consistently above 85% when compared with human evaluators."
                },
                {
                  question: "Can I use ReMa.ai for company-specific preparation?",
                  answer: "Yes! You can customize your interview scenarios to target specific companies. Our system will generate questions that align with known interview patterns for major tech companies and adapt the feedback criteria accordingly."
                },
                {
                  question: "Is there a limit to how many interviews I can practice?",
                  answer: "Free accounts can practice up to 5 interviews per month. Premium subscribers have unlimited access to all interview types and features."
                },
                {
                  question: "How do I export my interview results?",
                  answer: "From your dashboard, select any completed interview and click the 'Export' button. You can download your results as PDF or JSON formats, which include all questions, your answers, and the AI feedback."
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button 
                    className="flex justify-between items-center w-full px-6 py-4 text-left"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <h3 className="font-medium text-gray-800 text-lg nohemi">{item.question}</h3>
                    {expandedFaq === index ? 
                      <ChevronDown className="w-5 h-5 text-indigo-500" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    }
                  </button>
                  <div className={`px-6 py-4 border-t text-gray-600 ${expandedFaq === index ? 'block' : 'hidden'}`}>
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Still have questions?</h3>
              <p className="text-indigo-700 mb-4">Our support team is ready to help you with any additional questions.</p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        );
        
      default:
        return <div>Select a topic from the sidebar</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-4 text-gray-500 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <a href="/" className="flex items-center">
              <span className="font-bold text-xl nohemi text-indigo-600">ReMa<span className="text-gray-800">.ai</span></span>
              <div className="bg-indigo-100 text-indigo-800 text-xs font-medium mx-2 px-3 py-1 rounded-full">Docs</div>
            </a>
          </div>
          
          <div className="flex items-center">
            <div className="relative search-container mr-4">
              <input 
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto border border-gray-200">
                  <div className="flex justify-between items-center p-3 border-b">
                    <span className="text-xs font-medium text-gray-500">
                      {searchResults.length} results
                    </span>
                    <button 
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery("");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <button
                        key={index}
                        className="block w-full text-left p-3  hover:bg-indigo-50 border-b border-gray-100"
                        onClick={() => handleSearchResultClick(result.section)}
                      >
                        <p className="font-medium text-gray-800 nohemi">{result.title}</p>
                        <p className="text-gray-500 mt-1 text-sm">{result.description}</p>
                        <div className="flex items-center mt-2">
                          <div className="bg-indigo-100 text-indigo-800 text-xs rounded px-2 py-1">
                            {result.sectionTitle}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
            
           
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-800 bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-xl text-indigo-600">ReMa.ai</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>
            <nav>
              <ul className="space-y-1">
                {sidebarLinks.map((link) => (
                  <li key={link.id}>
                    <button 
                      onClick={() => {
                        setActiveTab(link.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-3 rounded-md flex items-center transition-all ${
                        activeTab === link.id 
                          ? 'bg-indigo-100 text-indigo-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 flex-grow flex flex-col md:flex-row">
        {/* Sidebar - Desktop */}
        <div className="w-64 pr-8 hidden md:block">
          <div className="bg-white p-5 rounded-lg border border-gray-200 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4 text-lg nohemi">Documentation</h2>
            <nav>
              <ul className="space-y-1">
                {sidebarLinks.map((link) => (
                  <li key={link.id}>
                    <button 
                      onClick={() => setActiveTab(link.id)}
                      className={`w-full text-left px-3 py-2 nohemi rounded-md flex items-center transition-all ${
                        activeTab === link.id 
                          ? 'bg-indigo-100 text-indigo-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-3 nohemi">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                    <ExternalLink size={14} className="mr-2" /> GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                    <ExternalLink size={14} className="mr-2" /> Support Forums
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                    <ExternalLink size={14} className="mr-2" /> Community Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
          {renderContent()}
        </div>
      </div>
    
    </div>
  );
};

export default DocumentationPage;