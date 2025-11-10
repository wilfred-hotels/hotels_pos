import React, { useState, useEffect } from 'react';
import AdminHeader from '../common/AdminHeader';

export default function RoomsSection() {
  const [loading, setLoading] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('grid'); // grid, list, analytics

  // Generate comprehensive room data
  const generateRoomData = () => {
    const roomTypes = [
      { type: 'Standard', category: 'standard', baseRate: 120, capacity: { adults: 2, children: 1 }, amenities: ['WiFi', 'TV', 'AC'] },
      { type: 'Deluxe', category: 'deluxe', baseRate: 180, capacity: { adults: 3, children: 2 }, amenities: ['WiFi', 'TV', 'AC', 'Balcony', 'Mini Bar'] },
      { type: 'Suite', category: 'suite', baseRate: 280, capacity: { adults: 4, children: 2 }, amenities: ['WiFi', 'TV', 'AC', 'Balcony', 'Mini Bar', 'Jacuzzi'] },
      { type: 'VIP Suite', category: 'vip', baseRate: 450, capacity: { adults: 4, children: 2 }, amenities: ['WiFi', 'TV', 'AC', 'Balcony', 'Mini Bar', 'Jacuzzi', 'Living Room', 'Ocean View'] },
      { type: 'Presidential', category: 'presidential', baseRate: 800, capacity: { adults: 6, children: 3 }, amenities: ['WiFi', 'TV', 'AC', 'Balcony', 'Mini Bar', 'Jacuzzi', 'Living Room', 'Dining Room', 'Kitchen', 'Butler Service'] }
    ];

    const statuses = ['available', 'occupied', 'maintenance', 'cleaning', 'inspected'];
    const floors = [1, 2, 3, 4, 5];
    
    let rooms = [];
    let roomNumber = 101;

    floors.forEach(floor => {
      roomTypes.forEach((roomType, typeIndex) => {
        for (let i = 0; i < 4; i++) {
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const isOccupied = status === 'occupied';
          
          rooms.push({
            id: roomNumber,
            number: roomNumber,
            type: roomType.type,
            category: roomType.category,
            floor: floor,
            status: status,
            rate: roomType.baseRate + (floor * 10),
            capacity: roomType.capacity,
            amenities: roomType.amenities,
            features: Math.random() > 0.7 ? ['Sea View'] : ['City View'],
            lastCleaned: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            maintenanceDue: Math.random() > 0.8 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
            currentGuest: isOccupied ? `Guest ${Math.floor(Math.random() * 1000)}` : null,
            checkInDate: isOccupied ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : null,
            checkOutDate: isOccupied ? new Date(Date.now() + Math.random() * 4 * 24 * 60 * 60 * 1000).toISOString() : null,
            housekeeping: {
              lastInspection: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
              nextInspection: new Date(Date.now() + Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
              staff: ['Alice', 'Bob', 'Charlie'][Math.floor(Math.random() * 3)]
            }
          });
          roomNumber++;
        }
      });
    });

    return rooms;
  };

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRooms(generateRoomData());
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter rooms based on current filters
  const filteredRooms = rooms.filter(room => {
    const matchesType = activeFilter === 'all' || room.category === activeFilter;
    const matchesFloor = floorFilter === 'all' || room.floor.toString() === floorFilter;
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesSearch = room.number.toString().includes(searchTerm) || 
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesFloor && matchesStatus && matchesSearch;
  });

  // Toggle room selection
  const toggleRoomSelection = (roomId) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  // Select all filtered rooms
  const selectAllRooms = () => {
    setSelectedRooms(filteredRooms.map(room => room.id));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedRooms([]);
  };

  // Bulk status update
  const updateBulkStatus = (newStatus) => {
    setRooms(prev => prev.map(room => 
      selectedRooms.includes(room.id) ? { ...room, status: newStatus } : room
    ));
    setSelectedRooms([]);
  };

  // Calculate metrics
  const metrics = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter(r => r.status === 'available').length,
    occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
    maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length,
    occupancyRate: ((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100).toFixed(1)
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
            <div key={i} style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '1rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', height: '6rem'}}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', color: '#e2e8f0'}}>
      <AdminHeader title="Rooms" subtitle="Manage room status & housekeeping" />
      {/* Header */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start'}}>
        <div>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            Rooms Management
          </h2>
          <p style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem'}}>
            Manage room status, housekeeping, and maintenance operations
          </p>
        </div>
        
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem'}}>
          <div style={{display: 'flex', backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '0.75rem', padding: '0.25rem', backdropFilter: 'blur(8px)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
            <button
              onClick={() => setView('grid')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s',
                ...(view === 'grid' 
                  ? {backgroundColor: '#8b5cf6', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'} 
                  : {color: '#cbd5e1', hover: {color: '#f1f5f9'}})
              }}
            >
              🏠 Grid
            </button>
            <button
              onClick={() => setView('list')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s',
                ...(view === 'list' 
                  ? {backgroundColor: '#8b5cf6', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'} 
                  : {color: '#cbd5e1', hover: {color: '#f1f5f9'}})
              }}
            >
              📋 List
            </button>
            <button
              onClick={() => setView('analytics')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s',
                ...(view === 'analytics' 
                  ? {backgroundColor: '#8b5cf6', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'} 
                  : {color: '#cbd5e1', hover: {color: '#f1f5f9'}})
              }}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Total Rooms</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#e2e8f0'}}>{metrics.totalRooms}</div>
          <div style={{fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.25rem'}}>All room types</div>
        </div>

        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Available</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80'}}>{metrics.availableRooms}</div>
          <div style={{fontSize: '0.75rem', color: '#86efac', marginTop: '0.25rem'}}>Ready for booking</div>
        </div>

        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Occupied</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#f87171'}}>{metrics.occupiedRooms}</div>
          <div style={{fontSize: '0.75rem', color: '#fca5a5', marginTop: '0.25rem'}}>Guests checked-in</div>
        </div>

        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Occupancy Rate</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#06b6d4'}}>{metrics.occupancyRate}%</div>
          <div style={{fontSize: '0.75rem', color: '#67e8f9', marginTop: '0.25rem'}}>Current utilization</div>
        </div>
      </div>

      {/* Bulk Selection Bar */}
      {selectedRooms.length > 0 && (
        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(139, 92, 246, 0.5)'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <div style={{width: '1.5rem', height: '1.5rem', backgroundColor: '#8b5cf6', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.875rem', fontWeight: '600'}}>
                {selectedRooms.length}
              </div>
              <span style={{fontWeight: '600', color: '#e2e8f0'}}>
                {selectedRooms.length} room{selectedRooms.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              <button
                onClick={() => updateBulkStatus('available')}
                style={{padding: '0.5rem 1rem', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'colors 0.3s', hover: {backgroundColor: 'rgba(34, 197, 94, 0.3)'}}}
              >
                Mark Available
              </button>
              <button
                onClick={() => updateBulkStatus('maintenance')}
                style={{padding: '0.5rem 1rem', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fde047', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'colors 0.3s', hover: {backgroundColor: 'rgba(245, 158, 11, 0.3)'}}}
              >
                Mark Maintenance
              </button>
              <button
                onClick={() => updateBulkStatus('cleaning')}
                style={{padding: '0.5rem 1rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'colors 0.3s', hover: {backgroundColor: 'rgba(59, 130, 246, 0.3)'}}}
              >
                Mark for Cleaning
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

      {/* Filters */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center'}}>
          <div style={{flex: '1', minWidth: '200px'}}>
            <input
              type="text"
              placeholder="Search by room number or type..."
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
                focus: {outline: 'none', ring: '2px', ringColor: 'rgba(139, 92, 246, 0.5)', borderColor: '#8b5cf6'},
                transition: 'all 0.3s'
              }}
            />
          </div>
          
          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            <button
              onClick={selectAllRooms}
              style={{padding: '0.5rem 1rem', backgroundColor: '#8b5cf6', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'colors 0.3s', hover: {backgroundColor: '#7c3aed'}}}
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
          {/* Room Type Filter */}
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>Room Type</label>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              {['all', 'standard', 'deluxe', 'suite', 'vip', 'presidential'].map(type => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s',
                    textTransform: 'capitalize',
                    ...(activeFilter === type 
                      ? {backgroundColor: '#8b5cf6', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'} 
                      : {backgroundColor: '#334155', color: '#cbd5e1', hover: {backgroundColor: '#475569'}})
                  }}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Floor Filter */}
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>Floor</label>
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#334155',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                color: '#e2e8f0',
                fontSize: '0.875rem',
                focus: {outline: 'none', ring: '2px', ringColor: 'rgba(139, 92, 246, 0.5)'},
                transition: 'all 0.3s'
              }}
            >
              <option value="all">All Floors</option>
              {[1, 2, 3, 4, 5].map(floor => (
                <option key={floor} value={floor.toString()}>Floor {floor}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#334155',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                color: '#e2e8f0',
                fontSize: '0.875rem',
                focus: {outline: 'none', ring: '2px', ringColor: 'rgba(139, 92, 246, 0.5)'},
                transition: 'all 0.3s'
              }}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="cleaning">Cleaning</option>
              <option value="inspected">Inspected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Grid View */}
      {view === 'grid' && (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem'}}>
          {filteredRooms.map(room => (
            <div 
              key={room.id}
              onClick={() => toggleRoomSelection(room.id)}
              style={{
                padding: '1.5rem',
                backgroundColor: selectedRooms.includes(room.id) ? 'rgba(139, 92, 246, 0.1)' : 'rgba(30, 41, 59, 0.8)',
                backdropFilter: 'blur(8px)',
                borderRadius: '1rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: selectedRooms.includes(room.id) ? '2px solid #8b5cf6' : '1px solid rgba(71, 85, 105, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                hover: {borderColor: '#8b5cf6', transform: 'translateY(-2px)'}
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
                    <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#f1f5f9'}}>Room {room.number}</div>
                    <div style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      ...(room.status === 'available' ? {backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac'} :
                        room.status === 'occupied' ? {backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5'} :
                        room.status === 'maintenance' ? {backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fde047'} :
                        room.status === 'cleaning' ? {backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd'} :
                        {backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe'})
                    }}>
                      {room.status}
                    </div>
                  </div>
                  <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>{room.type} • Floor {room.floor}</div>
                </div>
                
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#86efac'}}>KSh {room.rate}</div>
                  <div style={{fontSize: '0.75rem', color: '#cbd5e1'}}>per night</div>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
                <div>
                  <div style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem'}}>Capacity</div>
                  <div style={{fontSize: '0.875rem', color: '#e2e8f0'}}>
                    {room.capacity.adults} adults, {room.capacity.children} children
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem'}}>Housekeeping</div>
                  <div style={{fontSize: '0.875rem', color: '#e2e8f0'}}>{room.housekeeping.staff}</div>
                </div>
              </div>

              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                {room.amenities.slice(0, 4).map(amenity => (
                  <span key={amenity} style={{padding: '0.25rem 0.5rem', backgroundColor: '#334155', borderRadius: '0.375rem', fontSize: '0.75rem', color: '#cbd5e1'}}>
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 4 && (
                  <span style={{padding: '0.25rem 0.5rem', backgroundColor: '#334155', borderRadius: '0.375rem', fontSize: '0.75rem', color: '#cbd5e1'}}>
                    +{room.amenities.length - 4}
                  </span>
                )}
              </div>

              {room.currentGuest && (
                <div style={{marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.2)'}}>
                  <div style={{fontSize: '0.875rem', color: '#fca5a5'}}>
                    🏠 Occupied by {room.currentGuest}
                  </div>
                  <div style={{fontSize: '0.75rem', color: '#fecaca', marginTop: '0.25rem'}}>
                    Check-out: {room.checkOutDate ? new Date(room.checkOutDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Analytics View */}
      {view === 'analytics' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
            <div style={{padding: '1.5rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
              <h3 style={{fontWeight: '600', color: '#f1f5f9', marginBottom: '1rem'}}>Room Type Distribution</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                {['Standard', 'Deluxe', 'Suite', 'VIP Suite', 'Presidential'].map(type => {
                  const count = rooms.filter(r => r.type === type).length;
                  const percentage = ((count / rooms.length) * 100).toFixed(1);
                  return (
                    <div key={type} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{color: '#e2e8f0', fontSize: '0.875rem'}}>{type}</span>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <div style={{width: '8rem', height: '0.5rem', backgroundColor: '#334155', borderRadius: '0.25rem', overflow: 'hidden'}}>
                          <div style={{height: '100%', backgroundColor: '#8b5cf6', borderRadius: '0.25rem', width: `${percentage}%`}}></div>
                        </div>
                        <span style={{color: '#94a3b8', fontSize: '0.875rem', minWidth: '3rem', textAlign: 'right'}}>
                          {count} ({percentage}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{padding: '1.5rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
              <h3 style={{fontWeight: '600', color: '#f1f5f9', marginBottom: '1rem'}}>Status Overview</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                {[
                  {status: 'Available', color: '#4ade80', count: metrics.availableRooms},
                  {status: 'Occupied', color: '#f87171', count: metrics.occupiedRooms},
                  {status: 'Maintenance', color: '#fbbf24', count: metrics.maintenanceRooms},
                  {status: 'Cleaning', color: '#60a5fa', count: rooms.filter(r => r.status === 'cleaning').length},
                  {status: 'Inspected', color: '#c084fc', count: rooms.filter(r => r.status === 'inspected').length}
                ].map(item => (
                  <div key={item.status} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{width: '0.75rem', height: '0.75rem', backgroundColor: item.color, borderRadius: '50%'}}></div>
                      <span style={{color: '#e2e8f0', fontSize: '0.875rem'}}>{item.status}</span>
                    </div>
                    <span style={{color: '#94a3b8', fontSize: '0.875rem'}}>{item.count} rooms</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{padding: '1.5rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
            <h3 style={{fontWeight: '600', color: '#f1f5f9', marginBottom: '1rem'}}>Revenue by Room Type</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
              {['Standard', 'Deluxe', 'Suite', 'VIP Suite', 'Presidential'].map(type => {
                const roomType = rooms.find(r => r.type === type);
                const occupiedCount = rooms.filter(r => r.type === type && r.status === 'occupied').length;
                const dailyRevenue = occupiedCount * (roomType?.rate || 0);
                return (
                  <div key={type} style={{padding: '1rem', backgroundColor: '#334155', borderRadius: '0.75rem'}}>
                    <div style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem'}}>{type}</div>
                    <div style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#86efac'}}>KSh {dailyRevenue}</div>
                    <div style={{fontSize: '0.75rem', color: '#cbd5e1'}}>Daily revenue</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
