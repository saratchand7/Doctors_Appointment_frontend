
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const location = useLocation();

  return (
    <div className="app">

      <Navbar />

      <main className="main-container">

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AppRoutes />
        </motion.div>

      </main>

    </div>
  );
}

export default App;
