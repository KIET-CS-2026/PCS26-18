import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col gap-8 lg:flex-row items-center justify-center p-4 md:p-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
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
          <span className="text-3xl font-bold mb-1">DeMeet</span>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-6xl font-bold flex flex-wrap">
            Decentralized Meetings for the Web3 Era
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Experience secure, private, and decentralized video meetings powered
            by blockchain technology.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {user ? (
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          ) : (
            <Button onClick={() => navigate("/signup")}>Sign up</Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Try for your Organisation
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuItem>Schedule a meeting</DropdownMenuItem>
              <DropdownMenuItem>Join a meeting</DropdownMenuItem>
              <DropdownMenuItem>Learn more</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4 pt-4">
          <span className="text-sm">Join a meeting now</span>
          <Input placeholder="Meeting ID / Code" className="w-52" />
          <Info className="h-4 w-4" />
        </div>
      </div>
      <div className="w-3/4 h-full">
        <img
          src="/hero_light.png"
          alt="DeMeet"
          className="object-cover dark:hidden"
        />
        <img
          src="/hero_dark.png"
          alt="DeMeet"
          className="object-cover hidden dark:block"
        />
      </div>
    </div>
  );
}
