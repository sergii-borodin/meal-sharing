import React from 'react'
import { Link } from 'react-router-dom'
import './FooterStyle.css'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import { color } from '@mui/system'

export const Footer = () => {
  return (
    <>
      <footer className='footer'>
        <div className='footerLogo footerItemGeneralStyling'>
          <Link to='/'>
            <h2>MEAL-SHARING</h2>
          </Link>
        </div>
        <div className='footerContacts footerItemGeneralStyling'>
          <p>Contact us:</p>
          <a href='tel:+4553331265' className='contactLink'>
            <span>+45 53 33 12 65</span>
          </a>
          <a href='mailto:sergii.borodin@yahoo.com' className='contactLink'>
            <span>sergii.borodin@yahoo.com</span>
          </a>
        </div>
        <div className='footerSocialLinks footerItemGeneralStyling'>
          <FacebookIcon
            fontSize='large'
            sx={{
              '&:hover': {
                color: 'darkgray',
              },
            }}
          />
          <TwitterIcon
            fontSize='large'
            sx={{
              '&:hover': {
                color: 'darkgray',
              },
            }}
          />
          <InstagramIcon
            fontSize='large'
            sx={{
              '&:hover': {
                color: 'darkgray',
              },
            }}
          />
        </div>
      </footer>
    </>
  )
}
