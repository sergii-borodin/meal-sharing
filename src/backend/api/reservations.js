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
      const reservationByIdCheck = await knex('reservations')
        .select('*')
        .where({ id: reservationId })
      if (reservationByIdCheck.length === 0) {
        response.status(400).json({
          error: "Reservation wasn't found.",
          hint: `Reservation with id of ${reservationId} does not exist`,
        })
        return
      }
      const reservationByIdFound = await knex('reservations')
        .select('*')
        .where({ id: reservationId })
      response.json(reservationByIdFound)
    }
  } catch (error) {
    throw error
  }
})

//POST.	Adds a new reservation. Check available seats implemented
router.post('/', async (request, response) => {
  try {
    const context = request.body
    const requiredParams = [
      'number_of_guests',
      'created_date',
      'contact_phonenumber',
      'contact_name',
      'contact_email',
      'meal_id',
    ]
    console.log('context', context)
    const numberOfGuests = Number(context.number_of_guests)
    const mealId = Number(context.meal_id)
    console.log('mealId', mealId)

    console.log('numberOfGuests', numberOfGuests)

    meal = await knex('meals')
      .select(
        'meals.id',
        'meals.title',
        'meals.description',
        'meals.location',
        'meals.when',
        'meals.created_date',
        'meals.price',
        'meals.max_reservations',
        knex.raw(
          '(meals.max_reservations-COALESCE(SUM(reservations.number_of_guests),0)) as available_reservation'
        )
      )
      .where('meals.id', '=', mealId)
      .leftJoin('reservations', 'meals.id', '=', 'reservations.meal_id')
    const currentMeal = meal[0]
    const avRes = currentMeal.available_reservation
    console.log('currentMeal', currentMeal)
    console.log('avRes', avRes)

    if (Object.keys(context).length === requiredParams.length) {
      if (Number(avRes) < numberOfGuests) {
        response.status(200).json({
          message: `Sorry. Not enough available seats on ${currentMeal.title}. It has ${avRes} available seats`,
        })
      } else {
        const insertContext = await knex('reservations').insert(context)
        response.send(`Thanks for your reservation`).json(insertContext)
      }
    } else {
      requiredParams.map((param) => {
        if (context[param] === '' || context[param] === undefined) {
          response.status(422).json({
            message: 'Bad input',
            hint: `Please, provide ${param}`,
          })
        }
      })
    }
  } catch (error) {
    throw error
  }
})

// PUT.	Updates the reservation by id. Checked if new amount of guests is not higher than max reservations
router.put('/:id', async (request, response) => {
  try {
    const newAmountOfGuests = request.body.number_of_guests
    const reservationId = Number(request.params.id)
    if (isNaN(reservationId)) {
      response.status(400).json({
        error: "Reservation wasn't changed.",
        hint: 'Id should be a number',
      })
      return
    } else {
      const meal = await knex('meals')
        .select(
          'meals.id',
          'meals.title',
          'meals.description',
          'meals.location',
          'meals.when',
          'meals.created_date',
          'meals.price',
          'meals.max_reservations',
          'reservations.number_of_guests',
          knex.raw(
            '(meals.max_reservations-COALESCE(SUM(reservations.number_of_guests),0)) as available_reservation'
          )
        )
        .where('reservations.id', '=', reservationId)
        .leftJoin('reservations', 'meals.id', '=', 'reservations.meal_id')
      const [currentMeal] = meal
      const { number_of_guests } = currentMeal
      const availableReservations = Number(currentMeal.available_reservation)
      const newNumberOfGuests =
        availableReservations +
        Number(number_of_guests) -
        Number(newAmountOfGuests)
      if (newNumberOfGuests < 0) {
        response.json({
          message: `Change didn't accepted. Only ${
            availableReservations + Number(number_of_guests)
          } seats left.`,
        })
      } else {
        if (meal.length === 0) {
          response.status(400).json({
            error: "Reservation wasn't changed.",
            hint: `Reservation with id of ${reservationId} does not exist`,
          })
          return
        }
        const context = request.body
        const updateContext = await knex('reservations')
          .where({ id: reservationId })
          .update(context)
        response.json(updateContext)
      }
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
      const mealById = await knex('reservations')
        .select('*')
        .where({ id: reservationId })
      if (mealById.length === 0) {
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
