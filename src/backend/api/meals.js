const express = require('express')
const router = express.Router()
const knex = require('../database')

// GET method
router.get('/', async (request, response) => {
  try {
    const { maxPrice, availableReservations, title, createdAfter, limit } =
      request.query
    let meals = await knex('meal')

    // Get meals price smaller than maxPrice
    if (maxPrice) {
      const mealMaxPrice = parseInt(maxPrice)
      meals = await knex('meal').select('*').where('price', '<', mealMaxPrice)
    }
    // Get meals that partially match a title
    if (title) {
      meals = await knex('meal')
        .select('*')
        .where('title', 'like', `%${title}%`)
    }
    //Get meals that has been created after the date
    if (createdAfter) {
      const afterDate = new Date(createdAfter)
      meals = await knex('meal')
        .select('*')
        .where('created_date', '>', afterDate)
    }
    // Only specific number of meals
    if (limit) {
      const mealLimit = parseInt(limit)
      meals = await knex('meal').select('*').limit(mealLimit)
    }
    // Get meals that still has available reservations
    if (availableReservations) {
      meals = await knex('meal')
        .leftJoin('reservation', 'meal.id', '=', 'reservation.meal_id')
        .select(
          'meal.id',
          'meal.title',
          'meal.description',
          'meal.location',
          'meal.when',
          'meal.created_date',
          'meal.price',
          'meal.max_reservations',
          knex.raw(
            'COALESCE(SUM(reservation.number_of_guests),0) as total_guests'
          ),
          knex.raw(
            '(meal.max_reservations-COALESCE(SUM(reservation.number_of_guests),0)) AS available_reservation'
          )
        )
        .groupBy('meal.id')
        .having(
          knex.raw(
            '(max_reservations > COALESCE(SUM(reservation.number_of_guests),0))'
          )
        )
        .groupBy('meal.id')
    }
    response.json(meals)
  } catch (error) {
    throw error
  }
})

//GET. Returns meal by id
router.get('/:id', async (request, response) => {
  try {
    const mealId = Number(request.params.id)
    if (isNaN(mealId)) {
      response.status(400).json({
        error: "Meal wasn't found.",
        hint: 'Id should be a number',
      })
      return
    } else {
      const meals = await knex('meal')
      const isFoundId = meals.some((meal) => meal.id === mealId)
      if (!isFoundId) {
        response.status(400).json({
          error: "Meal wasn't found.",
          hint: 'Meal with this id does not exist',
        })
        return
      }
      const mealById = await knex('meal').select('*').where({ id: mealId })
      response.json(mealById)
    }
  } catch (error) {
    throw error
  }
})

//POST.	Adds a new meal
router.post('/', async (request, response) => {
  try {
    const context = request.body
    if (Object.keys(context).length === 0 || context === {}) {
      response.statusCode(422).json({ message: 'Bad input' })
      return
    }
    if (context.title === '') {
      response.json({ message: 'Give me title' })
      return
    }
    if (context.description === '') {
      response.json({ message: 'Give me description' })
      return
    }
    if (context.location === '') {
      response.json({ message: 'Give me location' })
      return
    }
    if (context.when === '') {
      response.json({ message: 'Give me date' })
      return
    }
    if (context.max_reservations === '') {
      response.json({ message: 'Give number of guests' })
      return
    }
    if (context.price === '') {
      response.json({ message: 'Give me max price' })
      return
    }
    if (context.created_date === '') {
      response.json({ message: 'Give me created date' })
      return
    }
    const insertContext = await knex('meal').insert(context)
    response.json(insertContext)
  } catch (error) {
    throw error
  }
})

// PUT.	Updates the meal by id
router.put('/:id', async (request, response) => {
  try {
    const mealId = Number(request.params.id)
    if (isNaN(mealId)) {
      response.status(400).json({
        error: "Meal wasn't changed.",
        hint: 'Id should be a number',
      })
      return
    } else {
      const meals = await knex('meal')
      const isFoundId = meals.some((meal) => meal.id === mealId)
      if (!isFoundId) {
        response.status(400).json({
          error: "Meal wasn't changed.",
          hint: 'Meal with this id does not exist',
        })
        return
      }
      const context = request.body
      const updateContext = await knex('meal')
        .where({ id: mealId })
        .update(context)
      response.json(updateContext)
    }
  } catch (error) {
    throw error
  }
})

// DELETE.	Deletes the meal by id
router.delete('/:id', async (request, response) => {
  try {
    const mealId = Number(request.params.id)
    if (isNaN(mealId)) {
      response.status(400).json({
        error: "Meal wasn't deleted.",
        hint: 'Id should be a number',
      })
      return
    } else {
      const meals = await knex('meal')
      const isFoundId = meals.some((meal) => meal.id === mealId)
      if (!isFoundId) {
        response.status(400).json({
          error: "Meal wasn't deleted.",
          hint: 'Meal with this id does not exist',
        })
        return
      }
      const deleteMeal = await knex('meal').where({ id: mealId }).del()
      response.json(deleteMeal)
    }
  } catch (error) {
    throw error
  }
})

module.exports = router
