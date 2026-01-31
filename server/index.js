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
      "INSERT INTO todo (description, priority, completed) VALUES($1, $2, $3) RETURNING *",
      [description, priority || "Low", false],
    );
    res.status(201).json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query(
      "SELECT * FROM todo ORDER BY todo_id ASC",
    );
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, priority, completed } = req.body;

    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1, priority = $2, completed = $3 WHERE todo_id = $4 RETURNING *",
      [description, priority, completed, id],
    );

    res.json(updateTodo.rows[0]);
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
