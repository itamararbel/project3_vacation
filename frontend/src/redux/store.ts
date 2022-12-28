import { combineReducers } from "redux";
import { userReducer } from "./userAuthentication";
import { configureStore } from "@reduxjs/toolkit";


const reducers = combineReducers({ authState: userReducer });
export const store = configureStore({ reducer: reducers });