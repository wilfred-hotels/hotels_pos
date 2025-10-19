
import React, { useState, useEffect } from 'react';

export default function ReservationsSection() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('calendar');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedDates, setSelectedDates] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [bookingForm, setBookingForm] = useState({
    guest: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      idNumber: ''
    },
    stay: {
      adults: 1,
      children: 0,
      specialRequests: ''
    },
    payment: {
      method: 'mpesa',
      status: 'pending',
      amount: 0,
      depositRequired: true
    },
    selectedRoom: null
  });

  const generateData = () => {
    const roomTypes = ['Standard', 'Deluxe', 'Suite', 'VIP Suite'];
    const roomAmenities = {
      'Standard': ['WiFi', 'TV', 'AC'],
      'Deluxe': ['WiFi', 'TV', 'AC', 'Balcony', 'Mini Bar'],
      'Suite': ['WiFi', 'TV', 'AC', 'Balcony', 'Mini Bar', 'Jacuzzi', 'Living Room'],
      'VIP Suite': ['WiFi', 'TV', 'AC', 'Balcony', 'Mini Bar', 'Jacuzzi', 'Living Room', 'Kitchen', 'Ocean View']
    };

    const roomsData = [];
    for (let i = 1; i <= 20; i++) {
      const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      roomsData.push({
        id: i,
        number: `R${100 + i}`,
        type,
        capacity: {
          adults: type === 'Standard' ? 2 : type === 'Deluxe' ? 3 : 4,
          children: 2
        },
        amenities: roomAmenities[type],
        rate: type === 'Standard' ? 120 : type === 'Deluxe' ? 180 : type === 'Suite' ? 280 : 450,
        status: 'available',
        maintenance: false
      });
    }

    const reservationsData = [];
    const statuses = ['confirmed', 'checked-in', 'checked-out', 'pending', 'cancelled'];
    const guestNames = ['John Kamau', 'Sarah Mwangi', 'David Ochieng', 'Grace Wambui', 'Mike Otieno', 'Lucy Auma'];
    
    for (let i = 0; i < 15; i++) {
      const checkIn = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      const stayLength = Math.floor(Math.random() * 7) + 1;
      const checkOut = new Date(checkIn.getTime() + stayLength * 24 * 60 * 60 * 1000);
      const room = roomsData[Math.floor(Math.random() * roomsData.length)];
      
      reservationsData.push({
        id: `RES${1000 + i}`,
        guest: {
          name: guestNames[Math.floor(Math.random() * guestNames.length)],
          email: `guest${i}@email.com`,
          phone: `07${Math.floor(Math.random() * 90000000 + 10000000)}`
        },
        room: {
          number: room.number,
          type: room.type
        },
        dates: {
          checkIn: checkIn.toISOString().split('T')[0],
          checkOut: checkOut.toISOString().split('T')[0],
          nights: stayLength
        },
        status: statuses[Math.floor(Math.random() * statuses.length)],
        payment: {
          total: room.rate * stayLength,
          paid: Math.random() > 0.3,
          method: ['mpesa', 'cash', 'card'][Math.floor(Math.random() * 3)]
        },
        specialRequests: Math.random() > 0.7 ? 'Early check-in requested' : ''
      });
    }

    return { rooms: roomsData, reservations: reservationsData };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = generateData();
      setRooms(data.rooms);
      setReservations(data.reservations);
      setLoading(false);
    };
    loadData();
  }, []);

  const metrics = {
    todayCheckIns: reservations.filter(r => 
      r.dates.checkIn === new Date().toISOString().split('T')[0] && 
      ['confirmed', 'checked-in'].includes(r.status)
    ).length,
    todayCheckOuts: reservations.filter(r => 
      r.dates.checkOut === new Date().toISOString().split('T')[0] && 
      ['checked-in'].includes(r.status)
    ).length,
    occupancyRate: ((reservations.filter(r => 
      ['checked-in', 'confirmed'].includes(r.status)
    ).length / rooms.length) * 100).toFixed(1),
    pendingReservations: reservations.filter(r => r.status === 'pending').length
  };

  const availableRooms = rooms.filter(room => {
    const isBooked = reservations.some(reservation => 
      reservation.room.number === room.number &&
      reservation.status !== 'cancelled' &&
      (
        (selectedDates.checkIn >= reservation.dates.checkIn && selectedDates.checkIn < reservation.dates.checkOut) ||
        (selectedDates.checkOut > reservation.dates.checkIn && selectedDates.checkOut <= reservation.dates.checkOut) ||
        (selectedDates.checkIn <= reservation.dates.checkIn && selectedDates.checkOut >= reservation.dates.checkOut)
      )
    );
    return !isBooked && room.status === 'available' && !room.maintenance;
  });

  const nextStep = () => setBookingStep(prev => prev + 1);
  const prevStep = () => setBookingStep(prev => prev - 1);

  const handleRoomSelect = (room) => {
    const nights = Math.ceil((new Date(selectedDates.checkOut) - new Date(selectedDates.checkIn)) / (1000 * 60 * 60 * 24));
    setBookingForm(prev => ({
      ...prev,
      selectedRoom: room,
      payment: {
        ...prev.payment,
        amount: room.rate * nights
      }
    }));
    nextStep();
  };

  const processBooking = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newReservation = {
      id: `RES${1000 + reservations.length}`,
      guest: bookingForm.guest,
      room: {
        number: bookingForm.selectedRoom.number,
        type: bookingForm.selectedRoom.type
      },
      dates: {
        checkIn: selectedDates.checkIn,
        checkOut: selectedDates.checkOut,
        nights: Math.ceil((new Date(selectedDates.checkOut) - new Date(selectedDates.checkIn)) / (1000 * 60 * 60 * 24))
      },
      status: 'pending',
      payment: {
        total: bookingForm.payment.amount,
        paid: false,
        method: bookingForm.payment.method
      },
      specialRequests: bookingForm.stay.specialRequests
    };

    setReservations(prev => [newReservation, ...prev]);
    setShowBookingModal(false);
    setBookingStep(1);
    setBookingForm({
      guest: { firstName: '', lastName: '', email: '', phone: '', country: '', idNumber: '' },
      stay: { adults: 1, children: 0, specialRequests: '' },
      payment: { method: 'mpesa', status: 'pending', amount: 0, depositRequired: true },
      selectedRoom: null
    });
    setLoading(false);
  };

  if (loading && !showBookingModal) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem'}}>
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
        <div style={{height: '24rem', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '1rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
      </div>
    );
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', color: '#e2e8f0'}}>
      {/* Header */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start'}}>
        <div>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #5eead4, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            Reservations Management
          </h2>
          <p style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem'}}>
            Manage bookings, room allocations, and guest arrivals
          </p>
        </div>
        
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem'}}>
          <div style={{display: 'flex', backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '0.75rem', padding: '0.25rem', backdropFilter: 'blur(8px)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
            <button
              onClick={() => setView('calendar')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s',
                ...(view === 'calendar' 
                  ? {backgroundColor: '#0f766e', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'} 
                  : {color: '#cbd5e1', hover: {color: '#f1f5f9'}})
              }}
            >
              📅 Calendar
            </button>
            <button
              onClick={() => setView('list')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s',
                ...(view === 'list' 
                  ? {backgroundColor: '#0f766e', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'} 
                  : {color: '#cbd5e1', hover: {color: '#f1f5f9'}})
              }}
            >
              📋 List
            </button>
            <button
              onClick={() => setView('rooms')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s',
                ...(view === 'rooms' 
                  ? {backgroundColor: '#0f766e', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'} 
                  : {color: '#cbd5e1', hover: {color: '#f1f5f9'}})
              }}
            >
              🏨 Rooms
            </button>
          </div>
          
          <button 
            onClick={() => setShowBookingModal(true)}
            style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(to right, #0f766e, #0e7490)',
              color: 'white',
              borderRadius: '0.75rem',
              fontWeight: '500',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s',
              transform: 'scale(1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              hover: {background: 'linear-gradient(to right, #115e59, #155e75)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', transform: 'scale(1.05)'}
            }}
          >
            <span style={{fontSize: '1.125rem'}}>+</span> Book Room
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Today's Check-ins</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#22d3ee'}}>{metrics.todayCheckIns}</div>
          <div style={{fontSize: '0.75rem', color: '#67e8f9', marginTop: '0.25rem'}}>Guests arriving</div>
        </div>

        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Today's Check-outs</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#fdba74'}}>{metrics.todayCheckOuts}</div>
          <div style={{fontSize: '0.75rem', color: '#fdba74', marginTop: '0.25rem'}}>Guests departing</div>
        </div>

        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Occupancy Rate</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80'}}>{metrics.occupancyRate}%</div>
          <div style={{fontSize: '0.75rem', color: '#86efac', marginTop: '0.25rem'}}>Current capacity</div>
        </div>

        <div style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Pending Reservations</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#facc15'}}>{metrics.pendingReservations}</div>
          <div style={{fontSize: '0.75rem', color: '#fde047', marginTop: '0.25rem'}}>Awaiting confirmation</div>
        </div>
      </div>

      {/* Calendar View */}
      {view === 'calendar' && (
        <div style={{padding: '1.5rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h3 style={{fontWeight: '600', color: '#f1f5f9'}}>Reservation Calendar</h3>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <button style={{padding: '0.25rem 0.75rem', backgroundColor: '#334155', color: '#cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem'}}>Today</button>
              <button style={{padding: '0.25rem 0.75rem', backgroundColor: '#334155', color: '#cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem'}}>Week</button>
              <button style={{padding: '0.25rem 0.75rem', backgroundColor: '#0f766e', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem'}}>Month</button>
            </div>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '0.25rem', marginBottom: '1rem'}}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{padding: '0.5rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '500', color: '#94a3b8'}}>
                {day}
              </div>
            ))}
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '0.25rem'}}>
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - date.getDay() + i);
              const dateStr = date.toISOString().split('T')[0];
              const dayReservations = reservations.filter(r => 
                dateStr >= r.dates.checkIn && dateStr < r.dates.checkOut
              );
              
              return (
                <div 
                  key={i}
                  style={{
                    minHeight: '5rem',
                    padding: '0.5rem',
                    border: '1px solid',
                    borderRadius: '0.5rem',
                    ...(date.toDateString() === new Date().toDateString() 
                      ? {borderColor: '#0f766e', backgroundColor: 'rgba(13, 148, 136, 0.2)'} 
                      : {borderColor: '#475569', backgroundColor: 'rgba(30, 41, 59, 0.5)'})
                  }}
                >
                  <div style={{fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0'}}>
                    {date.getDate()}
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem'}}>
                    {dayReservations.slice(0, 2).map(res => (
                      <div 
                        key={res.id}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          ...(res.status === 'confirmed' ? {backgroundColor: 'rgba(59, 130, 246, 0.3)', color: '#93c5fd'} :
                            res.status === 'checked-in' ? {backgroundColor: 'rgba(34, 197, 94, 0.3)', color: '#86efac'} :
                            {backgroundColor: 'rgba(245, 158, 11, 0.3)', color: '#fde047'})
                        }}
                      >
                        {res.room.number} - {res.guest.name.split(' ')[0]}
                      </div>
                    ))}
                    {dayReservations.length > 2 && (
                      <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>
                        +{dayReservations.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div style={{backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)', overflow: 'hidden'}}>
          <div style={{padding: '1rem', borderBottom: '1px solid rgba(71, 85, 105, 0.5)'}}>
            <h3 style={{fontWeight: '600', color: '#f1f5f9'}}>All Reservations</h3>
            <p style={{fontSize: '0.875rem', color: '#94a3b8'}}>
              {reservations.length} reservations • {metrics.pendingReservations} pending confirmation
            </p>
          </div>

          <div style={{overflow: 'auto', maxHeight: '24rem'}}>
            <table style={{width: '100%'}}>
              <thead style={{backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)'}}>
                <tr>
                  <th style={{padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0'}}>Guest</th>
                  <th style={{padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0'}}>Room</th>
                  <th style={{padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0'}}>Dates</th>
                  <th style={{padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0'}}>Status</th>
                  <th style={{padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0'}}>Amount</th>
                  <th style={{padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id} style={{transition: 'colors 0.3s', borderBottom: '1px solid rgba(71, 85, 105, 0.5)', hover: {backgroundColor: 'rgba(51, 65, 85, 0.5)'}}}>
                    <td style={{padding: '1rem'}}>
                      <div style={{fontWeight: '500', color: '#f1f5f9'}}>{reservation.guest.name}</div>
                      <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>{reservation.guest.phone}</div>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <div style={{fontWeight: '500', color: '#f1f5f9'}}>{reservation.room.number}</div>
                      <div style={{fontSize: '0.875rem', color: '#94a3b8', textTransform: 'capitalize'}}>{reservation.room.type}</div>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <div style={{fontSize: '0.875rem', color: '#cbd5e1'}}>
                        {new Date(reservation.dates.checkIn).toLocaleDateString()} - {new Date(reservation.dates.checkOut).toLocaleDateString()}
                      </div>
                      <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>{reservation.dates.nights} nights</div>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        ...(reservation.status === 'confirmed' ? {backgroundColor: 'rgba(59, 130, 246, 0.3)', color: '#93c5fd'} :
                          reservation.status === 'checked-in' ? {backgroundColor: 'rgba(34, 197, 94, 0.3)', color: '#86efac'} :
                          reservation.status === 'checked-out' ? {backgroundColor: 'rgba(71, 85, 105, 0.3)', color: '#cbd5e1'} :
                          reservation.status === 'pending' ? {backgroundColor: 'rgba(245, 158, 11, 0.3)', color: '#fde047'} :
                          {backgroundColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5'})
                      }}>
                        {reservation.status === 'confirmed' && '✅ Confirmed'}
                        {reservation.status === 'checked-in' && '🏠 Checked-in'}
                        {reservation.status === 'checked-out' && '📤 Checked-out'}
                        {reservation.status === 'pending' && '⏳ Pending'}
                        {reservation.status === 'cancelled' && '❌ Cancelled'}
                      </span>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <div style={{fontWeight: '600', color: '#f1f5f9'}}>KSh {reservation.payment.total}</div>
                      <div style={{
                        fontSize: '0.75rem',
                        ...(reservation.payment.paid ? {color: '#86efac'} : {color: '#fca5a5'})
                      }}>
                        {reservation.payment.paid ? 'Paid' : 'Pending'}
                      </div>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button style={{padding: '0.25rem 0.75rem', backgroundColor: '#0f766e', hover: {backgroundColor: '#115e59'}, color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'colors 0.3s'}}>
                          View
                        </button>
                        {reservation.status === 'pending' && (
                          <button style={{padding: '0.25rem 0.75rem', backgroundColor: '#16a34a', hover: {backgroundColor: '#15803d'}, color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'colors 0.3s'}}>
                            Confirm
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rooms View */}
      {view === 'rooms' && (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem'}}>
          {rooms.map(room => (
            <div key={room.id} style={{padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem'}}>
                <div>
                  <div style={{fontWeight: 'bold', fontSize: '1.125rem', color: '#f1f5f9'}}>{room.number}</div>
                  <div style={{fontSize: '0.875rem', color: '#94a3b8', textTransform: 'capitalize'}}>{room.type}</div>
                </div>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  ...(room.status === 'available' ? {backgroundColor: 'rgba(34, 197, 94, 0.3)', color: '#86efac'} :
                    room.status === 'occupied' ? {backgroundColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5'} :
                    {backgroundColor: 'rgba(245, 158, 11, 0.3)', color: '#fde047'})
                }}>
                  {room.status}
                </span>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                  <span style={{color: '#cbd5e1'}}>Capacity:</span>
                  <span style={{fontWeight: '500', color: '#e2e8f0'}}>{room.capacity.adults} adults, {room.capacity.children} children</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                  <span style={{color: '#cbd5e1'}}>Rate:</span>
                  <span style={{fontWeight: '500', color: '#86efac'}}>KSh {room.rate}/night</span>
                </div>
              </div>

              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem'}}>
                {room.amenities.slice(0, 3).map(amenity => (
                  <span key={amenity} style={{padding: '0.25rem 0.5rem', backgroundColor: '#334155', borderRadius: '0.25rem', fontSize: '0.75rem', color: '#cbd5e1'}}>
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 3 && (
                  <span style={{padding: '0.25rem 0.5rem', backgroundColor: '#334155', borderRadius: '0.25rem', fontSize: '0.75rem', color: '#cbd5e1'}}>
                    +{room.amenities.length - 3}
                  </span>
                )}
              </div>

              <button 
                onClick={() => {
                  setSelectedDates({
                    checkIn: new Date().toISOString().split('T')[0],
                    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                  });
                  setShowBookingModal(true);
                  setBookingForm(prev => ({ ...prev, selectedRoom: room }));
                }}
                disabled={room.status !== 'available' || room.maintenance}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: room.status === 'available' && !room.maintenance ? '#0f766e' : '#475569',
                  hover: {backgroundColor: room.status === 'available' && !room.maintenance ? '#115e59' : '#475569'},
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  transition: 'colors 0.3s'
                }}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div style={{position: 'fixed', inset: '0', backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: '50'}}>
          <div style={{backgroundColor: '#1e293b', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', width: '100%', maxWidth: '56rem', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #475569'}}>
            <div style={{padding: '1.5rem', borderBottom: '1px solid #475569'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#f1f5f9'}}>
                  {bookingStep === 1 && 'Select Room & Dates'}
                  {bookingStep === 2 && 'Guest Information'}
                  {bookingStep === 3 && 'Stay Details'}
                  {bookingStep === 4 && 'Payment & Confirmation'}
                </h3>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  style={{color: '#94a3b8', hover: {color: '#e2e8f0'}}}
                >
                  ✕
                </button>
              </div>
              
              {/* Progress Steps */}
              <div style={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  {[1, 2, 3, 4].map(step => (
                    <React.Fragment key={step}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        ...(step === bookingStep ? {backgroundColor: '#0f766e', color: 'white'} :
                          step < bookingStep ? {backgroundColor: '#16a34a', color: 'white'} :
                          {backgroundColor: '#475569', color: '#94a3b8'})
                      }}>
                        {step < bookingStep ? '✓' : step}
                      </div>
                      {step < 4 && (
                        <div style={{
                          width: '3rem',
                          height: '0.25rem',
                          ...(step < bookingStep ? {backgroundColor: '#16a34a'} : {backgroundColor: '#475569'})
                        }}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div style={{padding: '1.5rem'}}>
              {/* Step 1: Room Selection */}
              {bookingStep === 1 && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        value={selectedDates.checkIn}
                        onChange={(e) => setSelectedDates(prev => ({ ...prev, checkIn: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#334155',
                          border: '1px solid #475569',
                          borderRadius: '0.75rem',
                          color: '#e2e8f0',
                          focus: {outline: 'none', ring: '2px', ringColor: 'rgba(13, 148, 136, 0.5)', borderColor: '#0f766e'},
                          transition: 'all 0.3s'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        value={selectedDates.checkOut}
                        onChange={(e) => setSelectedDates(prev => ({ ...prev, checkOut: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#334155',
                          border: '1px solid #475569',
                          borderRadius: '0.75rem',
                          color: '#e2e8f0',
                          focus: {outline: 'none', ring: '2px', ringColor: 'rgba(13, 148, 136, 0.5)', borderColor: '#0f766e'},
                          transition: 'all 0.3s'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 style={{fontWeight: '600', color: '#f1f5f9', marginBottom: '1rem'}}>
                      Available Rooms ({availableRooms.length})
                    </h4>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem', maxHeight: '24rem', overflowY: 'auto'}}>
                      {availableRooms.map(room => (
                        <div 
                          key={room.id}
                          style={{
                            border: '2px solid #475569',
                            borderRadius: '0.75rem',
                            padding: '1rem',
                            hover: {borderColor: '#0f766e'},
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            backgroundColor: '#334155'
                          }}
                          onClick={() => handleRoomSelect(room)}
                        >
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem'}}>
                            <div>
                              <div style={{fontWeight: 'bold', color: '#f1f5f9'}}>{room.number}</div>
                              <div style={{fontSize: '0.875rem', color: '#94a3b8', textTransform: 'capitalize'}}>{room.type}</div>
                            </div>
                            <div style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#86efac'}}>
                              KSh {room.rate}
                            </div>
                          </div>
                          <div style={{fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '0.5rem'}}>
                            {room.capacity.adults} adults, {room.capacity.children} children
                          </div>
                          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.25rem'}}>
                            {room.amenities.slice(0, 3).map(amenity => (
                              <span key={amenity} style={{padding: '0.25rem 0.5rem', backgroundColor: '#475569', borderRadius: '0.25rem', fontSize: '0.75rem', color: '#cbd5e1'}}>
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Guest Information */}
              {bookingStep === 2 && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                        First Name
                      </label>
                      <input
                        type="text"
                        value={bookingForm.guest.firstName}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          guest: { ...prev.guest, firstName: e.target.value }
                        }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#334155',
                          border: '1px solid #475569',
                          borderRadius: '0.75rem',
                          color: '#e2e8f0',
                          focus: {outline: 'none', ring: '2px', ringColor: 'rgba(13, 148, 136, 0.5)', borderColor: '#0f766e'},
                          transition: 'all 0.3s'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={bookingForm.guest.lastName}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          guest: { ...prev.guest, lastName: e.target.value }
                        }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#334155',
                          border: '1px solid #475569',
                          borderRadius: '0.75rem',
                          color: '#e2e8f0',
                          focus: {outline: 'none', ring: '2px', ringColor: 'rgba(13, 148, 136, 0.5)', borderColor: '#0f766e'},
                          transition: 'all 0.3s'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={bookingForm.guest.email}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          guest: { ...prev.guest, email: e.target.value }
                        }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#334155',
                          border: '1px solid #475569',
                          borderRadius: '0.75rem',
                          color: '#e2e8f0',
                          focus: {outline: 'none', ring: '2px', ringColor: 'rgba(13, 148, 136, 0.5)', borderColor: '#0f766e'},
                          transition: 'all 0.3s'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={bookingForm.guest.phone}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          guest: { ...prev.guest, phone: e.target.value }
                        }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#334155',
                          border: '1px solid #475569',
                          borderRadius: '0.75rem',
                          color: '#e2e8f0',
                          focus: {outline: 'none', ring: '2px', ringColor: 'rgba(13, 148, 136, 0.5)', borderColor: '#0f766e'},
                          transition: 'all 0.3s'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                    <button
                      onClick={prevStep}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#475569',
                        hover: {backgroundColor: '#64748b'},
                        color: '#e2e8f0',
                        borderRadius: '0.75rem',
                        fontWeight: '500',
                        transition: 'colors 0.3s'
                      }}
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!bookingForm.guest.firstName || !bookingForm.guest.lastName || !bookingForm.guest.email || !bookingForm.guest.phone}
                      style={{
                        flex: '1',
                        padding: '0.75rem',
                        backgroundColor: !bookingForm.guest.firstName || !bookingForm.guest.lastName || !bookingForm.guest.email || !bookingForm.guest.phone ? '#64748b' : '#0f766e',
                        hover: {backgroundColor: !bookingForm.guest.firstName || !bookingForm.guest.lastName || !bookingForm.guest.email || !bookingForm.guest.phone ? '#64748b' : '#115e59'},
                        color: 'white',
                        borderRadius: '0.75rem',
                        fontWeight: '500',
                        transition: 'colors 0.3s'
                      }}
                    >
                      Continue to Stay Details
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Stay Details */}
              {bookingStep === 3 && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                        Number of Adults
                      </label>
                      <select
                        value={bookingForm.stay.adults}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          stay: { ...prev.stay, adults: parseInt(e.target.value) }
                        }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#334155',
                          border: '1px solid #475569',
                          borderRadius: '0.75rem',
                          color: '#e2e8f0',
                          focus: {outline: 'none', ring: '2px', ringColor: 'rgba(13, 148, 136, 0.5)'},
                          transition: 'all 0.3s'
                        }}
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                        Number of Children
                      </label>
                      <select
                        value={bookingForm.stay.children}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          stay: { ...prev.stay, children: parseInt(e.target.value) }
                        }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#334155',
                          border: '1px solid #475569',
                          borderRadius: '0.75rem',
                          color: '#e2e8f0',
                          focus: {outline: 'none', ring: '2px', ringColor: 'rgba(13, 148, 136, 0.5)'},
                          transition: 'all 0.3s'
                        }}
                      >
                        {[0, 1, 2, 3].map(num => (
                          <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                      Special Requests
                    </label>
                    <textarea
                      value={bookingForm.stay.specialRequests}
                      onChange={(e) => setBookingForm(prev => ({
                        ...prev,
                        stay: { ...prev.stay, specialRequests: e.target.value }
                      }))}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        borderRadius: '0.75rem',
                        color: '#e2e8f0',
                        focus: {outline: 'none', ring: '2px', ringColor: 'rgba(13, 148, 136, 0.5)', borderColor: '#0f766e'},
                        transition: 'all 0.3s'
                      }}
                      placeholder="Any special requests or preferences..."
                    />
                  </div>

                  <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                    <button
                      onClick={prevStep}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#475569',
                        hover: {backgroundColor: '#64748b'},
                        color: '#e2e8f0',
                        borderRadius: '0.75rem',
                        fontWeight: '500',
                        transition: 'colors 0.3s'
                      }}
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      style={{
                        flex: '1',
                        padding: '0.75rem',
                        backgroundColor: '#0f766e',
                        hover: {backgroundColor: '#115e59'},
                        color: 'white',
                        borderRadius: '0.75rem',
                        fontWeight: '500',
                        transition: 'colors 0.3s'
                      }}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Payment & Confirmation */}
              {bookingStep === 4 && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div style={{padding: '1rem', backgroundColor: '#334155', borderRadius: '0.75rem'}}>
                    <h4 style={{fontWeight: '600', color: '#f1f5f9', marginBottom: '0.75rem'}}>Booking Summary</h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span style={{color: '#cbd5e1'}}>Room:</span>
                        <span style={{fontWeight: '500', color: '#e2e8f0'}}>{bookingForm.selectedRoom?.number} - {bookingForm.selectedRoom?.type}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span style={{color: '#cbd5e1'}}>Dates:</span>
                        <span style={{fontWeight: '500', color: '#e2e8f0'}}>
                          {selectedDates.checkIn} to {selectedDates.checkOut} 
                          ({Math.ceil((new Date(selectedDates.checkOut) - new Date(selectedDates.checkIn)) / (1000 * 60 * 60 * 24))} nights)
                        </span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span style={{color: '#cbd5e1'}}>Guests:</span>
                        <span style={{fontWeight: '500', color: '#e2e8f0'}}>
                          {bookingForm.stay.adults} adult{bookingForm.stay.adults > 1 ? 's' : ''}
                          {bookingForm.stay.children > 0 && `, ${bookingForm.stay.children} child${bookingForm.stay.children > 1 ? 'ren' : ''}`}
                        </span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 'bold', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #475569'}}>
                        <span style={{color: '#f1f5f9'}}>Total Amount:</span>
                        <span style={{color: '#86efac'}}>KSh {bookingForm.payment.amount}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                      Payment Method
                    </label>
                    <select
                      value={bookingForm.payment.method}
                      onChange={(e) => setBookingForm(prev => ({
                        ...prev,
                        payment: { ...prev.payment, method: e.target.value }
                      }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        borderRadius: '0.75rem',
                        color: '#e2e8f0',
                        focus: {outline: 'none', ring: '2px', ringColor: 'rgba(13, 148, 136, 0.5)'},
                        transition: 'all 0.3s'
                      }}
                    >
                      <option value="mpesa">M-Pesa</option>
                      <option value="cash">Cash</option>
                      <option value="card">Credit Card</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>

                  <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                    <button
                      onClick={prevStep}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#475569',
                        hover: {backgroundColor: '#64748b'},
                        color: '#e2e8f0',
                        borderRadius: '0.75rem',
                        fontWeight: '500',
                        transition: 'colors 0.3s'
                      }}
                    >
                      Back
                    </button>
                    <button
                      onClick={processBooking}
                      style={{
                        flex: '1',
                        padding: '0.75rem',
                        background: 'linear-gradient(to right, #0f766e, #0e7490)',
                        hover: {background: 'linear-gradient(to right, #115e59, #155e75)'},
                        color: 'white',
                        borderRadius: '0.75rem',
                        fontWeight: '500',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        hover: {boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'},
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {loading ? (
                        <>
                          <div style={{width: '1rem', height: '1rem', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '9999px', animation: 'spin 1s linear infinite'}}></div>
                          Processing Booking...
                        </>
                      ) : (
                        <>
                          ✅ Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}