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
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
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
              <div className="container mx-auto p-4 min-h-full flex items-center justify-center">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectRoute isPublic>
                        <LandingPage />
                      </ProtectRoute>
                    }
                  />
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
                  <Route
                    path="/room/:roomId"
                    element={
                      <ProtectRoute>
                        <Room />
                      </ProtectRoute>
                    }
                  />
                </Routes>
              </div>
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
