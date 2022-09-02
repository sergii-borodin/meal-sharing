import React from 'react'
import { useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MealsContext } from '../../context'
import { Button } from '../../components/Button/Button'

import './SingleMealDetailStyle.css'

export function SingleMealDetail() {
  const { meals } = useContext(MealsContext)
  const { id } = useParams()
  const mealId = Number(id)
  const currentMeal = meals.find((meal) => meal.id === mealId)
  const {
    title,
    description,
    location,
    when,
    price,
    available_reservation,
    max_reservations,
  } = currentMeal
  return (
    <section>
      <Link to='/'>
        <Button Children={'Back to main'}></Button>
      </Link>
      <h2 className='section-title'>{title}</h2>
      <ul className='detail-container'>
        <li>Description: {description}</li>
        <li>Price: {price}</li>
        <li>When: {when.slice(0, 10)}</li>
        <li>Location: {location}</li>
        <li>Max seats: {max_reservations}</li>
        <li>Seats left: {available_reservation}</li>
      </ul>
      <Button Children={'Make reservation'}></Button>
      <form action='https://localhost:5000/api/reservations/' method='post'>
        <input
          type='number'
          name='number_of_guests'
          id='number_of_guests'
          placeholder='Enter number of guests'
        />
        <input
          type='tel'
          name='contact_phonenumber'
          id='contact_phonenumber'
          placeholder='Enter contact phone number'
        />
        <input
          type='text'
          name='contact_name'
          id='contact_name'
          placeholder='Enter contact name'
        />
        <input
          type='email'
          name='contact_email'
          id='contact_email'
          placeholder='Enter contact email'
        />
        {/* "number_of_guests": 4, "created_date": "2022-04-25",
        "contact_phonenumber": "22222222", "contact_name": "Dennis",
        "contact_email": "dennis@mail.com", "meal_id": 71 */}
      </form>
    </section>
  )
}
