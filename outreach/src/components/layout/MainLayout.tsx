import React from "react";
import { Mail } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const outreach = "NaukriOutreach";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-50 to-cyan-50 z-50">
      <header className="border-b border-slate-200 sticky top-0 bg-white/95 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-600" />
            <h1 className="font-medium text-xl text-slate-800">{outreach}</h1>
          </div>
          <nav className="hidden sm:block">
            <ul className="flex items-center gap-8">
              <li>
                <a href="/" className="text-slate-600 hover:text-emerald-600 text-sm font-medium transition-colors">
                  LogIn
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-emerald-600 text-sm font-medium transition-colors">
                  SignUp
                </a>
              </li>
            </ul>
          </nav>
          <button className="block sm:hidden text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">{children}</main>

      <footer className="bg-transparent py-6 border-t-2 border-neutral-100">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {outreach}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
