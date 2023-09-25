const express = require("express");
const app = express();
require("colors");
require("dotenv").config();

const { Pool, Client } = require("pg");

app.use(express.json());
const PORT = 8080;

const pool = new Pool();

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.get("/fightors", (req, res) => {
  pool
    .query("SELECT * FROM fightors")
    .then((data) => res.send(data.rows))
    .catch((e) => {
      res.sendStatus(500).send("Somthing went wrong");
    });
});

app.get("/fightors/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM fightors WHERE id = $1;", [id])
    .then((data) => res.json(data.rows))
    .catch((e) => {
      res.sendStatus(500).send(e);
    });
});

app.post("/fightors", (req, res) => {
  const { first_name, last_name, country_id, style } = req.body;
  pool.query(
    "INSERT INTO fightors (first_name, last_name, country_id, style) VALUES ($1, $2, $3, $4)",
    [first_name, last_name, country_id, style]
  );
});

app.get("/time", (req, res) => {
  pool.query("SELECT NOW()", (err, response) => {
    console.log("err: ", err, "res:", res.rows);
    if (err)
      return res
        .status(500)
        .send("Internal Server Error: something went wrong");
    res.send(response.rows[0]);
    // pool.end();
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`.rainbow);
});
