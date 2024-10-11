"use client";
import {
    Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
// import { Cog } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemSwitcher";
// import { useAppSelector } from "@/app/redux/hooks";
// import { RootState } from "@/app/redux/store";
import {useAppSelector} from "../../../../redux/hooks"
import {RootState} from "../../../../redux/store"
// import { logout } from "@/app/redux/features/auth/authSlice";
// import {logout} from "../../../../redux/features/auth/authSlice"

export default function NavBar() {
  const {user} = useAppSelector((state:RootState) => state.auth)
  console.log('user',user)
  const routeMap: Record<string, string> = {
    user: "/user-dashboard",
    admin: "/dashboard/admin",
  };

  return (
   <>
  { !user? 
    <Navbar maxWidth="2xl">
    <NavbarBrand>
      <Link className="flex" href="/">
        {/* <Cog /> */}
        <p className="font-bold text-inherit px-4">APOLLO GEARS</p>
      </Link>
    </NavbarBrand>

    <NavbarContent className="hidden sm:flex gap-4" justify="center">
      <NavbarItem>
        <Link color="foreground" href="/register">
          Register
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link color="foreground" href="/login">
          Login
        </Link>
      </NavbarItem>
      <NavbarItem isActive>
        <Link href="#" aria-current="page">
          Customers
        </Link>
      </NavbarItem>
      <NavbarItem>
        {/* {user && <Link href={routeMap[user?.role]}>Dashboard</Link>} */}
        <Link href={routeMap.user}>Dashboard</Link>
      </NavbarItem>
    </NavbarContent>
    <NavbarContent justify="end">
      <NavbarItem>
        <ThemeSwitcher />
      </NavbarItem>

      {/* {user ? (
        <NavbarItem>
          <Button onClick={logout} color="primary" variant="flat">
            Logout
          </Button>
        </NavbarItem>
      ) : (
        <NavbarItem className="hidden lg:flex">
          <Link href="/login">Login</Link>
        </NavbarItem>
      )} */}
    </NavbarContent>
  </Navbar> : user.role === "admin" ? routeMap.admin : routeMap.user}
   </>
  );
}
