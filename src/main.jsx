
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AuthProvider } from "./context/AuthContext";
import AppProviders from "./components/AppProviders";
import App from "./App";
import "./index.css";

store.subscribe(() => {
  localStorage.setItem(
    "doctorFavorites",
    JSON.stringify(store.getState().favorites)
  );
});

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <AppProviders>
            <App />
          </AppProviders>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
