import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader } from '../../components/ui/loader';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Building2,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import axios from 'axios';

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

const MOCK_REFERRALS: Referral[] = [
  {
    id: '1',
    company_id: 'c1',
    employee_id: 'e1',
    template_type: 'Standard',
    status: 'sent',
    sent_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    companies: { name: 'Google', industry: 'Tech' },
    employees: { name: 'John Doe', position: 'Senior Engineer', is_hr: false }
  },
  {
    id: '2',
    company_id: 'c2',
    employee_id: 'e2',
    template_type: 'Casual',
    status: 'responded',
    sent_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    companies: { name: 'Microsoft', industry: 'Tech' },
    employees: { name: 'Jane Smith', position: 'Recruiter', is_hr: true }
  },
  {
    id: '3',
    company_id: 'c3',
    employee_id: 'e3',
    template_type: 'Formal',
    status: 'pending',
    sent_at: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    companies: { name: 'Amazon', industry: 'Tech' },
    employees: { name: 'Bob Wilson', position: 'Manager', is_hr: false }
  }
];

export default function DashboardPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'company' | 'employee' | 'hr'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadReferrals();
  }, []);

  useEffect(() => {
    filterReferrals();
  }, [referrals, filterType, searchQuery]);

  const loadReferrals = async () => {
    try {
      const token = await getToken();
      // Try to fetch from API
      const { data } = await axios.get('http://localhost:3000/referrals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReferrals(data);
    } catch (error) {
      console.warn('Failed to load referrals from API, using mock data:', error);
      // Fallback to mock data for demonstration
      setReferrals(MOCK_REFERRALS);
    } finally {
      setLoading(false);
    }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100/80">Sent</Badge>;
      case 'responded':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100/80">Responded</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
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
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your referral requests and follow-ups</p>
        </div>
        <Button onClick={() => navigate('/outreach')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Mail
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold mt-2">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sent</p>
              <p className="text-3xl font-bold mt-2">{stats.sent}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Responded</p>
              <p className="text-3xl font-bold mt-2 text-green-600">{stats.responded}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="rounded-3xl shadow-xl border-border/40 backdrop-blur-sm bg-background/95 overflow-hidden">
        <CardHeader className="border-b border-border/40 px-6 py-6 !pb-5 !gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>Manage and track your outreach campaigns</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterType('all')}>
                    All Requests
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('hr')}>
                    HR Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead className="pl-6">Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='py-4'>
              {filteredReferrals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No referrals found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReferrals.map((referral) => (
                  <TableRow key={referral.id} className="hover:bg-muted/30 border-border/40">
                    <TableCell className="pl-6 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                        </div>
                        {referral.companies.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {referral.employees ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {referral.employees.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{referral.employees.name}</span>
                            <span className="text-xs text-muted-foreground">{referral.employees.position}</span>
                          </div>
                          {referral.employees.is_hr && (
                            <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4">HR</Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{referral.template_type}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(referral.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Request</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
