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
import SolanaRoom from "./pages/SolanaRoom";
import { Toaster } from "sonner";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  // GlowWalletAdaptor,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  // SlopeWalletAdaptor,
  // TorusWalletAdaptor
} from "@solana/wallet-adapter-wallets";
import React, { useMemo } from "react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";

function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar - fixed at top */}
      <Router>
        <Navbar className="flex-none" />

        {/* Main content area - scrollable */}
        <div className="flex-1 overflow-hidden">
          <main className="h-full overflow-y-auto scrollbar-thin">
            <Context>
              {/* Removed the global container wrapper */}
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectRoute isPublic>
                      <div className="container mx-auto p-4 min-h-full flex items-center justify-center">
                        <LandingPage />
                      </div>
                    </ProtectRoute>
                  }
                />
                <Route
                  path="login"
                  element={
                    <AuthRoute>
                      <div className="container mx-auto p-4 min-h-full flex items-center justify-center">
                        <LoginForm />
                      </div>
                    </AuthRoute>
                  }
                />
                <Route
                  path="signup"
                  element={
                    <AuthRoute>
                      <div className="container mx-auto p-4 min-h-full flex items-center justify-center">
                        <SignupForm />
                      </div>
                    </AuthRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectRoute>
                      <div className="container mx-auto p-4 min-h-full flex items-center justify-center">
                        <Dashboard />
                      </div>
                    </ProtectRoute>
                  }
                />
                <Route
                  path="/room/:roomId"
                  element={
                    <ProtectRoute>
                      {/* Full-width room page */}
                      <Room />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="/solana-room/:roomId"
                  element={
                    <ProtectRoute>
                      {/* Full-width solana room page */}
                      <SolanaRoom />
                    </ProtectRoute>
                  }
                />
              </Routes>
            </Context>
          </main>
        </div>

        <Footer className="flex-none" />
        <Toaster richColors position="top-right" />
      </Router>
    </div>
  );
}

export default App;

const Context = ({ children }) => {
  const endpoint = "https://api.devnet.solana.com";
  const wallets = useMemo(() => {
    return [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
  }, []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// const Content = () => {
//   return (
//     <div className="App">
//       <WalletMultiButton />
//     </div>
//   );
// };
