import React from 'react';

export default function ReservationsSection(){
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Reservations</h2>
        <button className="px-3 py-2 rounded bg-gradient-to-r from-teal-400 to-cyan-500 text-white">Book Room</button>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 h-96">Calendar (placeholder)</div>
    </div>
  )
}
