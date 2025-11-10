import { SectionProps } from '../../types/section';
import React, { useState, useEffect } from 'react';
import AdminHeader from '../common/AdminHeader';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: 'Spouse' | 'Parent' | 'Sibling';
}

interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: keyof Departments;
  role: string;
  status: 'active' | 'break' | 'off';
  shift: 'Morning' | 'Evening' | 'Night';
  joinDate: string;
  performance: number;
  attendance: number;
  certifications: string[];
  emergencyContact: EmergencyContact;
}

interface Department {
  name: string;
  color: string;
  roles: string[];
}

interface Departments {
  management: Department;
  frontOffice: Department;
  housekeeping: Department;
  foodBeverage: Department;
  technical: Department;
}

type ViewType = 'directory' | 'schedule' | 'performance';

const StaffSection: React.FC<SectionProps> = ({ userId }) => {
  const [activeView, setActiveView] = useState<ViewType>('directory');
  const [selectedDepartment, setSelectedDepartment] = useState<'all' | keyof Departments>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [schedule, setSchedule] = useState<Record<string, unknown>>({});

  const departments: Departments = {
    management: {
      name: 'Management & Administration',
      color: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      roles: ['General Manager', 'Front Office Manager', 'Housekeeping Manager', 'F&B Manager', 'HR Manager']
    },
    frontOffice: {
      name: 'Front Office',
      color: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      roles: ['Receptionist', 'Concierge', 'Bell Staff', 'Night Auditor']
    },
    housekeeping: {
      name: 'Housekeeping',
      color: 'bg-gradient-to-r from-green-600 to-emerald-600',
      roles: ['Housekeeping Supervisor', 'Room Attendant', 'Houseman', 'Laundry Attendant']
    },
    foodBeverage: {
      name: 'Food & Beverage',
      color: 'bg-gradient-to-r from-orange-600 to-amber-600',
      roles: ['Restaurant Manager', 'Server', 'Bartender', 'Kitchen Staff']
    },
    technical: {
      name: 'Technical & Support',
      color: 'bg-gradient-to-r from-red-600 to-pink-600',
      roles: ['Maintenance Engineer', 'IT Support', 'Security Staff', 'Spa & Wellness']
    }
  };

  // Generate realistic staff data
  const generateStaffData = (): Staff[] => {
    const firstNames = ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'James', 'Maria', 'Robert', 'Anna'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const statuses: Staff['status'][] = ['active', 'break', 'off'];
    const shifts: Staff['shift'][] = ['Morning', 'Evening', 'Night'];

    let staff: Staff[] = [];
    let id = 1;

    Object.entries(departments).forEach(([deptKey, dept]) => {
      dept.roles.forEach((role: any) => {
        for (let i = 0; i < 3; i++) {
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const shift = shifts[Math.floor(Math.random() * shifts.length)];

          staff.push({
            id: id++,
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hotel.com`,
            phone: `+2547${Math.floor(Math.random() * 90000000 + 10000000)}`,
            department: deptKey as keyof Departments,
            role,
            status,
            shift,
            joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
            performance: Math.floor(Math.random() * 40) + 60,
            attendance: Math.floor(Math.random() * 10) + 90,
            certifications: ['First Aid', 'Customer Service', 'Safety Training'].slice(
              0,
              Math.floor(Math.random() * 3) + 1
            ),
            emergencyContact: {
              name: `Emergency ${lastName}`,
              phone: `+2547${Math.floor(Math.random() * 90000000 + 10000000)}`,
              relationship: ['Spouse', 'Parent', 'Sibling'][Math.floor(Math.random() * 3)] as
                | 'Spouse'
                | 'Parent'
                | 'Sibling'
            }
          });
        }
      });
    });

    return staff;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStaff(generateStaffData());
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredStaff = staff.filter((employee) => {
    const matchesDepartment =
      selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const metrics = {
    totalStaff: staff.length,
    activeStaff: staff.filter((s) => s.status === 'active').length,
    onBreak: staff.filter((s) => s.status === 'break').length,
    departments: Object.keys(departments).length
  };

  const toggleStaffSelection = (staffId: number) => {
    setSelectedStaff((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  const selectAllStaff = () => setSelectedStaff(filteredStaff.map((emp) => emp.id));
  const clearSelection = () => setSelectedStaff([]);

  // ... keep your render JSX identical here ...

  return (
    <div className="flex flex-col gap-6 p-4 text-slate-200">
      <AdminHeader title="Staff Management" subtitle="Manage employee schedules, track performance, and oversee staff operations" />
      {/* Header */}
      <div className="flex flex-col gap-4 items-start">
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-slate-800/80 rounded-xl p-1 backdrop-blur-sm border border-slate-700/50">
            <button
              onClick={() => setActiveView('directory')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeView === 'directory'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-slate-100'
                }`}
            >
              👥 Directory
            </button>
            <button
              onClick={() => setActiveView('schedule')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeView === 'schedule'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-slate-100'
                }`}
            >
              📅 Schedule
            </button>
            <button
              onClick={() => setActiveView('performance')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeView === 'performance'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-slate-100'
                }`}
            >
              📊 Performance
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
          <div className="text-sm text-slate-400">Total Staff</div>
          <div className="text-2xl font-bold text-slate-200">{metrics.totalStaff}</div>
          <div className="text-xs text-slate-300 mt-1">Across all departments</div>
        </div>

        <div className="p-4 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
          <div className="text-sm text-slate-400">Active Now</div>
          <div className="text-2xl font-bold text-green-400">{metrics.activeStaff}</div>
          <div className="text-xs text-green-300 mt-1">Currently on duty</div>
        </div>

        <div className="p-4 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
          <div className="text-sm text-slate-400">On Break</div>
          <div className="text-2xl font-bold text-amber-400">{metrics.onBreak}</div>
          <div className="text-xs text-amber-300 mt-1">Taking scheduled breaks</div>
        </div>

        <div className="p-4 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
          <div className="text-sm text-slate-400">Departments</div>
          <div className="text-2xl font-bold text-cyan-400">{metrics.departments}</div>
          <div className="text-xs text-cyan-300 mt-1">Functional divisions</div>
        </div>
      </div>

      {/* Bulk Selection Bar */}
      {selectedStaff.length > 0 && (
        <div className="p-4 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-500/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center text-white text-sm font-semibold">
                {selectedStaff.length}
              </div>
              <span className="font-semibold text-slate-200">
                {selectedStaff.length} staff member{selectedStaff.length !== 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
                Assign Shift
              </button>
              <button className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                Send Message
              </button>
              <button
                onClick={clearSelection}
                className="px-4 py-2 bg-slate-500/20 text-slate-300 border border-slate-500/30 rounded-lg text-sm hover:bg-slate-500/30 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 p-6 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name, role, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/70 border border-slate-600 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={selectAllStaff}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-slate-600 text-slate-200 rounded-lg text-sm hover:bg-slate-500 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Department Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem' }}>Department</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['all', ...Object.keys(departments)].map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept as keyof Departments | 'all')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s',
                    textTransform: 'capitalize',
                    ...(selectedDepartment === dept
                      ? { backgroundColor: '#f59e0b', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
                      : { backgroundColor: '#334155', color: '#cbd5e1', hover: { backgroundColor: '#475569' } })
                  }}
                >
                  {dept === 'all'
                    ? 'All Departments'
                    : (dept in departments
                      ? departments[dept as keyof Departments].name
                      : dept)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Staff Directory View */}
      {activeView === 'directory' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem' }}>
          {filteredStaff.map(employee => (
            <div
              key={employee.id}
              onClick={() => toggleStaffSelection(employee.id)}
              style={{
                padding: '1.5rem',
                backgroundColor: selectedStaff.includes(employee.id) ? 'rgba(245, 158, 11, 0.1)' : 'rgba(30, 41, 59, 0.8)',
                backdropFilter: 'blur(8px)',
                borderRadius: '1rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: selectedStaff.includes(employee.id) ? '2px solid #f59e0b' : '1px solid rgba(71, 85, 105, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${departments[employee.department].color.split(' ')[1]}, ${departments[employee.department].color.split(' ')[3]})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}>
                    {employee.firstName[0]}{employee.lastName[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#f1f5f9' }}>
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{employee.role}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    ...(employee.status === 'active' ? { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac' } :
                      employee.status === 'break' ? { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fde047' } :
                        { backgroundColor: 'rgba(100, 116, 139, 0.2)', color: '#cbd5e1' })
                  }}>
                    {employee.status}
                  </div>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#93c5fd'
                  }}>
                    {employee.shift} Shift
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Department</div>
                  <div style={{ fontSize: '0.875rem', color: '#e2e8f0', fontWeight: '500' }}>
                    {departments[employee.department].name}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Contact</div>
                  <div style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>{employee.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Performance</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '4rem', height: '0.5rem', backgroundColor: '#334155', borderRadius: '0.25rem', overflow: 'hidden' }}>
                      <div
                        style={{ height: '100%', backgroundColor: employee.performance > 80 ? '#4ade80' : employee.performance > 60 ? '#fbbf24' : '#ef4444', borderRadius: '0.25rem', width: `${employee.performance}%` }}
                      ></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{employee.performance}%</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Attendance</div>
                  <div style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>{employee.attendance}%</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {employee.certifications.map((cert, index) => (
                  <span key={index} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#334155', borderRadius: '0.375rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Department Overview */}
      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)' }}>
        <h3 style={{ fontWeight: '600', color: '#f1f5f9', marginBottom: '1rem' }}>Department Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
          {Object.entries(departments).map(([key, dept]) => {
            const deptStaff = staff.filter(s => s.department === key);
            const activeStaff = deptStaff.filter(s => s.status === 'active').length;

            return (
              <div key={key} style={{
                padding: '1rem',
                background: `linear-gradient(135deg, ${dept.color.split(' ')[1]}, ${dept.color.split(' ')[3]})`,
                borderRadius: '0.75rem',
                color: 'white'
              }}>
                <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{dept.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{deptStaff.length}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Total Staff</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{activeStaff}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Active Now</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StaffSection;
