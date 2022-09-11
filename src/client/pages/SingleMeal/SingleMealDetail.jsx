import React from 'react'
import { useContext, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MealsContext } from '../../context'
import { Button } from '../../components/Button/Button'

import './SingleMealDetailStyle.css'

export function SingleMealDetail() {
  const { meals, getTodayDate } = useContext(MealsContext)

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

  function makeReservation(e) {
    e.preventDefault()
    console.log('number_of_guests', e.target.number_of_guests.value)
    console.log('created_date', getTodayDate())
    console.log('contact_phonenumber', e.target.contact_phonenumber.value)
    console.log('contact_name', e.target.contact_name.value)
    console.log('contact_email', e.target.contact_email.value)
    console.log('meal_id', mealId)

    fetch('api/reservations', {
      method: 'POST',
      body: JSON.stringify({
        number_of_guests: e.target.number_of_guests.value,
        created_date: getTodayDate(),
        contact_phonenumber: e.target.contact_phonenumber.value,
        contact_name: e.target.contact_name.value,
        contact_email: e.target.contact_email.value,
        meal_id: mealId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((result) => {
      result.ok
        ? alert('Reservation made successfully')
        : alert('Something went wrong. Please, try again')
    })
  }

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
        <form className='form' onSubmit={makeReservation}>
          <h3>Fill out the form to reserve seats:</h3>
          <input
            className='form-input'
            type='number'
            name='number_of_guests'
            min='1'
            max={available_reservation}
            placeholder='Enter number of guests'
            required
          />
          <input
            className='form-input'
            type='tel'
            name='contact_phonenumber'
            placeholder='Enter contact phone number'
            required
          />
          <input
            className='form-input'
            type='text'
            name='contact_name'
            placeholder='Enter contact name'
            required
          />
          <input
            className='form-input'
            type='email'
            name='contact_email'
            placeholder='Enter contact email'
            required
          />
          <button type='submit'>Make reservation</button>
        </form>
      ) : (
        <div className='no-seats-message'>
          Sorry, no more available seats for this meal
        </div>
      )}
    </section>
  )
}
