import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Alert } from "some-ui-library";
import { login } from "some-api-service";

const LoginForm = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const { mutate, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      return await login(data);
    },
    onSuccess: () => {
      // Navigate to the page user tried to visit before being redirected to login
      navigate("/dashboard");
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} placeholder="Username" />
      <input {...register("password")} type="password" placeholder="Password" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error.message}
        </Alert>
      )}
    </form>
  );
};

export default LoginForm;
