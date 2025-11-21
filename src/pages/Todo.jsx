import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Todo = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [userName, setUserName] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setTodos(user.todos || []);
      setUserName(user.name);
    }
  }, [navigate]);

  // Add new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!task.trim()) return alert("Please enter a task!");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await axios.post(
        "https://todo-backend-z2a4-git-main-paramjeetug21s-projects.vercel.app/task/add",
        { title: task, userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newTodo = res.data.task;
      const newTodos = [...todos, newTodo];
      setTodos(newTodos);
      setTask("");

      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, todos: newTodos })
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.patch(
        `https://todo-backend-z2a4-git-main-paramjeetug21s-projects.vercel.app/task/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos);

      const user = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, todos: newTodos })
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        background:
          "linear-gradient(to bottom right, #0F021B, #2C0B4F, #170529)",
      }}
    >
      <div className="flex w-full max-w-5xl gap-6">
        <div className="w-2/5 bg-[#3e2e60] p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-white text-center">
            Welcome, {userName}
          </h2>
          <form onSubmit={handleAddTodo} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter a new task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full bg-[#5a4a7d] border border-[#6b5a8e] text-white rounded-lg p-3 placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-[#8e6bb3] transition duration-200"
            />
            <button
              type="submit"
              className="w-full text-white py-3 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 active:shadow-inner"
              style={{
                background: "linear-gradient(to right, #7a49b2, #a050ff)",
              }}
            >
              Add Task
            </button>
          </form>
        </div>
        <div className="w-3/5 bg-[#3e2e60] p-6 rounded-xl shadow-xl flex flex-col gap-4">
          {todos.filter((todo) => !todo.todoDone).length === 0 ? (
            <p className="text-center text-white/70 mt-8">No tasks yet!</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {todos
                .filter((todo) => !todo.todoDone)
                .map((todo) => (
                  <div
                    key={todo.id}
                    className="p-4 rounded-lg flex justify-between items-center cursor-pointer transition-all bg-purple-800 hover:bg-purple-700 text-white"
                  >
                    <span className="flex-grow">{todo.title}</span>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="ml-4 text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
