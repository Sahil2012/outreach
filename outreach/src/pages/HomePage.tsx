import { useNavigate } from 'react-router-dom';
import { Template } from '../types';
import { templates } from '../data/templates';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Mail, Users, Sparkles, Target, Zap } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const handleTemplateSelect = (template: Template) => {
    navigate('/login', { state: { selectedTemplate: template } });
  };

  return (
      <div className="min-h-screen -mx-4 -my-8">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-200 mb-6 cursor-pointer">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Your Career Growth Partner</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
                Get Referrals,<br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Land Your Dream Job
                </span>
              </h1>
              <p className="text-l md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                Connect with employees at top companies, track your referral requests, and manage follow-ups—all in one elegant platform.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-2 text-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
                >
                  Get Reffered
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="border-2 border-slate-300 hover:border-emerald-500 hover:text-emerald-700 px-8 py-2 text-lg bg-white/80 backdrop-blur-sm"
                >
                  Subscribe
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-20">
              <Card className="group p-8 text-center bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-1 cursor-pointer">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-teal-100 to-teal-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Find Employees</h3>
                <p className="text-slate-600 leading-relaxed">
                  Discover and connect with employees at companies you aspire to join
                </p>
              </Card>

              <Card className="group p-8 text-center bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-1 cursor-pointer">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-teal-100 to-teal-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-10 h-10 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Smart Templates</h3>
                <p className="text-slate-600 leading-relaxed">
                  AI-powered email templates crafted specifically for referral success
                </p>
              </Card>

              <Card className="group p-8 text-center bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-1 cursor-pointer">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-teal-100 to-teal-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-10 h-10 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Track Progress</h3>
                <p className="text-slate-600 leading-relaxed">
                  Monitor requests and automate follow-ups with intelligent scheduling
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-500/20 mb-6 cursor-pointer">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">Professionally Crafted</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Choose Your Template
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Select from our curated collection of referral templates. Sign in to customize and send.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {templates.map((template, index) => (
                <Card
                  key={template.id}
                  className="group p-6 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2"
                  onClick={() => handleTemplateSelect(template)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
                      <Mail className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                      Premium
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {template.content.substring(0, 120)}...
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300"
                  >
                    Select Template
                  </Button>
                </Card>
              ))}
            </div>

            <div className="text-center mt-16">
              <p className="text-slate-400 mb-6">Ready to accelerate your career?</p>
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-2 text-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </section>
      </div>
  );
}
