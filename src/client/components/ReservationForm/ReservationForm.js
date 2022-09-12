import React, { useState } from 'react'
import './ReservationFormStyle.css'

export const ReservationForm = ({ setIsFormOpen, isFormOpen }) => {
  setIsFormOpen(true)
  if (isFormOpen) {
    return (
      <>
        <h1 className='title'>Add a new meal-sharing event</h1>
        <form action='/somewhere_else' className='form-container'>
          <input type='text' placeholder='Enter meal title' />
          <input type='text' placeholder='Enter event address' />
          <input type='date' />
          <input type='text' placeholder='Enter max number of participants' />
          <input type='number' name='' id='' />
        </form>
      </>
    )
  }
  return <div>false</div>
}
