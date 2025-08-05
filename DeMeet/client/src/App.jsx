import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Header/Navbar";
import LoginForm from "./components/auth/Login-form";
import SignupForm from "./components/auth/SignupForm";
import LandingPage from "./pages/LandingPage";
import ProtectRoute from "./components/ProtectRoute";
import Dashboard from "./pages/Dashboard";
import AuthRoute from "./components/AuthRoute";
import Footer from "./components/Footer/Footer";
import Room from "./pages/Room";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar - fixed at top */}
      <Router>
        <Navbar className="flex-none" />

        {/* Main content area - scrollable */}
        <div className="flex-1 overflow-hidden">
          <main className="h-full overflow-y-auto scrollbar-thin">
            <div className="container mx-auto p-4 min-h-full flex items-center justify-center">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="login"
                  element={
                    <AuthRoute>
                      <LoginForm />
                    </AuthRoute>
                  }
                />
                <Route
                  path="signup"
                  element={
                    <AuthRoute>
                      <SignupForm />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectRoute>
                      <Dashboard />
                    </ProtectRoute>
                  }
                />
                <Route path="/room/:roomId" element={<Room />} />
              </Routes>
            </div>
          </main>
        </div>

        <Footer className="flex-none" />
        <Toaster richColors position="top-right" />
      </Router>
    </div>
  );
}

export default App;
