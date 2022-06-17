import React from 'react'
import { Link } from 'react-router-dom'
import './NavbarStyle.css'

export const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='nav-center'>
        <Link to='/'>
          <h1>MEAL-SHARING</h1>
        </Link>
        <ul className='nav-links'>
          <li>
            <Link to='/'>HOME</Link>
          </li>
          <li>
            <Link to='/about'>ABOUT</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
