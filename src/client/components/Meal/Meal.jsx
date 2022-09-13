import React, { Children } from 'react'
import { Link } from 'react-router-dom'
import img0 from '../../assets/images/image0.png'
import img1 from '../../assets/images/image1.png'
import img2 from '../../assets/images/image2.png'
import img3 from '../../assets/images/image3.png'
import img4 from '../../assets/images/image4.png'
import img5 from '../../assets/images/image5.png'
import img6 from '../../assets/images/image6.png'
import img7 from '../../assets/images/image7.png'
import img8 from '../../assets/images/image8.png'
import img9 from '../../assets/images/image9.png'
import img10 from '../../assets/images/image10.png'
import './MealStyle.css'
import { Button } from '../Button/Button'

export const Meal = ({
  id,
  title,
  when,
  location,
  price,
  available_reservation,
}) => {
  const images = [
    img0,
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
  ]
  const theRandomNumber = Math.floor(Math.random() * 10) + 1
  return (
    <article className='meal'>
      <div className='img-container'>
        <img
          src={images[theRandomNumber]}
          alt='a meal sharing example'
          height='200px'
        />
        <ul className='meal-description'>
          <li className='meal-title'>
            {title.length < 18 ? title : title.slice(0, 15)}...
          </li>
          <li className='meal-description'>&#128176; : {price} DKK </li>
          <li className='meal-description'>&#128197; : {when.slice(0, 10)}</li>
          <li className='meal-description'>
            &#128205; :{' '}
            {location.length < 15 ? location : location.slice(0, 15)}...
          </li>
          <li className='meal-description'>
            &#128186; : {available_reservation} seats left
          </li>
          <Link to={`/meal/${id}`}>
            <Button Children={'Details'}></Button>
          </Link>
        </ul>
      </div>
    </article>
  )
}

// const theRandomNumber = Math.floor(Math.random() * 10) + 1
