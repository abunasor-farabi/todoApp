import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks.
import { Link, useNavigate } from "react-router-dom"; // Router hooks.
import { login, clearError } from "../features/auth/authSlice"; // Import the async thunk and actions.

const Login = () => {
  // Local state for form inputs.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Initialize Redux dispatch and navigation.
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select auth state from Redux store.
  const { isLoading, error, token } = useSelector((state) => state.auth);

  // If the user is already logged in (has a token), redirect to dashboard.
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
    // Clear any previous errors when the component mounts.
    dispatch(clearError());
  }, [token, navigate, dispatch]);

  // Handle form submission.
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload.
    // Dispatch the login thunk with the form data.
    dispatch(login({ username, password }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {/* Display error message if login fails. */}
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update local state.
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update local state.
              required
            />
          </div>
          {/* Disable button while loading. */}
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;