const express = require('express')
const router = express.Router()
const knex = require('../database')

//GET. Returns all reservations
router.get('/', async (request, response) => {
  try {
    const reservations = await knex('reservations')
    response.json(reservations)
  } catch (error) {
    throw error
  }
})

//GET. Returns reservation by id
router.get('/:id', async (request, response) => {
  try {
    const reservationId = Number(request.params.id)
    if (isNaN(reservationId)) {
      response.status(400).json({
        error: "Reservation wasn't found.",
        hint: 'Id should be a number',
      })
      return
    } else {
      const reservations = await knex('reservations')
      const isFoundId = reservations.some(
        (reservation) => reservation.id === reservationId
      )
      if (!isFoundId) {
        response.status(400).json({
          error: "Reservation wasn't found.",
          hint: 'Reservation with this id does not exist',
        })
        return
      }
      const reservationById = await knex('meals')
        .select('*')
        .where({ id: reservationId })
      response.json(reservationById)
    }
  } catch (error) {
    throw error
  }
})

//POST.	Adds a new reservation
router.post('/', async (request, response) => {
  try {
    const context = request.body
    if (Object.keys(context).length === 0 || context === {}) {
      response.statusCode(422).json({ message: 'Bad input' })
      return
    }
    if (context.number_of_guests === '') {
      response.json({ message: 'Please, provide number of guests' })
      return
    }
    if (context.created_date === '') {
      response.json({ message: 'Please, provide date' })
      return
    }
    if (context.contact_phonenumber === '') {
      response.json({ message: 'Please, provide a phone number' })
      return
    }
    if (context.contact_name === '') {
      response.json({ message: 'Please, provide name' })
      return
    }
    if (context.contact_email === '') {
      response.json({ message: 'Please, provide email' })
      return
    }
    if (context.meal_id === '') {
      response.json({ message: 'Please, provide meal id' })
      return
    }
    const insertContext = await knex('reservations').insert(context)
    response.json(insertContext)
  } catch (error) {
    throw error
  }
})

// PUT.	Updates the reservation by id
router.put('/:id', async (request, response) => {
  try {
    const reservationId = Number(request.params.id)
    if (isNaN(reservationId)) {
      response.status(400).json({
        error: "Reservation wasn't changed.",
        hint: 'Id should be a number',
      })
      return
    } else {
      const reservations = await knex('reservations')
      const isFoundId = reservations.some(
        (reservation) => reservation.id === reservationId
      )
      if (!isFoundId) {
        response.status(400).json({
          error: "Reservation wasn't changed.",
          hint: 'Reservation with this id does not exist',
        })
        return
      }
      const context = request.body
      const updateContext = await knex('reservations')
        .where({ id: reservationId })
        .update(context)
      response.json(updateContext)
    }
  } catch (error) {
    throw error
  }
})

// DELETE.	Deletes the reservation by id
router.delete('/:id', async (request, response) => {
  try {
    const reservationId = Number(request.params.id)
    if (isNaN(reservationId)) {
      response.status(400).json({
        error: "Reservation wasn't deleted.",
        hint: 'Id should be a number',
      })
      return
    } else {
      const reservations = await knex('reservations')
      const isFoundId = reservations.some(
        (reservation) => reservation.id === reservationId
      )
      if (!isFoundId) {
        response.status(400).json({
          error: "Reservation wasn't deleted.",
          hint: 'Reservation with this id does not exist',
        })
        return
      }
      const deleteReservation = await knex('reservations')
        .where({ id: reservationId })
        .del()
      response.json(deleteReservation)
    }
  } catch (error) {
    throw error
  }
})

module.exports = router
