"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Link from "next/link";
// import { ThemeSwitcher } from "./ThemeSwitcher";
import { useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { ThemeSwitcher } from "./ThemSwitcher";

export default function NavBar() {
  const { user } = useAppSelector((state: RootState) => state.auth);

  const routeMap: Record<string, string> = {
    user: "/user-dashboard",
    admin: "/dashboard/admin",
  };

  return (
    <Navbar maxWidth="2xl">
      <NavbarBrand>
        <Link className="flex" href="/">
          <p className="font-bold text-inherit px-4">APOLLO GEARS</p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {!user ? (
          <>
            <NavbarItem>
              <Link href="/register">Register</Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/login">Login</Link>
            </NavbarItem>
          </>
        ) : (
          <>
            {/* <NavbarItem isActive>
              <Link href="#">Customers</Link>
            </NavbarItem> */}
            <NavbarItem>
              <Link href={routeMap[user.role] || "/"}>  {user
    ? routeMap[user.role]
        .split("/") // Split the route by "/"
        .pop() // Get the last part after "/"
        ?.split("-") // Split by "-" to capitalize
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join("-") // Rejoin the words with "-"
    : "Home"}</Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
