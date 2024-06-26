// src/main.jsx
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LandingPage from "./pages/LandingPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/quiz" element={<QuizPage />} />
			<Route path="/result" element={<ResultPage />} />
		</Routes>
	</BrowserRouter>
);
