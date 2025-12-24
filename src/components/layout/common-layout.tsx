import type { ReactNode } from "react";
import Footer from "./footer";
import Navbar from "./navbar";

interface IProps {
  children: ReactNode;
}

export default function CommonLayout({ children }: IProps) {
  return (
    <div className=" min-h-screen flex flex-col">
      <Navbar />
      <div className="grow-1">{children}</div>
      <Footer />
    </div>
  );
}
