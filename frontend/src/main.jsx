import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <Notifications />
        <App />
      </MantineProvider>
    </Provider>
  </StrictMode>
);
