"use client";

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="bg-white mt-16 py-16 relative overflow-hidden border-t border-gray-100">
      {/* Big Typography Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
        <h1 className="text-[150px] font-bold nohemi transform ">ReMa.ai</h1>
      </div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <span className="font-bold text-2xl nohemi text-indigo-600">ReMa<span className="text-gray-800">.ai</span></span>
            <div className="text-gray-500">
              © {currentYear} All rights reserved
            </div>
          </div>
          
          {/* Made with Love */}
          <div className="flex items-center text-gray-600 text-lg bg-gray-50 px-6 py-3 rounded-full shadow-sm">
            Made with 
            <svg className="h-5 w-5 mx-2 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
            </svg>
            for you
          </div>

          {/* Go to Top Button */}
          <button
            onClick={scrollToTop}
            className="mt-6 md:mt-0 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-3 px-5 rounded-full transition-all flex items-center shadow-sm hover:shadow group"
          >
            <svg className="h-5 w-5 mr-2 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;