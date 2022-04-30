const express = require("express");
const Knex = require("knex");
const { join } = require("path");
const { where } = require("../database");
const router = express.Router();
const knex = require("../database");

// GET	Returns all meals
router.get("/", async (request, response) => {
  try {
    let meals = knex("meals");
    if (request.query["maxPrice"]) {
      meals = meals.where("price", "<", request.query["maxPrice"]);
    }
    if (request.query["availableReservations"] === "true") {
      meals = meals
        .sum({ reserved: "reservations.number_of_guests" })
        .join("reservations", "reservations.meal_id", "=", "meals.id")
        .groupBy("meals.id")
        .having("reserved", "<", "meals.max_reservations");
    }
    if (request.query["title"]) {
      meals = meals.where("title", "like", `%${request.query["title"]}%`);
    }
    if (request.query["createdAfter"]) {
      if (new Date(request.query["createdAfter"]) != "Invalid Date") {
        meals = meals.where("created_date", ">", request.query["createdAfter"]);
      } else {
        response.status(400).json("Invalid date");
      }
    }

    if (request.query["limit"]) {
      meals = meals.limit(request.query["limit"]);
    }

    const result = await meals.select(
      "meal.title",
      "meal.description",
      "meal.location",
      "meal.when",
      "meal.max_reservations",
      "meal.price",
      "meal.created_date"
    );
    if (result.length === 0) {
      response.status(404).json("Not found");
    } else {
      response.json(result);
    }
  } catch (error) {
    throw error;
  }
});

router.get("/:id", async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const meal = await knex("meals").where({ id: id }).select("title");
    response.json(meal);
  } catch (error) {
    throw error;
  }
});

//POST.	Adds a new meal
router.post("/", async (request, response) => {
  try {
    const context = request.body;
    if (Object.keys(context).length === 0 || context === {}) {
      response.statusCode = 422;
      response.json({ message: "Bad input" });
      return;
    }
    if (context.title === "") {
      response.json({ message: "Give me title" });
      return;
    }
    if (context.description === "") {
      response.json({ message: "Give me description" });
      return;
    }
    if (context.location === "") {
      response.json({ message: "Give me location" });
      return;
    }
    if (context.when === "") {
      response.json({ message: "Give me date" });
      return;
    }
    if (context.max_reservations === "") {
      response.json({ message: "Give number of guests" });
      return;
    }
    if (context.price === "") {
      response.json({ message: "Give me max price" });
      return;
    }
    if (context.created_date === "") {
      response.json({ message: "Give me created date" });
      return;
    }
    const insertContext = await knex("meals").insert(context);
    response.json(insertContext);
  } catch (error) {
    throw error;
  }
});

// PUT.	Updates the meal by id
router.put("/:id", async (request, response) => {
  const context = request.body;
  const id = request.params.id;
  const updateContext = await knex("meals").where({ id: id }).update(context);
  console.log(updateContext);
  if (updateContext) {
    response.json({ message: "Data has been changed" });
    return;
  } else {
    response.statusCode = 422;
    response.json({ message: "Bad request. Data wasn't changed" });
    return;
  }
});

// DELETE.	Deletes the meal by id
router.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const deleteContext = await knex("meals").where({ id: id }).delete();
  response.json(deleteContext);
});

module.exports = router;
