// src/api/api.js

// Define the base URL of our .NET Web API.
// IMPORTANT: Change the port number to match our running .NET API (check launchSetting.json).
const BASE_URL = "http://localhost:5192/api";

// A helper function to get the JWT token from the Local storage.
// We will store the token in localStorege upon Successful Login.
const getToken = () => localStorage.getItem("token");

// A centralized fetch wrapper to avoid  repeating headers and error handling.
const fetchClient = async (endpoint, options = {}) => {
    // Retrieve the token if exists.
    const token = getToken();

    // Set default headers for JSON communication.
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    // If a token exists, attach it to the Authorization headers as a Bearer token.
    // This is how our .NET API knows who is making the request.
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Make the actual HTTP request using fetch.
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // 1. Handle 204 No Content
    if (response.status === 204) return null;

    // 2. Read the response body as TEXT FIRST. 
    // This prevents the crash if the body is empty.
    const text = await response.text();

    // 3. If the response status is not OK, throw an error.
    if (!response.ok) {
        let errorMessage = "Something went wrong with the API request";
        
        try {
            const parsedError = JSON.parse(text);
            
            if (Array.isArray(parsedError)) {
                // Handle .NET Identity errors (array of objects)
                errorMessage = parsedError.map((err) => err.description || err.message || err).join(", ");
            } else if (typeof parsedError === 'object' && parsedError !== null) {
                // Handle custom objects
                errorMessage = parsedError.message || parsedError.title || JSON.stringify(parsedError);
            } else {
                errorMessage = String(parsedError);
            }
        } catch {
            errorMessage = text || errorMessage;
        }
        
        throw new Error(errorMessage);
    }

    // 4. Parse the successful response as JSON
    return text ? JSON.parse(text) : null;
};

// --- AUTHENTICATION API CALLS ---

// Function to send login credentials to the .NET API.
export const loginUser = async (username, password) => {
    return fetchClient("/account/login", {
        method: "POST", //POST request to send data.
        body: JSON.stringify({username, password}), // Convert JS object to JSON string.
    });
};

// Function to send registration data to the .NET API.
export const registerUser = async (username, email, password) => {
    return fetchClient("/account/register", {
        method: "POST",
        body: JSON.stringify({username, email, password}),
    });
};

// --- TODO API CALLS ---

// Function to fetch all todos for the logged-in user.
export const getTodos = async () => {
    return fetchClient("/todo");    // GET request by default.
};

// Function to create a new todo.
export const createTodo = async (todoData) => {
    return fetchClient("/todo", {
        method: "POST",
        body: JSON.stringify(todoData),
    });
};

// Function to update an existing todo (used for toggling completion and editing).
export const updateTodo = async (id, todoData) => {
    return fetchClient(`/todo/${id}`, {
        method: "PUT",
        body: JSON.stringify(todoData),
    });
};

// Function to delete a todo by its ID.
export const deleteTodo = async (id) => {
    return fetchClient(`/todo/${id}`,{
        method: "DELETE",
    });
};