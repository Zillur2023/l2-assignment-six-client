"use client";

import { NavbarWrapper } from "../../components/dashboardNabbar/dashboardNavbar";
import { SidebarWrapper } from "../../components/sidebar/sidebar.styles";

// import { NavbarWrapper } from "@/app/(dashboardLayout)/components/dashboardNabbar/dashboardNavbar";
// import { SidebarWrapper } from "@/app/(dashboardLayout)/components/sidebar/sidebar.styles";

interface Props {
  children: React.ReactNode;
}

export const UserLayout = ({ children }: Props) => {
  return (
    <section className="flex">
      <SidebarWrapper/>

      <NavbarWrapper>{children}</NavbarWrapper>
    </section>
  );
};