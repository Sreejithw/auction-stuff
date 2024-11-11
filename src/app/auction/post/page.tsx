
'use client'

import { pageTitleStyled } from "@/styles";
import EquipmentForm from "./equipment-form";

export default function CreateAuctionPage() {
  return (
    <main className="space-y-8">
      <div className="flex flex-col justify-center items-center gap-y-6 mt-5">
        <h1 className={pageTitleStyled}>
          Post An Item For Auction 
        </h1>
        <EquipmentForm />
      </div>
    </main>
  );
}
