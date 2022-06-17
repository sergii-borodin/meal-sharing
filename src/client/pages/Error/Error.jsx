import React from 'react'
import { Link } from 'react-router-dom'
import './ErrorPageStyle.css'

export const Error = () => {
  return (
    <section className='error-page section'>
      <div className='error-container'>
        <h1>Page Not Found</h1>
        <Link to='/' className='btn btn-primary'>
          back home
        </Link>
      </div>
    </section>
  )
}
