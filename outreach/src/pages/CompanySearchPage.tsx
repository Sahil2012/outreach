import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import { Loader } from '../components/ui/loader';
import { Building2, User, Plus, Search, ArrowLeft, Briefcase } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
}

interface Employee {
  id: string;
  company_id: string;
  name: string;
  email: string | null;
  linkedin_url: string | null;
  position: string | null;
  is_hr: boolean;
}

export default function CompanySearchPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    website: '',
  });

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    linkedin_url: '',
    position: '',
    is_hr: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      loadEmployees(selectedCompany.id);
    }
  }, [selectedCompany]);

  const loadCompanies = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    if (data) {
      setCompanies(data);
    }
    setLoading(false);
  };

  const loadEmployees = async (companyId: string) => {
    const { data } = await supabase
      .from('employees')
      .select('*')
      .eq('company_id', companyId)
      .order('name');

    if (data) {
      setEmployees(data);
    }
  };

  const handleAddCompany = async () => {
    if (!newCompany.name) return;

    const { data, error } = await supabase
      .from('companies')
      .insert([newCompany])
      .select()
      .single();

    if (!error && data) {
      setCompanies([...companies, data]);
      setNewCompany({ name: '', industry: '', website: '' });
      setShowAddCompany(false);
      setSelectedCompany(data);
    }
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !selectedCompany) return;

    const { data, error } = await supabase
      .from('employees')
      .insert([{ ...newEmployee, company_id: selectedCompany.id }])
      .select()
      .single();

    if (!error && data) {
      setEmployees([...employees, data]);
      setNewEmployee({
        name: '',
        email: '',
        linkedin_url: '',
        position: '',
        is_hr: false,
      });
      setShowAddEmployee(false);
    }
  };

  const handleSelectEmployee = (employee: Employee) => {
    navigate('/outreach', {
      state: {
        company: selectedCompany,
        employee: employee,
      },
    });
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader size="lg" text="Loading companies..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Find Employees</h1>
              <p className="text-slate-600">Search companies and connect with employees</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Companies</h2>
              <Button size="sm" onClick={() => setShowAddCompany(!showAddCompany)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Company
              </Button>
            </div>

            {showAddCompany && (
              <div className="mb-4 p-4 bg-slate-50 rounded-lg space-y-3">
                <TextField
                  placeholder="Company name"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                />
                <TextField
                  placeholder="Industry (optional)"
                  value={newCompany.industry}
                  onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                />
                <TextField
                  placeholder="Website (optional)"
                  value={newCompany.website}
                  onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddCompany} size="sm">
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddCompany(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedCompany?.id === company.id
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">{company.name}</p>
                      {company.industry && (
                        <p className={`text-sm ${
                          selectedCompany?.id === company.id ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {company.industry}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">
                {selectedCompany ? `Employees at ${selectedCompany.name}` : 'Select a Company'}
              </h2>
              {selectedCompany && (
                <Button size="sm" onClick={() => setShowAddEmployee(!showAddEmployee)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Employee
                </Button>
              )}
            </div>

            {showAddEmployee && selectedCompany && (
              <div className="mb-4 p-4 bg-slate-50 rounded-lg space-y-3">
                <TextField
                  placeholder="Employee name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
                <TextField
                  placeholder="Email (optional)"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
                <TextField
                  placeholder="LinkedIn URL (optional)"
                  value={newEmployee.linkedin_url}
                  onChange={(e) => setNewEmployee({ ...newEmployee, linkedin_url: e.target.value })}
                />
                <TextField
                  placeholder="Position (optional)"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newEmployee.is_hr}
                    onChange={(e) => setNewEmployee({ ...newEmployee, is_hr: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-700">Is HR</span>
                </label>
                <div className="flex gap-2">
                  <Button onClick={handleAddEmployee} size="sm">
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddEmployee(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {selectedCompany ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {employees.length === 0 ? (
                  <div className="text-center py-12 text-slate-600">
                    <User className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>No employees found</p>
                    <p className="text-sm mt-1">Add an employee to get started</p>
                  </div>
                ) : (
                  employees.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => handleSelectEmployee(employee)}
                      className="p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-slate-600 mt-1" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-800">{employee.name}</p>
                              {employee.is_hr && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                  HR
                                </span>
                              )}
                            </div>
                            {employee.position && (
                              <div className="flex items-center gap-1 mt-1">
                                <Briefcase className="w-4 h-4 text-slate-500" />
                                <p className="text-sm text-slate-600">{employee.position}</p>
                              </div>
                            )}
                            {employee.email && (
                              <p className="text-sm text-slate-600 mt-1">{employee.email}</p>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Request Referral
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-600">
                <Building2 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>Select a company to view employees</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
