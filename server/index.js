const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

app.post("/todos", async (req, res) => {
  try {
    const { description, priority } = req.body;
    if (!description)
      return res.status(400).json({ error: "Description required" });
    const newTodo = await pool.query(
      "INSERT INTO todo (description, priority) VALUES($1, $2) RETURNING *",
      [description, priority || "Low"],
    );
    res.status(201).json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, priority } = req.body;
    await pool.query(
      "UPDATE todo SET description = $1, priority = $2 WHERE todo_id = $3",
      [description, priority, id],
    );
    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
    res.json("todo deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(5000, () => console.log("server has started port 5000"));
