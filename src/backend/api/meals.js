const express = require('express')
const router = express.Router()
const knex = require('../database')
const { parse } = require('path')

router.get('/', async (request, response) => {
  try {
    const maxPrice = request.query.maxPrice
    const availableReservations = request.query.availableReservations
    const title = request.query.title
    const createdAfter = request.query.createdAfter
    const limit = request.query.limit
    const results = await knex('meals')

    if (Object.keys(request.query).length == 0) {
      response.json(results)
    } else {
      let supportedParams = false

      if (maxPrice) {
        if (!isNaN(parseInt(maxPrice))) {
          supportedParams = true
          results.select().where('price', '<=', maxPrice)
        } else {
          supportedParams = false
          response
            .status(400)
            .send('Failed to parse max price. Please check the format.')
          return
        }
      }

      if (limit) {
        if (!isNaN(parseInt(limit))) {
          supportedParams = true
          results.limit(parseInt(limit))
        } else {
          response
            .status(400)
            .send('Failed to parse limit value. Please check the format')
          return
        }
      }

      if (title) {
        supportedParams = true
        results.where('title', 'like', `%${title}%`).select()
      }

      if (createdAfter) {
        if (new Date(createdAfter) != 'Invalid Date') {
          supportedParams = true
          const createdAfterFormatted = new Date(createdAfter)
          results.where('created_date', '>', createdAfterFormatted).select()
        } else {
          response.status(400).send('Failed to parse the date')
          return
        }
      }

      if (availableReservations) {
        if (availableReservations == 'true') {
          supportedParams = true
          results
            .leftJoin('reservations', 'meals.id', 'reservations.meal_id')
            .select(
              'meals.id',
              'meals.title',
              'meals.description',
              'meals.price',
              'meals.max_reservations',
              knex.raw(
                'SUM(IFNULL(number_of_guests,0)) AS `guests_registered`'
              ),
              knex.raw(
                'meals.max_reservations - SUM(IFNULL(number_of_guests,0)) AS `reservations_available`'
              )
            )
            .groupBy('meals.id')
            .where('max_reservations', '>', 'number_of_guests')
            .having(
              knex.raw(
                '(meals.max_reservations - SUM(IFNULL(number_of_guests,0)))>0'
              )
            )
        } else {
          response
            .status(400)
            .send('The inserted param is not boolean. Please check the format.')
          return
        }
      }

      if (supportedParams === true) {
        resultsFinal = await results
        response.status(200).json(resultsFinal)
      } else {
        response.status(400).send('Inserted params are not supported')
      }
    }
  } catch (error) {
    throw error
  }
})

router.post('/', async (request, response) => {
  try {
    //I suggest making a data-model, so there's no issue with data types in  DB and request
    const meal = {
      title: request.body.title,
      description: request.body.description,
      location: request.body.location,
      when: new Date(request.body.when),
      max_reservations: request.body.maxReservations,
      price: request.body.price,
      created_date: new Date(),
    }

    const newMeal = await knex('meals').insert(meal)
    response.json(newMeal)
  } catch (error) {
    throw error
  }
})

router.get('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const meal = await knex('meals').where({ id })
    response.json(meal)
  } catch (error) {
    throw error
  }
})

router.put('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const updatedMeal = await knex('meals').where({ id }).update(request.body)
    response.json(updatedMeal)
  } catch (error) {
    throw error
  }
})

router.delete('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const deletedMeal = await knex('meals').where({ id }).del()
    response.json(deletedMeal)
  } catch (error) {
    throw error
  }
})

module.exports = router

// const express = require("express");
// const Knex = require("knex");
// const { join } = require("path");
// const { where } = require("../database");
// const router = express.Router();
// const knex = require("../database");

// // GET	Returns all meals
// router.get("/", async (request, response) => {
//   try {
//     let meals = knex("meals");
//     if (request.query["maxPrice"]) {
//       meals = meals.where("price", "<", request.query["maxPrice"]);
//     }
//     if (request.query["availableReservations"] === "true") {
//       meals = meals
//         .sum({ reserved: "reservations.number_of_guests" })
//         .join("reservations", "reservations.meal_id", "=", "meals.id")
//         .groupBy("meals.id")
//         .having("reserved", "<", "meals.max_reservations");
//     }
//     if (request.query["title"]) {
//       meals = meals.where("title", "like", `%${request.query["title"]}%`);
//     }
//     if (request.query["createdAfter"]) {
//       if (new Date(request.query["createdAfter"]) != "Invalid Date") {
//         meals = meals.where("created_date", ">", request.query["createdAfter"]);
//       } else {
//         response.status(400).json("Invalid date");
//       }
//     }

//     if (request.query["limit"]) {
//       meals = meals.limit(request.query["limit"]);
//     }

//     const result = await meals.select(
//       "meal.title",
//       "meal.description",
//       "meal.location",
//       "meal.when",
//       "meal.max_reservations",
//       "meal.price",
//       "meal.created_date"
//     );
//     if (result.length === 0) {
//       response.status(404).json("Not found");
//     } else {
//       response.json(result);
//     }
//   } catch (error) {
//     throw error;
//   }
// });

// router.get("/:id", async (request, response) => {
//   try {
//     const id = parseInt(request.params.id);
//     const meal = await knex("meals").where({ id: id }).select("title");
//     response.json(meal);
//   } catch (error) {
//     throw error;
//   }
// });

// //POST.	Adds a new meal
// router.post("/", async (request, response) => {
//   try {
//     const context = request.body;
//     if (Object.keys(context).length === 0 || context === {}) {
//       response.statusCode = 422;
//       response.json({ message: "Bad input" });
//       return;
//     }
//     if (context.title === "") {
//       response.json({ message: "Give me title" });
//       return;
//     }
//     if (context.description === "") {
//       response.json({ message: "Give me description" });
//       return;
//     }
//     if (context.location === "") {
//       response.json({ message: "Give me location" });
//       return;
//     }
//     if (context.when === "") {
//       response.json({ message: "Give me date" });
//       return;
//     }
//     if (context.max_reservations === "") {
//       response.json({ message: "Give number of guests" });
//       return;
//     }
//     if (context.price === "") {
//       response.json({ message: "Give me max price" });
//       return;
//     }
//     if (context.created_date === "") {
//       response.json({ message: "Give me created date" });
//       return;
//     }
//     const insertContext = await knex("meals").insert(context);
//     response.json(insertContext);
//   } catch (error) {
//     throw error;
//   }
// });

// // PUT.	Updates the meal by id
// router.put("/:id", async (request, response) => {
//   const context = request.body;
//   const id = request.params.id;
//   const updateContext = await knex("meals").where({ id: id }).update(context);
//   console.log(updateContext);
//   if (updateContext) {
//     response.json({ message: "Data has been changed" });
//     return;
//   } else {
//     response.statusCode = 422;
//     response.json({ message: "Bad request. Data wasn't changed" });
//     return;
//   }
// });

// // DELETE.	Deletes the meal by id
// router.delete("/:id", async (request, response) => {
//   const id = request.params.id;
//   const deleteContext = await knex("meals").where({ id: id }).delete();
//   response.json(deleteContext);
// });

// module.exports = router;
