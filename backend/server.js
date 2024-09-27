const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const todoSchema = new mongoose.Schema({
  title: { type: String, require: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// get all
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET by id
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).send("Todo not found");
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Create new
app.post("/todos", async (req, res) => {
  const { title } = req.body;
  try {
    const newTodo = new Todo({ title });
    const saveTodo = await newTodo.save();
    res.status(201).json(saveTodo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// update
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const updTodo = await Todo.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );

    if (!updTodo) return res.status(404).send("Todo not found");
    res.json(updTodo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// delete
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTodo = await Todo.findByIdAndDelete(id);
    if (!deleteTodo) return res.status(404).send("Todo not found");
    res.json({ message: "Todo Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
