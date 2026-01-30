import { useState, useEffect } from "react";

const Todo = () => {
  const [mode, setMode] = useState(false);
  const [item, setItem] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Low");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const priorityWeight = { High: 1, Medium: 2, Low: 3 };

  const formatTodo = (t) => ({
    id: t.todo_id,
    text: t.description,
    priority: t.priority || "Low",
  });

  const getTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/todos");
      const jsonData = await response.json();
      setItem(jsonData.map(formatTodo));
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addElement = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const body = { description: input, priority: priority };
      const response = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const newItem = await response.json();
        const formatted = Array.isArray(newItem)
          ? formatTodo(newItem[0])
          : formatTodo(newItem);
        setItem((prev) => [...prev, formatted]);
        setInput("");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
      });
      if (response.ok) setItem((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateTodo = async (id, newText, newPriority) => {
    if (!newText.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const body = { description: newText, priority: newPriority };
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        setItem((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, text: newText, priority: newPriority } : t,
          ),
        );
        setEditingId(null);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const startEditing = (t) => {
    setEditingId(t.id);
    setEditText(t.text);
  };

  const getPriorityStyles = (p) => {
    const styles = {
      High: "border-red-500 text-red-700 dark:text-red-400 dark:border-red-600",
      Medium:
        "border-amber-500 text-amber-700 dark:text-amber-400 dark:border-amber-600",
      Low: "border-blue-500 text-blue-700 dark:text-blue-400 dark:border-blue-600",
    };
    return styles[p] || styles.Low;
  };

  const sortedItems = [...item].sort(
    (a, b) =>
      (priorityWeight[a.priority] || 3) - (priorityWeight[b.priority] || 3),
  );

  return (
    <div
      className={`${mode ? "dark" : ""} min-h-screen w-full bg-slate-50 dark:bg-slate-900 transition-colors`}
    >
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold dark:text-white">Task Manager</h1>
          <button
            onClick={() => setMode(!mode)}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
          >
            {mode ? "☀️" : "🌙"}
          </button>
        </div>

        <form
          onSubmit={addElement}
          className="flex gap-2 mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
        >
          <input
            className="border p-2 grow rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Add
          </button>
        </form>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            sortedItems.map((t) => (
              <div
                key={t.id}
                className={`p-4 border-l-4 rounded shadow-sm flex justify-between items-center bg-white dark:bg-gray-800 ${getPriorityStyles(t.priority)}`}
              >
                {editingId === t.id ? (
                  <input
                    autoFocus
                    className="grow mr-4 p-1 border rounded dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        updateTodo(t.id, editText, t.priority);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                  />
                ) : (
                  <span
                    className="font-medium dark:text-white grow cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={() => startEditing(t)}
                  >
                    {t.text}
                  </span>
                )}

                <div className="flex gap-3 items-center">
                  <select
                    value={t.priority}
                    onChange={(e) => updateTodo(t.id, t.text, e.target.value)}
                    className="text-xs bg-transparent border border-gray-200 dark:border-gray-600 rounded p-1 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <button
                    onClick={() => removeItem(t.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
