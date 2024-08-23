import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../configAPI";
import { toast } from "react-toastify";

const userData = JSON.parse(sessionStorage.getItem("userData"));
const token = userData.token;
console.log("token", token);

export const addTask = createAsyncThunk(
    "add/task",
    async (payload, { rejectWithValue }) => {
        console.log("payload add", payload);
        
        try {
            const res = await axiosInstance.post("/api/task/add", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log("Task added data", res);
            return res.data
        } catch (error) {
            console.log("Failed to add task", error);
            return rejectWithValue(error.response ? error.response.data : { message: error.message })

        }
    }
);


const taskSlice = createSlice({
    name: "task",
    initialState: {
        isLoading: false,
        success: false,
        status: null,
        message: "",
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addTask.pending, (state) => {
                state.isLoading = true;
                state.success = false;
                state.message = "";
            })
            .addCase(addTask.fulfilled, (state, action) => {
                console.log("add task fulfilled", action.payload);
                state.isLoading = false;
                state.success = action.payload.data.success;
                state.message = action.payload.data.message;
                toast.success(state.message)
            })
            .addCase(addTask.rejected, (state, action) => {
                console.log("add task rejected payload", action.payload);
                state.isLoading = false;
                state.success = false;
                state.message = action.payload.data.message || "Unknown error occurred";
                toast.error(state.message)
            })
    }
});

export const taskReducer = taskSlice.reducer;