'use client'
import React, { useState, useEffect } from 'react'
import { 
  Book, 
  Code, 
  PenTool, 
  Target, 
  FileText, 
  Globe, 
  Award, 
  Brain,
  ArrowRight,
  Search,
  BookOpen,
  CheckCircle,
  Filter,
  Star
} from 'lucide-react'
import Link from 'next/link'
import HeroSection from './dashboard/_components/HeroSection'

const ResourceCard = ({ icon, title, description, links, featured = false }) => (
  <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 flex flex-col h-full border ${featured ? 'border-indigo-200' : 'border-transparent'}`}>
    {featured && (
      <div className="absolute -top-3 -right-3">
        <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </div>
      </div>
    )}
    <div className="flex items-center mb-4">
      <div className="p-2 rounded-lg bg-indigo-50">
        {icon}
      </div>
      <h3 className="ml-4 text-xl font-semibold nohemi text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4 flex-grow">{description}</p>
    <div className="space-y-3">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-md hover:bg-indigo-50"
        >
          <div className="w-8 text-gray-400 group-hover:text-indigo-500">{index + 1}</div>
          <span className="font-medium">{link.name}</span>
          <ArrowRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      ))}
    </div>
  </div>
)

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('tech')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleResources, setVisibleResources] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const resourceCategories = {
    tech: {
      icon: <Code className="w-10 h-10 text-indigo-600" />,
      title: "Technical Resources",
      description: "Practice coding problems, algorithms, and prepare for technical interviews",
      resources: [
        {
          title: "Coding Platforms",
          description: "Practice coding and algorithmic problem-solving",
          icon: <Code className="w-8 h-8 text-indigo-600" />,
          featured: true,
          links: [
            { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/" },
            { name: "LeetCode", url: "https://leetcode.com/" },
            { name: "HackerRank", url: "https://www.hackerrank.com/" },
            { name: "CodeChef", url: "https://www.codechef.com/" }
          ]
        },
        {
          title: "Technical Interview Preparation",
          description: "Resources for system design and technical interviews",
          icon: <Target className="w-8 h-8 text-indigo-600" />,
          links: [
            { name: "InterviewBit", url: "https://www.interviewbit.com/" },
            { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
            { name: "Pramp", url: "https://www.pramp.com/" }
          ]
        }
      ]
    },
    aptitude: {
      icon: <Brain className="w-10 h-10 text-indigo-600" />,
      title: "Aptitude & Reasoning",
      description: "Boost your logical thinking and quantitative skills for placement tests",
      resources: [
        {
          title: "Aptitude & Reasoning",
          description: "Practice quantitative and logical reasoning skills",
          icon: <PenTool className="w-8 h-8 text-indigo-600" />,
          links: [
            { name: "IndiaBix", url: "https://www.indiabix.com/" },
            { name: "Freshersworld Aptitude", url: "https://www.freshersworld.com/aptitude-questions" },
            { name: "MathsGuru Reasoning", url: "https://www.mathsguru.com/reasoning-questions/" }
          ]
        },
        {
          title: "Competitive Exam Prep",
          description: "Resources for competitive and placement exams",
          icon: <Award className="w-8 h-8 text-indigo-600" />,
          featured: true,
          links: [
            { name: "GATE Overflow", url: "https://gateoverflow.in/" },
            { name: "Career Power", url: "https://careerpower.in/" },
            { name: "Brilliant.org", url: "https://brilliant.org/" }
          ]
        }
      ]
    },
    interview: {
      icon: <FileText className="w-10 h-10 text-indigo-600" />,
      title: "Interview Excellence",
      description: "Perfect your interview skills and stand out from the competition",
      resources: [
        {
          title: "Interview Guides",
          description: "Comprehensive interview preparation resources",
          icon: <Book className="w-8 h-8 text-indigo-600" />,
          links: [
            { name: "Insider Tips", url: "https://www.ambitionbox.com/" },
            { name: "InterviewStreet", url: "https://www.interviewstreet.com/" },
            { name: "Career Guidance", url: "https://www.shiksha.com/" }
          ]
        },
        {
          title: "Global Learning Platforms",
          description: "Online courses and learning resources",
          icon: <Globe className="w-8 h-8 text-indigo-600" />,
          featured: true,
          links: [
            { name: "Coursera", url: "https://www.coursera.org/" },
            { name: "edX", url: "https://www.edx.org/" },
            { name: "Udacity", url: "https://www.udacity.com/" }
          ]
        }
      ]
    }
  }
  
  // For search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setVisibleResources(resourceCategories[activeCategory].resources);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    // Search across all categories
    const allResources = Object.values(resourceCategories).flatMap(category => 
      category.resources.map(resource => ({
        ...resource,
        categoryId: Object.keys(resourceCategories).find(key => resourceCategories[key].resources.includes(resource))
      }))
    );
    
    const filtered = allResources.filter(resource => {
      const searchLower = searchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.links.some(link => link.name.toLowerCase().includes(searchLower))
      );
    });
    
    setVisibleResources(filtered);
  }, [searchQuery, activeCategory]);

  // Set initial visible resources
  useEffect(() => {
    if (!isSearching) {
      setVisibleResources(resourceCategories[activeCategory].resources);
    }
  }, [activeCategory]);

  return (
    <>
    <HeroSection />
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 nohemi leading-tight">
            Interview Preparation <span className="text-indigo-600">Resources</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            A curated collection of top-quality resources to boost your skills and ace your interviews
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8 relative">
            <div className="flex items-center bg-white rounded-full shadow-md border border-gray-200 overflow-hidden">
              <div className="pl-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search for resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-4 outline-none text-gray-700"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="pr-4 text-gray-400 hover:text-gray-600"
                >
                  <code className="text-xs bg-gray-100 rounded px-2 py-1">ESC</code>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        {!isSearching && (
          <div className="flex flex-wrap justify-center mb-8 gap-4">
            {Object.keys(resourceCategories).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full  text-sm font-medium transition-all flex items-center
                ${activeCategory === category 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm border border-gray-200'}`}
              >
                {resourceCategories[category].icon && (
                  <span className="mr-2 w-5 h-5">{React.cloneElement(resourceCategories[category].icon, { className: 'w-5 h-5' })}</span>
                )}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}
        
        {/* Category Description */}
        {!isSearching && (
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold nohemi text-gray-800 mb-3">
              {resourceCategories[activeCategory].title}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {resourceCategories[activeCategory].description}
            </p>
          </div>
        )}
        
        {/* Search Results Info */}
        {isSearching && (
          <div className="mb-12 text-center">
            <div className="inline-flex items-center bg-indigo-50 px-4 py-2 rounded-full">
              <Filter className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-indigo-800">
                {visibleResources.length} {visibleResources.length === 1 ? 'result' : 'results'} for "{searchQuery}"
              </span>
            </div>
            <button 
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
              className="ml-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Resources Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 relative">
          {visibleResources.length > 0 ? (
            visibleResources.map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2 nohemi">No resources found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or browse by category</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearching(false);
                  }}
                  className="text-indigo-600 font-medium hover:text-indigo-800"
                >
                  Browse all resources
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Path to Success Section */}
        <div className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 nohemi">Path to Interview Success</h2>
            <p className="text-gray-600 mt-3">Follow these steps to maximize your interview preparation</p>
          </div>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-indigo-100 transform -translate-x-1/2 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  step: 1,
                  title: "Master the Fundamentals",
                  description: "Build a strong foundation in core computer science concepts",
                  icon: <BookOpen className="w-8 h-8 text-white" />,
                  bgColor: "bg-indigo-500",
                  position: "right"
                },
                {
                  step: 2,
                  title: "Practice Problem Solving",
                  description: "Solve coding challenges on platforms like LeetCode",
                  icon: <Code className="w-8 h-8 text-white" />,
                  bgColor: "bg-purple-500",
                  position: "left"
                },
                {
                  step: 3,
                  title: "Mock Interviews",
                  description: "Simulate real interviews with our AI-powered platform",
                  icon: <Target className="w-8 h-8 text-white" />,
                  bgColor: "bg-blue-500",
                  position: "right"
                },
                {
                  step: 4,
                  title: "Review & Improve",
                  description: "Analyze feedback and refine your approach",
                  icon: <CheckCircle className="w-8 h-8 text-white" />,
                  bgColor: "bg-green-500",
                  position: "left"
                }
              ].map((step, index) => (
                <div key={index} className={`md:${step.position === "left" ? "text-right mr-12" : "ml-12"} relative`}>
                  {/* Circle for timeline */}
                  <div className={`${step.bgColor} w-12 h-12 rounded-full flex items-center justify-center absolute top-1/2 transform -translate-y-1/2 
                    ${step.position === "left" ? "md:-right-18 right-auto" : "md:-left-18 left-auto"} shadow-lg hidden md:flex`}>
                    {step.icon}
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all relative">
                    <div className={`${step.bgColor} w-12 h-12 rounded-full flex items-center justify-center shadow-md md:hidden mb-4 mx-auto`}>
                      {step.icon}
                    </div>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-3">Step {step.step}</span>
                    <h3 className="text-xl font-semibold text-gray-900 nohemi mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0 md:max-w-xl">
              <h2 className="text-3xl md:text-4xl nohemi font-bold mb-4">
                Ready to Ace Your Interviews?
              </h2>
              <p className="text-indigo-100 text-lg">
                Start practicing with our AI-powered mock interviews and get real-time feedback
              </p>
            </div>
            <div>
              <Link href="/dashboard">
                <button className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-md hover:shadow-lg flex items-center">
                  Start Practice
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}