// src/features/todo/todoSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../../api/api";


// Initial state for the todo feature.
const initialState = {
    items: [],  // Array to hold the list of todos.
    isLoading: false,   // Loading state for fetching/manipulating todos.
    error: null,    // Error state for todo operations.
};

// --- ASYNC THUNKS ---

// Thunk to fetch all todos from the API.
export const fetchTodos = createAsyncThunk(
    "todos/fetchTodos",
    async (_, {rejectWithValue}) => {
        try {
            const data = await getTodos();  //Call the API.
            return data;    // Return the list of todos.
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk to add a new todo.
export const addTodo = createAsyncThunk(
    "todos/addTodo",
    async (todoData, { rejectWithValue }) => {
        try{
            const data = await createTodo(todoData);    // Call the API.
            return data;        // Return the newly created todo.
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk to update and existing todo (e.g., toggling completion).
export const toggleTodo = createAsyncThunk(
    "todos/toggleTodo",
    async ({ id, todoData }, { rejectWithValue }) => {
        try {
            const data = await updateTodo(id, todoData); // Call the API.
            return data;    // Return the updated todo.
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk to delete a todo.
export const removeTodo = createAsyncThunk(
    "todos/removeTodo",
    async ( id, { rejectWithValue }) => {
        try {
            await deleteTodo(id);   // Call the API to delete.
            return id;  // Return the ID of the deleted todo so we can remove it from state.
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// --- SLICE DEFINITION ---

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        // Synchronous reducer to clear errors ( optional, but good for UX).
        clearTodoError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- FETCH TODOS ---
            .addCase(fetchTodos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;   // Replace the items with the fetched data.
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // --- ADD TODO ---
            .addCase(addTodo.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.push(action.payload);   // Add the new todo to the existing array
            })
            .addCase(addTodo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // --- TOGGLE TODO ---
            .addCase(toggleTodo.fulfilled, (state, action) => {
                // Find the index of the updated todo in the array.
                const index = state.items.findIndex((todo) => todo.id === action.payload.id);

                // If found, replace the old todo with the updated one.
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(toggleTodo.rejected, (state, action) => {
                state.error = action.payload;
            })
            // --- REMOVE TODO ---
            .addCase(removeTodo.fulfilled, (state, action) => {
                // Filter out the todo with the matching ID.
                state.items = state.items.filter((todo) => todo.id !== action.payload);
            })
            .addCase(removeTodo.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

// Export actions.
export const { clearTodoError } = todoSlice.actions;

// Export reducer.
export default todoSlice.reducer;