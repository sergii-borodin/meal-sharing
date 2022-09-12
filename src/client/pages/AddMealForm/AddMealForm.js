import React, { useState, useContext } from 'react'
import { MealsContext } from '../../context'

import './AddMealFormStyle.css'
import '../../components/Button/ButtonStyle.css'

export const AddMealForm = () => {
  const { getTodayDate } = useContext(MealsContext)
  const [eventDate, setEventDate] = useState(getTodayDate())

  function addNewMeal(e) {
    e.preventDefault()
    console.log('title', e.target.title.value)
    console.log('description', e.target.description.value)
    console.log('location', e.target.location.value)
    console.log('when', eventDate)
    console.log('max_reservations', e.target.max_reservations.value)
    console.log('price', e.target.price.value)
    console.log('created_date', getTodayDate())

    fetch('api/meals', {
      method: 'POST',
      body: JSON.stringify({
        title: e.target.title.value,
        description: e.target.description.value,
        location: e.target.location.value,
        when: eventDate,
        max_reservations: e.target.max_reservations.value,
        price: e.target.price.value,
        created_date: getTodayDate(),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((result) => {
      result.ok
        ? alert('Meal added!')
        : alert('Something went wrong. Please, try again')
    })
  }
  const onSetDateHandler = (e) => setEventDate(e.target.value)

  return (
    <>
      <h1 className='title'>Add a new meal-sharing event</h1>
      <form onSubmit={addNewMeal} className='form'>
        <input
          className='form-input'
          type='text'
          name='title'
          placeholder='Enter meal title'
          required
        />
        <input
          className='form-input'
          name='description'
          type='text'
          maxLength={100}
          placeholder='Enter meal description'
          required
        />
        <input
          className='form-input'
          name='location'
          type='text'
          placeholder='Enter event address'
          required
        />
        <input
          className='form-input'
          name='when'
          type='date'
          value={eventDate}
          min={getTodayDate()}
          onChange={onSetDateHandler}
          required
        />
        <input
          className='form-input'
          name='max_reservations'
          type='number'
          min='1'
          placeholder='Enter max number of participants'
          required
        />
        <input
          className='form-input'
          name='price'
          type='number'
          min='0.00'
          step='0.01'
          placeholder='Enter price in DKK'
          required
        />
        <button type='submit' className='btn-one'>
          Add meal
        </button>
      </form>
    </>
  )
}
