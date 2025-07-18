import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register"; // کامپوننت ثبت‌نام
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* مسیر ثبت‌نام */}
        {import.meta.env.VITE_TEMPO === "true" &&
          routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
      </Routes>
    </Suspense>
  );
}

export default App;