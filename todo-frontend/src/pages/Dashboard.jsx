import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import {
  fetchTodos,
  addTodo,
  toggleTodo,
  removeTodo,
} from "../features/todo/todoSlice";

const Dashboard = () => {
  // Local state for the "Add New Task" form.
  const [taskName, setTaskName] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  // Redux hooks.
  const dispatch = useDispatch();
  
  // Select auth state to get the user's name.
  const { user } = useSelector((state) => state.auth);
  
  // Select todo state to get the list, loading, and error status.
  const { items: todos, isLoading, error } = useSelector((state) => state.todos);

  // Fetch todos when the component mounts.
  useEffect(() => {
    dispatch(fetchTodos()); // Dispatch the async thunk.
  }, [dispatch]);

  // Handle adding a new todo.
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!taskName || !startAt || !endAt) return;

    // Dispatch the addTodo thunk with the required data format.
    dispatch(
      addTodo({
        taskName,
        startAt: new Date(startAt).toISOString(), // Convert to ISO string for .NET DateTime.
        endAt: new Date(endAt).toISOString(),
      })
    );

    // Clear the form.
    setTaskName("");
    setStartAt("");
    setEndAt("");
  };

  // Handle toggling the completion status.
  const handleToggle = (todo) => {
    dispatch(
      toggleTodo({
        id: todo.id,
        todoData: {
          taskName: todo.taskName,
          startAt: todo.startAt,
          endAt: todo.endAt,
          isCompleted: !todo.isCompleted, // Toggle the boolean.
        },
      })
    );
  };

  // Handle deleting a todo.
  const handleDelete = (id) => {
    dispatch(removeTodo(id)); // Dispatch the delete thunk.
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {/* Display the logged-in user's name. */}
        <h1>Welcome, {user?.userName}</h1>
        {/* Dispatch the synchronous logout action. */}
        <button onClick={() => dispatch(logout())} className="btn-logout">
          Logout
        </button>
      </header>

      {/* Display any todo-related errors. */}
      {error && <p className="error-message">{error}</p>}

      <div className="todo-form-container">
        <h3>Add New Task</h3>
        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
          />
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            Add Task
          </button>
        </form>
      </div>

      <div className="todo-list-container">
        <h3>Your Daily Tasks</h3>
        {/* Show loading state. */}
        {isLoading && todos.length === 0 ? (
          <p>Loading your tasks...</p>
        ) : todos.length === 0 ? (
          <p>No tasks found. Add one above!</p>
        ) : (
          <ul className="todo-list">
            {/* Map through the todos array from Redux state. */}
            {todos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.isCompleted ? "completed" : ""}`}>
                <div className="todo-checkbox">
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => handleToggle(todo)}
                  />
                </div>
                <div className="todo-details">
                  <span className="todo-name">{todo.taskName}</span>
                  <span className="todo-time">
                    {new Date(todo.startAt).toLocaleString()} - {new Date(todo.endAt).toLocaleString()}
                  </span>
                </div>
                <button onClick={() => handleDelete(todo.id)} className="btn-delete">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;