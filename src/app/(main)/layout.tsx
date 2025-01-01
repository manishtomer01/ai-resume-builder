import { ReactNode } from "react";
import Navbar from "./Navbar";
import PremiumModal from "@/components/premium/PremiumModal";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {children}
      <PremiumModal />
    </div>
  );
}
