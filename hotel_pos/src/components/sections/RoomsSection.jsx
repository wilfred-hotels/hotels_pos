import React from 'react';

const RoomCard = ({num, type, status}) => (
  <div className="p-3 rounded-lg shadow bg-white dark:bg-slate-800">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold">Room {num}</div>
        <div className="text-sm text-gray-400">{type}</div>
      </div>
      <div className={`px-2 py-1 rounded ${status==='Occupied'?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>{status}</div>
    </div>
  </div>
);

export default function RoomsSection(){
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button className="px-3 py-2 rounded bg-slate-100 dark:bg-slate-700">All</button>
        <button className="px-3 py-2 rounded">Deluxe</button>
        <button className="px-3 py-2 rounded">Suite</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <RoomCard num={101} type="Deluxe" status="Available" />
        <RoomCard num={102} type="Standard" status="Occupied" />
        <RoomCard num={201} type="Suite" status="Available" />
      </div>
    </div>
  )
}
