import React, { useState, useEffect } from 'react';
import AdminHeader from '../common/AdminHeader';

export default function StaffSection() {
  const [activeView, setActiveView] = useState('directory');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Staff categories and departments
  const departments = {
    management: {
      name: 'Management & Administration',
      color: 'from-purple-600 to-indigo-600',
      roles: ['General Manager', 'Front Office Manager', 'Housekeeping Manager', 'F&B Manager', 'HR Manager']
    },
    frontOffice: {
      name: 'Front Office',
      color: 'from-blue-600 to-cyan-600',
      roles: ['Receptionist', 'Concierge', 'Bell Staff', 'Night Auditor']
    },
    housekeeping: {
      name: 'Housekeeping',
      color: 'from-green-600 to-emerald-600',
      roles: ['Housekeeping Supervisor', 'Room Attendant', 'Houseman', 'Laundry Attendant']
    },
    foodBeverage: {
      name: 'Food & Beverage',
      color: 'from-orange-600 to-amber-600',
      roles: ['Restaurant Manager', 'Server', 'Bartender', 'Kitchen Staff']
    },
    technical: {
      name: 'Technical & Support',
      color: 'from-red-600 to-pink-600',
      roles: ['Maintenance Engineer', 'IT Support', 'Security Staff', 'Spa & Wellness']
    }
  };

  // Generate realistic staff data
  const generateStaffData = () => {
    const firstNames = ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'James', 'Maria', 'Robert', 'Anna'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    let staff = [];
    let id = 1;

    Object.entries(departments).forEach(([deptKey, dept]) => {
      dept.roles.forEach(role => {
        for (let i = 0; i < 3; i++) {
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const status = ['active', 'break', 'off'][Math.floor(Math.random() * 3)];
          const shift = ['Morning', 'Evening', 'Night'][Math.floor(Math.random() * 3)];
          
          staff.push({
            id: id++,
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hotel.com`,
            phone: `+2547${Math.floor(Math.random() * 90000000 + 10000000)}`,
            department: deptKey,
            role,
            status,
            shift,
            joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            performance: Math.floor(Math.random() * 40) + 60, // 60-100%
            attendance: Math.floor(Math.random() * 10) + 90, // 90-100%
            certifications: ['First Aid', 'Customer Service', 'Safety Training'].slice(0, Math.floor(Math.random() * 3) + 1),
            emergencyContact: {
              name: `Emergency ${lastName}`,
              phone: `+2547${Math.floor(Math.random() * 90000000 + 10000000)}`,
              relationship: ['Spouse', 'Parent', 'Sibling'][Math.floor(Math.random() * 3)]
            }
          });
        }
      });
    });

    return staff;
  };

  const [staff, setStaff] = useState([]);
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStaff(generateStaffData());
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter staff based on current filters
  const filteredStaff = staff.filter(employee => {
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDepartment && matchesSearch;
  });

  // Calculate metrics
  const metrics = {
    totalStaff: staff.length,
    activeStaff: staff.filter(s => s.status === 'active').length,
    onBreak: staff.filter(s => s.status === 'break').length,
    departments: Object.keys(departments).length
  };

  // Toggle staff selection
  const toggleStaffSelection = (staffId) => {
    setSelectedStaff(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  // Select all filtered staff
  const selectAllStaff = () => {
    setSelectedStaff(filteredStaff.map(emp => emp.id));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedStaff([]);
  };

  if (loading) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', color: '#e2e8f0'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{height: '2rem', width: '12rem', backgroundColor: '#334155', borderRadius: '0.75rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
          <div style={{height: '2.5rem', width: '8rem', backgroundColor: '#334155', borderRadius: '0.75rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '1rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}>
              <div style={{height: '1.5rem', backgroundColor: '#334155', borderRadius: '0.25rem', marginBottom: '0.5rem'}}></div>
              <div style={{height: '2rem', backgroundColor: '#334155', borderRadius: '0.25rem'}}></div>
            </div>
          ))}
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem'}}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '1rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', height: '4rem'}}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', color: '#e2e8f0'}}>
      <AdminHeader title="Staff" subtitle="Manage employees and schedules" />
      {/* Header */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start'}}>
        <div>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #f59e0b, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            Staff Management
          </h2>
          <p style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem'}}>
            Manage employee schedules, track performance, and oversee staff operations
          </p>
        </div>
        
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem'}}>
          <div style={{display: 'flex', backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '0.75rem', padding: '0.25rem', backdropFilter: 'blur(8px)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
            <button
              onClick={() => setActiveView('directory')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s',
                ...(activeView === 'directory' 
                  ? {backgroundColor: '#f59e0b', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'} 
                  : {color: '#cbd5e1', hover: {color: '#f1f5f9'}})
              }}
            >
              👥 Directory
            </button>
            <button
              onClick={() => setActiveView('schedule')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s',
                ...(activeView === 'schedule' 
                  ? {backgroundColor: '#f59e0b', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'} 
                  : {color: '#cbd5e1', hover: {color: '#f1f5f9'}})
              }}
            >
              📅 Schedule
            </button>
            <button
              onClick={() => setActiveView('performance')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s',
                ...(activeView === 'performance' 
                  ? {backgroundColor: '#f59e0b', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'} 
                  : {color: '#cbd5e1', hover: {color: '#f1f5f9'}})
              }}
            >
              📊 Performance
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Total Staff</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#e2e8f0'}}>{metrics.totalStaff}</div>
          <div style={{fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.25rem'}}>Across all departments</div>
        </div>

        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Active Now</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80'}}>{metrics.activeStaff}</div>
          <div style={{fontSize: '0.75rem', color: '#86efac', marginTop: '0.25rem'}}>Currently on duty</div>
        </div>

        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>On Break</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24'}}>{metrics.onBreak}</div>
          <div style={{fontSize: '0.75rem', color: '#fde047', marginTop: '0.25rem'}}>Taking scheduled breaks</div>
        </div>

        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Departments</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#06b6d4'}}>{metrics.departments}</div>
          <div style={{fontSize: '0.75rem', color: '#67e8f9', marginTop: '0.25rem'}}>Functional divisions</div>
        </div>
      </div>

      {/* Bulk Selection Bar */}
      {selectedStaff.length > 0 && (
        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(245, 158, 11, 0.5)'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <div style={{width: '1.5rem', height: '1.5rem', backgroundColor: '#f59e0b', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.875rem', fontWeight: '600'}}>
                {selectedStaff.length}
              </div>
              <span style={{fontWeight: '600', color: '#e2e8f0'}}>
                {selectedStaff.length} staff member{selectedStaff.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              <button
                style={{padding: '0.5rem 1rem', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'colors 0.3s', hover: {backgroundColor: 'rgba(34, 197, 94, 0.3)'}}}
              >
                Assign Shift
              </button>
              <button
                style={{padding: '0.5rem 1rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'colors 0.3s', hover: {backgroundColor: 'rgba(59, 130, 246, 0.3)'}}}
              >
                Send Message
              </button>
              <button
                onClick={clearSelection}
                style={{padding: '0.5rem 1rem', backgroundColor: 'rgba(100, 116, 139, 0.2)', color: '#cbd5e1', border: '1px solid rgba(100, 116, 139, 0.3)', borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'colors 0.3s', hover: {backgroundColor: 'rgba(100, 116, 139, 0.3)'}}}
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center'}}>
          <div style={{flex: '1', minWidth: '200px'}}>
            <input
              type="text"
              placeholder="Search by name, role, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#334155',
                border: '1px solid #475569',
                borderRadius: '0.75rem',
                color: '#e2e8f0',
                fontSize: '0.875rem',
                focus: {outline: 'none', ring: '2px', ringColor: 'rgba(245, 158, 11, 0.5)', borderColor: '#f59e0b'},
                transition: 'all 0.3s'
              }}
            />
          </div>
          
          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            <button
              onClick={selectAllStaff}
              style={{padding: '0.5rem 1rem', backgroundColor: '#f59e0b', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'colors 0.3s', hover: {backgroundColor: '#d97706'}}}
            >
              Select All
            </button>
            <button
              onClick={clearSelection}
              style={{padding: '0.5rem 1rem', backgroundColor: '#475569', color: '#e2e8f0', borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'colors 0.3s', hover: {backgroundColor: '#64748b'}}}
            >
              Clear All
            </button>
          </div>
        </div>

        <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem'}}>
          {/* Department Filter */}
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>Department</label>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              {['all', ...Object.keys(departments)].map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s',
                    textTransform: 'capitalize',
                    ...(selectedDepartment === dept 
                      ? {backgroundColor: '#f59e0b', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'} 
                      : {backgroundColor: '#334155', color: '#cbd5e1', hover: {backgroundColor: '#475569'}})
                  }}
                >
                  {dept === 'all' ? 'All Departments' : departments[dept].name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Staff Directory View */}
      {activeView === 'directory' && (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem'}}>
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
                hover: {borderColor: '#f59e0b', transform: 'translateY(-2px)'}
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
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
                    <div style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#f1f5f9'}}>
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>{employee.role}</div>
                  </div>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    ...(employee.status === 'active' ? {backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac'} :
                      employee.status === 'break' ? {backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fde047'} :
                      {backgroundColor: 'rgba(100, 116, 139, 0.2)', color: '#cbd5e1'})
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

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
                <div>
                  <div style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem'}}>Department</div>
                  <div style={{fontSize: '0.875rem', color: '#e2e8f0', fontWeight: '500'}}>
                    {departments[employee.department].name}
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem'}}>Contact</div>
                  <div style={{fontSize: '0.875rem', color: '#e2e8f0'}}>{employee.phone}</div>
                </div>
                <div>
                  <div style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem'}}>Performance</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <div style={{width: '4rem', height: '0.5rem', backgroundColor: '#334155', borderRadius: '0.25rem', overflow: 'hidden'}}>
                      <div 
                        style={{height: '100%', backgroundColor: employee.performance > 80 ? '#4ade80' : employee.performance > 60 ? '#fbbf24' : '#ef4444', borderRadius: '0.25rem', width: `${employee.performance}%`}}
                      ></div>
                    </div>
                    <span style={{fontSize: '0.75rem', color: '#94a3b8'}}>{employee.performance}%</span>
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem'}}>Attendance</div>
                  <div style={{fontSize: '0.875rem', color: '#e2e8f0'}}>{employee.attendance}%</div>
                </div>
              </div>

              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                {employee.certifications.map((cert, index) => (
                  <span key={index} style={{padding: '0.25rem 0.5rem', backgroundColor: '#334155', borderRadius: '0.375rem', fontSize: '0.75rem', color: '#cbd5e1'}}>
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Department Overview */}
      <div style={{padding: '1.5rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
        <h3 style={{fontWeight: '600', color: '#f1f5f9', marginBottom: '1rem'}}>Department Overview</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
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
                <div style={{fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem'}}>{dept.name}</div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{deptStaff.length}</div>
                    <div style={{fontSize: '0.75rem', opacity: 0.9}}>Total Staff</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '1.125rem', fontWeight: 'bold'}}>{activeStaff}</div>
                    <div style={{fontSize: '0.75rem', opacity: 0.9}}>Active Now</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}