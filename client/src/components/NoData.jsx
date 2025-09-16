import React from 'react';
import noData from "../assets/nothing.jpg"

const NoData = () => {
  return (
    <div className='flex flex-col items-center justify-center p-4 gap-2'>
      <img src={noData}
      alt='no data'
      className='w-36'/>
      <p className='text-neutral-500'>No data</p>
    </div>
  );
};

export default NoData;