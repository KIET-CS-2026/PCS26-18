import {
  BellRing,
  CircleUser,
  Settings,
  User2,
  LogOut,
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
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const{logout} = useAuth();
  const navigate = useNavigate();
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
            />{" "}
            <a href="/" className="text-xl font-semibold">
              DeMeet
            </a>
          </div>

          <div className="flex gap-4 sm:gap-8">
            <div className="flex items-center gap-4 sm:gap-8">
              <Button
                variant="outline"
                className=""
                onClick={() => navigate("/dashboard")}
              >
                DashBoard
              </Button>
              <BellRing className="h-[1.2rem] w-[1.2rem]" />
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <CircleUser className="h-[1.2rem] w-[1.2rem]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="">
                  <DropdownMenuItem>
                    <User2 className="w-4 h-4 sm:w-6 sm:h-6" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 sm:w-6 sm:h-6" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 sm:w-6 sm:h-6" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
