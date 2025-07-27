import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../ui/alert";
// import { useAuth } from "../../contexts/AuthContext";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { toast } from "sonner";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const LoginForm = () => {
  const navigate = useNavigate();
  // const { login, loginWithSolana } = useAuth();
  // const { publicKey, signMessage } = useWallet();

  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      return await login(data);
    },
    onSuccess: () => {
      // Navigate to the page user tried to visit before being redirected to login
      navigate("/dashboard");
    },
  });

  const handleSubmit = (data) => {
    mutate(data);
  };

  // const handleSolanaLogin = async () => {
  //   try {
  //     if (!publicKey || !signMessage) {
  //       toast.error("Wallet not connected or signing not supported");
  //       return;
  //     }

  //     const base58PublicKey = publicKey.toBase58();
  //     const message = `Login to your account - ${base58PublicKey} - ${Date.now()}`;
  //     const encodedMessage = new TextEncoder().encode(message);
  //     const signature = await signMessage(encodedMessage);
  //     const signatureArr = Array.from(signature);

  //     await loginWithSolana({
  //       publicKey: base58PublicKey,
  //       message,
  //       signature: signatureArr,
  //     });

  //     toast.success("Logged in with wallet");
  //     navigate("/dashboard");
  //   } catch (err) {
  //     toast.error("Solana login failed");
  //   }
  // };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error.message}
          </Alert>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Link>
                <Button variant="link" className="px-0 font-normal">
                  Forgot password?
                </Button>
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleSolanaLogin}
            disabled={isLoading}
          >
            Login with Solana Wallet
          </Button> */}
          <WalletMultiButton />

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            Login with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/signup">
            <Button variant="link" className="px-1 font-normal">
              Sign up
            </Button>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
