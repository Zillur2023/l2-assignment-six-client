"use client";

import { NavbarWrapper } from "../../components/dashboardNabbar/dashboardNavbar";
import { UserSidebarWrapper } from "../../components/sidebar/userSidebar";

// import { NavbarWrapper } from "@/app/(dashboardLayout)/components/dashboardNabbar/dashboardNavbar";
// import { SidebarWrapper } from "@/app/(dashboardLayout)/components/sidebar/sidebar.styles";

interface Props {
  children: React.ReactNode;
}

export const UserLayout = ({ children }: Props) => {
  return (
    <section className="flex">
      {/* <SidebarWrapper></SidebarWrapper> */}
      <UserSidebarWrapper/>

      <NavbarWrapper>{children}</NavbarWrapper>
    </section>
  );
};
