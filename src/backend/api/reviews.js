const express = require("express");
const router = express.Router();
const knex = require("../database");

router.get("/", async (request, response) => {
  try {
    // knex syntax for selecting things. Look up the documentation for knex for further info
    const titles = await knex("reviews").select("title");
    response.json(titles);
  } catch (error) {
    throw error;
  }
});

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

module.exports = router;
