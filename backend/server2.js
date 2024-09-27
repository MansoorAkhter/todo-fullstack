const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "todo_app",
  password: "db2024",
  port: 5432,
});

// // get all
app.get("/todos", async (req, res) => {
  try {
    const todos = await pool.query("SELECT * FROM todos");
    res.json(todos.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// // GET by id
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const intId = parseInt(req.params.id);

  try {
    const result = await pool.query('SELECT * FROM todos WHERE "_id" = $1', [
      id,
    ]);

    if (result.rows.length === 0) {
      console.log(`No todo found with ID: ${intId}`);
      return res.status(404).send("Todo not found");
    }
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// // Create new
app.post("/todos", async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).send("Title is required");
  }
  try {
    const saveTodo = await pool.query(
      'INSERT INTO todos ("title") VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json(saveTodo.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// // update
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  if (!title && completed === undefined) {
    return res.status(400).send("No fields to update");
  }

  const updates = [];
  const values = [];

  if (title) {
    updates.push('"title" = $' + (updates.length + 1));
    values.push(title);
  }

  if (completed !== undefined) {
    updates.push("completed = $" + (updates.length + 1));
    values.push(completed);
  }

  values.push(id);
  
  const queryText = `UPDATE todos SET ${updates.join(", ")} WHERE ("_id") = $${
    values.length
  } RETURNING *`;

  try {
    const result = await pool.query(queryText, values);
    if (result.rowCount === 0) return res.status(404).send("Todo not found");
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// // delete
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await pool.query('DELETE FROM todos WHERE ("_id") = $1', [id]);
    if (todo.rowCount === 0) return res.status(404).send("Todo not found");
    res.json({ message: "Todo Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
