import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./src/slice/authSlice";
import { taskReducer } from "./src/slice/taskSlice";

const store = configureStore({
    reducer:{
        auth: authReducer,
        task: taskReducer
    }
});

export default store