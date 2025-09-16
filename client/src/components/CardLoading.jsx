import React from 'react';

const CardLoading = () => {
  return (
    <div className='border lg:p-4 py-2 grid gap-2 lg:gap-3 min-w-36 lg:min-w-52 rounded mx-auto cursor-pointer bg-white animate-pulse
    '>
      <div className='min-h-24 bg-blue-50 rounded '>
        
      </div>
      <div className='p-2 lg:p-3 bg-blue-50 rounded w-20'>

      </div>
      <div className='p-2 lg:p-3 bg-blue-50 rounded '>

      </div>
      <div className='p-2 lg:p-3 bg-blue-50 rounded w-14'>

      </div>
      <div className='flex items-center justify-between gap-3'>
        <div className='p-2 lg:p-3 bg-blue-50 rounded w-20'>

        </div>
        <div className='p-2 lg:p-3 bg-blue-50 rounded w-20'>

        </div>
      </div>
    </div>
  );
};

export default CardLoading;