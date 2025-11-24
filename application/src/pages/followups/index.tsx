import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader } from '../../components/ui/loader';
import { Calendar, CheckCircle, Clock, ArrowLeft, Building2 } from 'lucide-react';
import axios from 'axios';

interface Followup {
  id: string;
  referral_id: string;
  followup_date: string;
  notes: string | null;
  completed: boolean;
  created_at: string;
  referrals: {
    companies: {
      name: string;
    };
    employees: {
      name: string;
    } | null;
  };
}

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadFollowups();
  }, []);

  const loadFollowups = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('http://localhost:3000/followups', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowups(data);
    } catch (error) {
      console.error('Failed to load followups:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (followupId: string, currentStatus: boolean) => {
    try {
      const token = await getToken();
      await axios.put(
        `http://localhost:3000/followups/${followupId}`,
        { completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadFollowups();
    } catch (error) {
      console.error('Failed to update followup:', error);
    }
  };

  const filteredFollowups = followups.filter((f) => {
    if (filter === 'pending') return !f.completed;
    if (filter === 'completed') return f.completed;
    return true;
  });

  const upcomingFollowups = filteredFollowups.filter(
    (f) => !f.completed && new Date(f.followup_date) >= new Date()
  );

  const overdueFollowups = filteredFollowups.filter(
    (f) => !f.completed && new Date(f.followup_date) < new Date()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader size="lg" text="Loading follow-ups..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Follow-ups</h1>
              <p className="text-slate-600">Manage your referral follow-ups</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Follow-ups</p>
                <p className="text-3xl font-bold text-slate-900">{followups.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-slate-400" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Upcoming</p>
                <p className="text-3xl font-bold text-slate-900">{upcomingFollowups.length}</p>
              </div>
              <Clock className="w-12 h-12 text-slate-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{overdueFollowups.length}</p>
              </div>
              <Clock className="w-12 h-12 text-red-600" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-800">All Follow-ups</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {overdueFollowups.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Overdue Follow-ups
                </h3>
                <div className="space-y-3">
                  {overdueFollowups.map((followup) => (
                    <div
                      key={followup.id}
                      className="p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-5 h-5 text-slate-600" />
                            <span className="font-semibold text-slate-800">
                              {followup.referrals.companies.name}
                            </span>
                            {followup.referrals.employees && (
                              <>
                                <span className="text-slate-400">→</span>
                                <span className="text-slate-700">
                                  {followup.referrals.employees.name}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            Due: {new Date(followup.followup_date).toLocaleDateString()}
                          </p>
                          {followup.notes && (
                            <p className="text-sm text-slate-600">{followup.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleComplete(followup.id, followup.completed)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {upcomingFollowups.length === 0 && overdueFollowups.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No pending follow-ups</p>
                </div>
              ) : (
                upcomingFollowups.map((followup) => (
                  <div
                    key={followup.id}
                    className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-5 h-5 text-slate-600" />
                          <span className="font-semibold text-slate-800">
                            {followup.referrals.companies.name}
                          </span>
                          {followup.referrals.employees && (
                            <>
                              <span className="text-slate-400">→</span>
                              <span className="text-slate-700">
                                {followup.referrals.employees.name}
                              </span>
                            </>
                          )}
                          {followup.completed && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          Due: {new Date(followup.followup_date).toLocaleDateString()}
                        </p>
                        {followup.notes && (
                          <p className="text-sm text-slate-600">{followup.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleComplete(followup.id, followup.completed)}
                        >
                          {followup.completed ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
