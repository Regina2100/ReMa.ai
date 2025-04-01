import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/sonner";
import Footer from "./dashboard/_components/Footer";
import Header from "./dashboard/_components/Header";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });



export const metadata = {
  title: {
    default: 'ReMa AI - Ace your Interviews',
    template: '%s | ReMa AI'
  },
  description: 'Elevate your interview skills with AI-powered mock interviews. Get personalized coaching, real-time feedback, and boost your confidence.',
  keywords: [
    'AI interview preparation', 
    'mock interviews', 
    'interview coaching', 
    'career development', 
    'job interview help'
  ],
  authors: [{ name: 'Regina Mary' }, {name: 'Manoj Kumar'},{name: 'Kavinesh'},{name: 'Santhosh Kanna'},{name: 'Yogesh M'} ],
  creator: 'ReMa AI',
  publisher: 'ReMa AI',
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html 
        lang="en" 
        
      >
        <body 
          className={`
            antialiased 
            min-h-screen 
            flex 
            flex-col 
            bg-white 
            text-gray-900 
            ${inter.className}
          `}
        >
          <a 
            href="#main-content" 
            className="
              absolute 
              top-[-999px] 
              left-[-999px] 
              z-[-1] 
              focus:top-0 
              focus:left-0 
              focus:z-50 
              p-4 
              bg-indigo-600 
              text-white
            "
          >
            Skip to main content
          </a>
          
          <Header />
          <Toaster />
          
          <main 
            id="main-content" 
            className="
              
              pt-16 
              sm:pt-20 
              mx-auto 
              w-full 
            "
          >
            {children}
          </main>
          
         <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}