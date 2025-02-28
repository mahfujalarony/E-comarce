import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const HomePage = () => {
  return (
    <div>
      <h1>HomePage</h1>
      <h1><Link to='/create'>Create</Link></h1>
      <h1><Link to='/login'>login</Link></h1>
      <h1><Link to='/register'>register</Link></h1>
      <h1><Link to='/get'>Get Product</Link></h1>
    </div>
  )
}

export default HomePage
