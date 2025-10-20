import React from 'react';

export default function StaffSection(){

  const options = {
  grid: [13, 13],
  from: 'center',
};

createTimeline()
  .add('.dot', {
    scale: stagger([1.1, .75], options),
    ease: 'inOutQuad',
  }, stagger(200, options));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Staff</h2>
      <p className="text-sm text-gray-500">Staff directory and schedules.</p>
      <div className=''></div>
      
    </div>
  )
}
