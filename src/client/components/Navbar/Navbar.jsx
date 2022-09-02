import React from 'react'
import { Link } from 'react-router-dom'
import './NavbarStyle.css'

export const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='nav-center'>
        <Link to='/'>
          <h2>MEAL-SHARING</h2>
        </Link>
        <ul className='nav-links'>
          <li>
            <Link to='/'>HOME</Link>
          </li>
          <li>
            <Link to='/form'>ADD MEAL</Link>
          </li>
          <li>
            <Link to='/about'>ABOUT</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
