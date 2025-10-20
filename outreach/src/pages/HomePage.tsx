import { useNavigate } from 'react-router-dom';
import { Template } from '../types';
import { templates } from '../data/templates';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import MainLayout from '../components/layout/MainLayout';
import { Mail, Target, Zap, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const handleTemplateSelect = (template: Template) => {
    navigate('/login', { state: { selectedTemplate: template } });
  };

  return (
    <MainLayout>
      <div className="min-h-screen -mx-4 -my-8">
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-30 dark:opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-300 dark:bg-primary-900 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-300 dark:bg-accent-900 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary-200 dark:bg-primary-800 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
            <div className="text-center mb-12 sm:mb-16 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-primary-200 dark:border-primary-800 mb-6 shadow-lg">
                <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Your Career Growth Partner</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
                Get Referrals,<br />
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                  Land Your Dream Job
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
                Connect with employees at top companies, track your referral requests, and manage follow-ups—all in one elegant platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 dark:from-primary-500 dark:to-accent-500 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="border-2 border-slate-300 dark:border-slate-600 hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                >
                  Sign In
                </Button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-20 px-4">
              {[
                { icon: Target, title: 'Find Employees', desc: 'Discover and connect with employees at companies you aspire to join', color: 'primary' },
                { icon: Zap, title: 'Smart Templates', desc: 'AI-powered email templates crafted specifically for referral success', color: 'accent' },
                { icon: CheckCircle, title: 'Track Progress', desc: 'Monitor requests and automate follow-ups with intelligent scheduling', color: 'primary' }
              ].map((feature, idx) => (
                <Card key={idx} className="group p-6 sm:p-8 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className={`p-3 sm:p-4 bg-gradient-to-br from-${feature.color}-100 to-accent-100 dark:from-${feature.color}-900/30 dark:to-accent-900/30 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-8 h-8 sm:w-10 sm:h-10 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.desc}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
          <div className="absolute inset-0 opacity-5 dark:opacity-10"
               style={{
                 backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
                 backgroundSize: '40px 40px'
               }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
            <div className="text-center mb-12 sm:mb-16 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 backdrop-blur-sm rounded-full border border-primary-200 dark:border-primary-800 mb-6 shadow-lg">
                <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Professionally Crafted</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
                Choose Your Template
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
                Select from our curated collection of referral templates. Sign in to customize and send.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
              {templates.map((template, index) => (
                <Card
                  key={template.id}
                  className="group p-5 sm:p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 animate-slide-up"
                  onClick={() => handleTemplateSelect(template)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                      <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full border border-primary-200 dark:border-primary-800">
                      Premium
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {template.content.substring(0, 120)}...
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-300 group/btn"
                  >
                    Select Template
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12 sm:mt-16 animate-slide-up px-4">
              <p className="text-slate-600 dark:text-slate-400 mb-6">Ready to accelerate your career?</p>
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 dark:from-primary-500 dark:to-accent-500 text-white px-8 sm:px-10 py-4 sm:py-6 text-base sm:text-lg shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 group"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
