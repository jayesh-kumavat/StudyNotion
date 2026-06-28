import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import rootReducer from "./reducer";
import { configureStore } from "@reduxjs/toolkit";
import { Toaster, toast } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";


const originalSuccess = toast.success;
const originalError = toast.error;
toast.success = (msg, opts) => { toast.dismiss(); return originalSuccess(msg, opts); };
toast.error = (msg, opts) => { toast.dismiss(); return originalError(msg, opts); };

const store = configureStore({
  reducer: rootReducer,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2000,
            style: {
              borderRadius: '12px',
              background: '#1e293b',
              color: '#f1f5f9',
              fontSize: '14px',
            },
            success: { duration: 2000 },
            error: { duration: 3000 },
          }}
          containerStyle={{ top: 20 }}
          gutter={8}
        />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
