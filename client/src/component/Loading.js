import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
const Loading = () => {
  return (
    <div className='h-full'>
      <div className="flex justify-center items-center h-full">
        <CircularProgress color="secondary" size="3rem" className='my-10'/>
      </div>
    </div>

  )
}

export default Loading
