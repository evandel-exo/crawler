import type { Metadata } from "next";
import { Header } from "@/components/sites/raceroms/Header";
import { HeroBrands } from "@/components/sites/raceroms/HeroBrands";
import { EquipmentSection, Reviews, Specialty, Trust } from "@/components/sites/raceroms/Sections";
import { Faq } from "@/components/sites/raceroms/Faq";
import { Footer } from "@/components/sites/raceroms/Footer";

export const metadata: Metadata = {
  title: "Βελτιώσεις Αυτοκινήτων & ECU Remapping | Raceroms",
  description:
    "Είμαστε μια επιχείρηση chip tuning που ειδικεύεται στην αύξηση ιπποδύναμης και ροπής για αυτοκίνητα, μηχανές, φορτηγά, αγροτικά, jetski και σκάφη, με καταστήματα σε Θεσσαλονίκη, Αθήνα, Ρόδο και Ιωάννινα.",
};

export default function Home() {
  return (
    <div className="raceroms app">
      <Header />
      <div className="rr-container relative max-lg:hidden">
        <div className="absolute left-[50%] -z-10 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-primary-light opacity-15 blur-[150px] lg:-left-[65px] lg:-top-[57px] lg:h-[424px] lg:w-[424px] lg:translate-x-0" />
      </div>
      <div>
        <HeroBrands />
        <Specialty />
        <Trust />
        <EquipmentSection />
        <Reviews />
        <Faq />
      </div>
      <Footer />
    </div>
  );
}
