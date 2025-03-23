import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { nanoid } from "nanoid";
import GeminiPowered from "./Gemini_logo";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token")); // Clear token if invalid
    }
  }, []);

  return (
    <div className="flex justify-center">
      <Card className="container bg-card border-0 flex items-center justify-between gap-6 px-2">
      
        <ul className="hidden md:flex items-center gap-10 text-card-foreground">
          <li className="text-primary font-medium">
            <Link to="/">Home</Link>
          </li>
          {user?
          (<>
          <li>
            <Link to="/dash">Dashboard</Link>
          </li>
          <li>
            <Link to="/quiz">MCQ</Link>
          </li>
          <li>
            <Link to="/game">Scramble word</Link>
          </li>
          </>
        ):(<></>)}
          <li>
            <Link to="/feat">Features</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>
        </ul>

        {/* Right Side Buttons */}
        <div className="flex items-center">
          {/* Mobile Menu */}
          <div className="flex md:hidden mr-2 items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5 rotate-0 scale-100" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                <Link to="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                <Link to="/feat">Features</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                <Link to="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button variant="secondary" className="w-full text-sm">
                    Login
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button className="w-full text-sm">Get Started</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>



          {/* <ThemeToggle /> */}
          <ModeToggle />
          {/* Gemini credit */}
          <GeminiPowered />
        </div>
      </Card>
    </div>
  );
};

// Landing Page Routes
const landings = [
  {
    id: nanoid(),
    title: "Landing 01",
    route: "/project-management",
  },
  {
    id: nanoid(),
    title: "Landing 02",
    route: "/crm-landing",
  },
  {
    id: nanoid(),
    title: "Landing 03",
    route: "/ai-content-landing",
  },
  {
    id: nanoid(),
    title: "Landing 04",
    route: "/new-intro-landing",
  },
  {
    id: nanoid(),
    title: "Landing 05",
    route: "/about-us-landing",
  },
  {
    id: nanoid(),
    title: "Landing 06",
    route: "/contact-us-landing",
  },
  {
    id: nanoid(),
    title: "Landing 07",
    route: "/faqs-landing",
  },
  {
    id: nanoid(),
    title: "Landing 08",
    route: "/pricing-landing",
  },
  {
    id: nanoid(),
    title: "Landing 09",
    route: "/career-landing",
  },
];

export default Navbar;