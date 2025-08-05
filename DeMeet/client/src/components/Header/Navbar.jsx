import {
  BellRing,
  CircleUser,
  Settings,
  User2,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { useAuthService } from "@/services/user/hooks";

export default function Navbar() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { useLogout } = useAuthService();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="flex border-b bg-background w-full shadow-md">
      <div className="p-2 md:p-4 md:px-6 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-center gap-4">
            <img
              src="/logo_light.png"
              alt="DeMeet"
              className="w-12 object-cover dark:hidden"
            />
            <img
              src="/logo_dark.png"
              alt="DeMeet"
              className="w-12 object-cover hidden dark:block"
            />
            <a href="/" className="text-xl font-semibold">
              DeMeet
            </a>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />

            {user ? (
              <>
                <Button variant="ghost" size="icon">
                  <BellRing className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <CircleUser className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User2 className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
