import { useNavigate } from 'react-router-dom';
import { Template } from '../types';
import { templates } from '../data/templates';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Mail, TrendingUp, Users } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const handleTemplateSelect = (template: Template) => {
    navigate('/login', { state: { selectedTemplate: template } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Mail className="w-8 h-8 text-slate-700" />
              <span className="text-xl font-semibold text-slate-800">ReferralHub</span>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Get Referrals, Land Your Dream Job
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Connect with employees at top companies, track your referral requests, and manage follow-ups all in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-slate-100 rounded-full">
                <Users className="w-8 h-8 text-slate-700" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Find Employees</h3>
            <p className="text-slate-600">
              Search and connect with employees at companies you want to work for
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-slate-100 rounded-full">
                <Mail className="w-8 h-8 text-slate-700" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Smart Templates</h3>
            <p className="text-slate-600">
              Use AI-powered email templates tailored for referral requests
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-slate-100 rounded-full">
                <TrendingUp className="w-8 h-8 text-slate-700" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Track Progress</h3>
            <p className="text-slate-600">
              Monitor your referral requests and schedule follow-ups automatically
            </p>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Choose Your Template
          </h2>
          <p className="text-center text-slate-600 mb-8">
            Select a template to get started. You'll be asked to sign in to continue.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-slate-300"
              onClick={() => handleTemplateSelect(template)}
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{template.name}</h3>
              <p className="text-sm text-slate-600 line-clamp-3">{template.content.substring(0, 100)}...</p>
              <Button variant="outline" className="w-full mt-4">
                Select Template
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
