import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import clientReducer from "./slices/client.slice";
import barberReducer from "./slices/barber.slice";
import adminReducer from "./slices/admin.slice";
import { useDispatch } from "react-redux";

// const clientPersistConfig = {
// 	key: "client",
// 	storage,
// };

// const barberPersistConfig = {
// 	key: "barber",
// 	storage,
// };

const rootPersistConfig = {
	key: "session",
	storage,
};

const rootReducer = combineReducers({
	client: clientReducer,
	barber: barberReducer,
	admin: adminReducer,
});
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
			},
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
