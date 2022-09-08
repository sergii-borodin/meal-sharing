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
      <ul className='meal-description-container'>
        <li className='meal-description-item'>
          <span className='meal-description-title'>Description:</span>{' '}
          {description}
        </li>
        <li className='meal-description-item'>
          <span className='meal-description-title'>Price:</span> {price}
        </li>
        <li className='meal-description-item'>
          <span className='meal-description-title'>When:</span>{' '}
          {when.slice(0, 10)}
        </li>
        <li className='meal-description-item'>
          <span className='meal-description-title'>Location:</span> {location}
        </li>
        <li className='meal-description-item'>
          <span className='meal-description-title'>Max seats:</span>{' '}
          {max_reservations}
        </li>
        <li className='meal-description-item'>
          <span className='meal-description-title'>Seats left:</span>{' '}
          {available_reservation}
        </li>
      </ul>

      {available_reservation > 0 ? (
        <form
          className='reservation-form'
          action='https://localhost:5000/api/reservations/'
          method='post'
        >
          <h3>Fill out the form below to reserve seats:</h3>
          <input
            className='reservation-form-input'
            type='number'
            name='number_of_guests'
            id='number_of_guests'
            min={1}
            max={available_reservation}
            placeholder='Enter number of guests'
          />
          <input
            className='reservation-form-input'
            type='tel'
            name='contact_phonenumber'
            id='contact_phonenumber'
            placeholder='Enter contact phone number'
          />
          <input
            className='reservation-form-input'
            type='text'
            name='contact_name'
            id='contact_name'
            placeholder='Enter contact name'
          />
          <input
            className='reservation-form-input'
            type='email'
            name='contact_email'
            id='contact_email'
            placeholder='Enter contact email'
          />
          {/* "number_of_guests": 4, "created_date": "2022-04-25",
        "contact_phonenumber": "22222222", "contact_name": "Dennis",
      "contact_email": "dennis@mail.com", "meal_id": 71 */}
          <Button Children={'Make reservation'}></Button>
        </form>
      ) : (
        <div className='no-seats-message'>
          Sorry, no more available seats for this meal
        </div>
      )}
    </section>
  )
}
