import type { Metadata } from "next";
import NavBar from "./compunents/page/shared/Navbar";
import Footer from "./compunents/page/shared/Footer";


export const metadata: Metadata = {
  title: "Apollo Gears",
  description: "Next Level Riding Sharing Service",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar/>
      {children}
      <Footer/>
    </div>
  );
}
