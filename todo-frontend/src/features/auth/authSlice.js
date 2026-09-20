// src/features/auth/authSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../api/api";

// Initial state for authentication.
// We check localStorage to persist the user session across page refreshes.
const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,     // User object (username, email).
    token: localStorage.getItem("token") || null,   // JWT token.
    isLoading: false,   // Track if an API call is in progress.
    error: null,    // Stores error message
};

// --- ASYNC THUNKS  (Best practice for handling async logic in Redux) ---

// Thunk for logging in a user.
// CreateAsyncThunk automatically handles the pending, fulfilled, and rejected states.
export const login = createAsyncThunk(
    "auth/login",
    async ({username, password}, {rejectWithValue}) => {
        try {
            // Call the API function we created in api.js.
            const data = await loginUser(username, password);
            // Save token and user to localStorage for persistence
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({ userName: data.userName, email: data.email}));
            // Return the data to be processed by the fulfilled reducer.
            return data;
        } catch (error) {
            // If the API call fails, return the error message to the rejected reducer.
            return rejectWithValue(error.message);
        }
    }
);

// Thunk for registering a new user.
export const register = createAsyncThunk(
    "auth/register",
    async ({username, email, password}, {rejectWithValue}) => {
        try {
            const data = await registerUser(username, email, password);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({ userName: data.userName, email: data.email }));
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// --- SLICE DEFINITION ---

const authSlice = createSlice({
    name: "auth",   // Name of the slice.
    initialState,   // The initial state defined above.
    reducers: {
        // A synchronous reducer to handle logout.
        // We simply clear the state and remove data from localStorage.
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        // A reducer to clear any authentication errors (e.g., when navigating away).
        clearError: (state) => {
            state.error = null;
        },
    },
    // Extra reducers handle the lifecycle of our async thunks.
    extraReducers: (builder) => {
        builder
            // --- LOGIN THUNK ---
            .addCase(login.pending, (state) => {
                state.isLoading = true; // Show loading spinner.
                state.error = null; // Clear previous errors.
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;    // Stop loading spinner.
                state.user = { userName: action.payload.userName, email: action.payload.email };    // Set user data.
                state.token = action.payload.token; // Set the JWT token.
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;    // Stop loading.
                state.error = action.payload;   // Set the error message from the API.
            })
            // --- REGISTER THUNK ---
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = { userName: action.payload.userName, email: action.payload.email };
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

// Export the actions so components can dispatch them.
export const { logout, clearError } = authSlice.actions;

// Export the reducer to be used in the store.
export default authSlice.reducer;
