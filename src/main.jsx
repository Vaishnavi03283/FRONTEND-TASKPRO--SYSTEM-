import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/design-tokens.css";
import "./styles/global.css";
import "./styles/index.css";

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);