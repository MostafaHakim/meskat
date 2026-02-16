import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ReactPixel from "react-facebook-pixel";

const Root = () => {
  useEffect(() => {
    const options = {
      autoConfig: true,
      debug: false,
    };
    ReactPixel.init(import.meta.env.VITE_PIXEL_ID, null, options);
    ReactPixel.pageView();
  }, []);

  return (
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<Root />);
