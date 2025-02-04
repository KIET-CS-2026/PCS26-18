import LoginPage from "@/components/auth/Login-form";
import { RegisterForm } from "@/components/auth/SignupForm";
import React from "react";

const Auth = () => {
  return (
    <div>
      <LoginPage />
      <RegisterForm/>
    </div>
  );
};

export default Auth;
