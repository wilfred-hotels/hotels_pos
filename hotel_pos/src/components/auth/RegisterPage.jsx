import React, { useState } from 'react';
import * as AuthAPI from '../../actions/auth';

export default function RegisterPage({ onRegistered }){
  const [hotel, setHotel] = useState({ name: '', address: '', city: '', country: '', phone: '', openingTime: '', closingTime: '', imageUrl: '', description: '', workersCount: 0 });
  const [user, setUser] = useState({ username: '', password: '', role: 'manager' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    try{
      const payload = { hotel, user };
      // backend register should accept combined payload and create hotel + user
      const res = await AuthAPI.register(payload);
      if (onRegistered) onRegistered(res);
    }catch(err){ setError(err); }
    finally{ setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-login bg-cover bg-center">
      <div className="max-w-2xl w-full bg-white/95 dark:bg-slate-800/95 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Create Hotel & Admin</h2>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input placeholder="Hotel name" className="input" value={hotel.name} onChange={e=>setHotel({...hotel, name: e.target.value})} required />
          <input placeholder="City" className="input" value={hotel.city} onChange={e=>setHotel({...hotel, city: e.target.value})} />
          <input placeholder="Address" className="input" value={hotel.address} onChange={e=>setHotel({...hotel, address: e.target.value})} />
          <input placeholder="Country" className="input" value={hotel.country} onChange={e=>setHotel({...hotel, country: e.target.value})} />
          <input placeholder="Phone" className="input" value={hotel.phone} onChange={e=>setHotel({...hotel, phone: e.target.value})} />
          <input placeholder="Opening Time (08:00)" className="input" value={hotel.openingTime} onChange={e=>setHotel({...hotel, openingTime: e.target.value})} />
          <input placeholder="Closing Time (22:00)" className="input" value={hotel.closingTime} onChange={e=>setHotel({...hotel, closingTime: e.target.value})} />
          <input placeholder="Image URL" className="input md:col-span-2" value={hotel.imageUrl} onChange={e=>setHotel({...hotel, imageUrl: e.target.value})} />
          <textarea placeholder="Description" className="input md:col-span-2" value={hotel.description} onChange={e=>setHotel({...hotel, description: e.target.value})} />
          <input placeholder="Workers Count" type="number" className="input" value={hotel.workersCount} onChange={e=>setHotel({...hotel, workersCount: Number(e.target.value)})} />

          <input placeholder="Admin username" className="input md:col-span-2" value={user.username} onChange={e=>setUser({...user, username: e.target.value})} required />
          <input placeholder="Password" type="password" className="input md:col-span-2" value={user.password} onChange={e=>setUser({...user, password: e.target.value})} required />

          {error && <div className="text-red-600 md:col-span-2">{error.message || String(error)}</div>}

          <div className="md:col-span-2 flex gap-2">
            <button className="btn btn-primary" disabled={loading}>{loading? 'Creating...':'Create Hotel & Admin'}</button>
            <button type="button" className="btn" onClick={()=>{ if (onRegistered) onRegistered(null); }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
