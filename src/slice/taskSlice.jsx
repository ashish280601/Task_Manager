import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../configAPI";
import { toast } from "react-toastify";

const userData = JSON.parse(sessionStorage.getItem("userData"));
const token = userData?.token || null;
console.log("token", token);

export const getTask = createAsyncThunk(
    "get/task",
    async (payload, { rejectWithValue }) => {
        console.log("payload get", payload);

        try {
            // ?searchTitle=${}&&sortBy=${}
            const res = await axiosInstance.post(`/api/task/all-data`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log("Task added get", res);
            return res.data
        } catch (error) {
            console.log("Failed to get task", error);
            return rejectWithValue(error.response ? error.response.data : { message: error.message })

        }
    }
);

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
            // get task section
            .addCase(getTask.pending, (state) => {
                state.isLoading = true;
                state.success = false;
                state.message = "";
            })
            .addCase(getTask.fulfilled, (state, action) => {
                console.log("get task fulfilled", action.payload);
                state.isLoading = false;
                state.success = action.payload.data.success;
                state.message = action.payload.data.message;
                toast.success(state.message)
            })
            .addCase(getTask.rejected, (state, action) => {
                console.log("get task rejected payload", action.payload);
                state.isLoading = false;
                state.success = false;
                state.message = action.payload.data.message || "Unknown error occurred";
                toast.error(state.message)
            })
            // add tas section
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
                state.message = action.payload.message || "Unknown error occurred";
                toast.error(state.message)
            })
    }
});

export const taskReducer = taskSlice.reducer;