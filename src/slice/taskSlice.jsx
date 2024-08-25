import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { axiosInstance } from "../../configAPI";

function getToken(){
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    return userData.token
}
export const getTask = createAsyncThunk(
    "get/task",
    async ({ searchTitle, sortBy }, { rejectWithValue }) => {
        const token = getToken();
        console.log("token", token);
        try {
            // ?searchTitle=${}&&sortBy=${}
            const res = await axiosInstance.get(`/api/task/all-data`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },params: {
                    searchTitle,  
                    sortBy        
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
        const token = getToken();
        console.log("token", token);
        console.log("payload add", payload);

        try {
            const res = await axiosInstance.post("/api/task/add", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            getTask();
            console.log("Task added data", res);
            return res.data
        } catch (error) {
            console.log("Failed to add task", error);
            return rejectWithValue(error.response ? error.response.data : { message: error.message })

        }
    }
);

export const updateTask = createAsyncThunk(
    "update/task",
    async ({ id, title, description, status }, { rejectWithValue }) => {
        const payload = { title, description,status };
        const token = getToken();
        console.log("token", token);
        console.log("payload update", payload);
        try {
            const res = await axiosInstance.put(`/api/task/update/${id}`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log("Task updated data", res);
            return res.data
        } catch (error) {
            console.log("Failed to updat task", error);
            return rejectWithValue(error.response ? error.response.data : { message: error.message })

        }
    }
);

export const deleteTask = createAsyncThunk(
    "delete/task",
    async (id, { rejectWithValue }) => {
        const token = getToken();
        console.log("token", token);
        console.log("delete id", id);
        try {
            const res = await axiosInstance.delete(`/api/task/delete/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log("Task updated data", res);
            return res.data
        } catch (error) {
            console.log("Failed to updat task", error);
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
                // toast.success(state.message)
            })
            .addCase(getTask.rejected, (state, action) => {
                console.log("get task rejected payload", action.payload);
                state.isLoading = false;
                state.success = false;
                state.message = action.payload.data.message || "Unknown error occurred";
                // toast.error(state.message)
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
            // task update section
            .addCase(updateTask.pending, (state) => {
                state.isLoading = true;
                state.success = false;
                state.message = "";
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                console.log("update task fulfilled", action.payload);
                state.isLoading = false;
                state.success = action.payload.data.success;
                state.message = action.payload.data.message;
                toast.success(state.message)
            })
            .addCase(updateTask.rejected, (state, action) => {
                console.log("update task rejected payload", action.payload);
                state.isLoading = false;
                state.success = false;
                state.message = action.payload.message || "Unknown error occurred";
                toast.error(state.message)
            })
            // delete task section
            .addCase(deleteTask.pending, (state) => {
                state.isLoading = true;
                state.success = false;
                state.message = "";
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                console.log("update task fulfilled", action.payload);
                state.isLoading = false;
                state.success = action.payload.data.success;
                state.message = action.payload.data.message;
                toast.success(state.message)
            })
            .addCase(deleteTask.rejected, (state, action) => {
                console.log("update task rejected payload", action.payload);
                state.isLoading = false;
                state.success = false;
                state.message = action.payload.message || "Unknown error occurred";
                toast.error(state.message)
            })
    }
});

export const taskReducer = taskSlice.reducer;