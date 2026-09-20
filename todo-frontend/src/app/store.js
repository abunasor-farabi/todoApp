// src/app/store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import todoReducer from "../features/todo/todoSlice";

// Configure the Redux store.
export const store = configureStore({
    // Combine the slice reducers into the main store.
    reducer: {
        auth: authReducer,  // Manages user login state and token.
        todos: todoReducer, // Manages the list of todo items.
    },
});

// Export the store so it can be provided to the React app in main.jsx.
export default store;