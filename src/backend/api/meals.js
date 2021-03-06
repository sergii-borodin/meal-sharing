const express = require('express')
const router = express.Router()
const knex = require('../database')

// GET method

router.get('/', async (request, response) => {
  try {
    let meals = []
    let {
      maxPrice = 1000000,
      availableReservations = 0,
      title = '%',
      createdAfter = new Date(0),
      limit = 1000000,
    } = request.query
    meals = await knex('meals')
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
      .groupBy('meals.id')
      .leftJoin('reservations', 'meals.id', '=', 'reservations.meal_id')
      .where('title', 'like', `%${title}%`)
      .where('price', '<=', maxPrice)
      .where('meals.created_date', '>', new Date(createdAfter))
      .limit(parseInt(limit))

      .having('available_reservation', '>=', availableReservations)
      .orderBy('meals.id')

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
      const mealById = await knex('meals').select('*').where('id', '=', mealId)
      if (mealById.length === 0) {
        response.status(400).json({
          error: "Meal wasn't found.",
          hint: 'Meal with this id does not exist',
        })
        return
      }
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
    const requiredParams = [
      'title',
      'description',
      'location',
      'when',
      'max_reservations',
      'price',
      'created_date',
    ]
    if (Object.keys(context).length === requiredParams.length) {
      const insertContext = await knex('meals').insert(context)
      response.json(insertContext)
    } else {
      requiredParams.map((param) => {
        if ((context[param] === '' || context[param]) === undefined) {
          response
            .status(422)
            .json({ message: 'Bad input', hint: `Please, provide ${param}` })
        }
      })
    }
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
      const mealById = await knex('meals').select('*').where({ id: mealId })
      if (mealById.length === 0) {
        response.status(400).json({
          error: "Meal wasn't changed.",
          hint: 'Meal with this id does not exist',
        })
        return
      } else {
        const context = request.body
        const updateContext = await knex('meals')
          .where({ id: mealId })
          .update(context)
        response.json(updateContext)
      }
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
      const mealById = await knex('meals').select('*').where({ id: mealId })
      if (mealById.length === 0) {
        response.status(400).json({
          error: "Meal wasn't deleted.",
          hint: `Meal with id of ${mealId} does not exist`,
        })
        return
      }
      const deleteMeal = await knex('meals').where({ id: mealId }).del()
      response.json(deleteMeal)
    }
  } catch (error) {
    throw error
  }
})

module.exports = router
