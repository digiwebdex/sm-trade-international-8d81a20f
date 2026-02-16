import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Hide the static app shell once React has mounted
document.body.classList.add('app-mounted');

