import LoginPage from "@/components/auth/Login-form";
import { RegisterForm } from "@/components/auth/SignupForm";
import React from "react";
import AuthRoute from "@/components/AuthRoute";

const Auth = () => {
  return (
    <AuthRoute>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <LoginPage />
          <RegisterForm />
        </div>
      </div>
    </AuthRoute>
  );
};

export default Auth;
