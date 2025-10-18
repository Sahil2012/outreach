import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Loader } from '../components/ui/loader';
import {
  Mail,
  Building2,
  User,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  Plus,
  Search,
  Calendar,
} from 'lucide-react';

interface Referral {
  id: string;
  company_id: string;
  employee_id: string | null;
  template_type: string;
  status: string;
  sent_at: string | null;
  created_at: string;
  companies: {
    name: string;
    industry: string | null;
  };
  employees: {
    name: string;
    position: string | null;
    is_hr: boolean;
  } | null;
}

export default function DashboardPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'company' | 'employee' | 'hr'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadReferrals();
  }, []);

  useEffect(() => {
    filterReferrals();
  }, [referrals, filterType, searchQuery]);

  const loadReferrals = async () => {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        companies (
          name,
          industry
        ),
        employees (
          name,
          position,
          is_hr
        )
      `)
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReferrals(data as any);
    }
    setLoading(false);
  };

  const filterReferrals = () => {
    let filtered = referrals;

    if (filterType === 'hr') {
      filtered = filtered.filter(r => r.employees?.is_hr);
    }

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.companies.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.employees?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredReferrals(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Mail className="w-5 h-5 text-slate-600" />;
      case 'responded':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-slate-100 text-slate-700';
      case 'responded':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'pending').length,
    sent: referrals.filter(r => r.status === 'sent').length,
    responded: referrals.filter(r => r.status === 'responded').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Mail className="w-8 h-8 text-slate-700" />
              <span className="text-xl font-semibold text-slate-800">ReferralHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/profile/edit')}>
                Edit Profile
              </Button>
              <Button variant="outline" onClick={() => navigate('/company-search')}>
                <Search className="w-4 h-4 mr-2" />
                Find Employees
              </Button>
              <Button variant="outline" onClick={() => navigate('/followups')}>
                <Calendar className="w-4 h-4 mr-2" />
                Follow-ups
              </Button>
              <Button onClick={() => navigate('/outreach')}>
                <Plus className="w-4 h-4 mr-2" />
                New Referral
              </Button>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Track your referral requests and follow-ups</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Referrals</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <Mail className="w-12 h-12 text-slate-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
              </div>
              <Clock className="w-12 h-12 text-slate-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Sent</p>
                <p className="text-3xl font-bold text-slate-900">{stats.sent}</p>
              </div>
              <Mail className="w-12 h-12 text-slate-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Responded</p>
                <p className="text-3xl font-bold text-green-600">{stats.responded}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Your Referrals</h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search by company or employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              >
                <option value="all">All</option>
                <option value="company">By Company</option>
                <option value="employee">By Employee</option>
                <option value="hr">HR Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReferrals.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No referrals found</p>
                <Button onClick={() => navigate('/outreach')} className="mt-4">
                  Create Your First Referral
                </Button>
              </div>
            ) : (
              filteredReferrals.map((referral) => (
                <div
                  key={referral.id}
                  className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-5 h-5 text-slate-600" />
                        <h3 className="font-semibold text-slate-800">
                          {referral.companies.name}
                        </h3>
                        {referral.employees && (
                          <>
                            <span className="text-slate-400">→</span>
                            <User className="w-5 h-5 text-slate-600" />
                            <span className="text-slate-700">{referral.employees.name}</span>
                            {referral.employees.is_hr && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                HR
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        Template: {referral.template_type}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Created: {new Date(referral.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          referral.status
                        )}`}
                      >
                        {getStatusIcon(referral.status)}
                        <span className="ml-2">{referral.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
