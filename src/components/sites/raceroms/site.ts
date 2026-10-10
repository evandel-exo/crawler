// Out-of-scope routes point back to the live site.
export const SOURCE = "https://raceroms.com";

export type NavLink = { label: string; href: string };
export type NavItem = NavLink | { label: string; children: NavLink[] };

export const navItems: NavItem[] = [
  { label: "Αρχική", href: "/" },
  { label: "Υπηρεσίες", href: `${SOURCE}/services` },
  { label: "Δουλειές μας", href: `${SOURCE}/projects` },
  { label: "e-shop", href: `${SOURCE}/shop` },
  { label: "Το Blog μας", href: `${SOURCE}/blog` },
  {
    label: "Tuning",
    children: [
      { label: "Συχνές Ερωτήσεις", href: `${SOURCE}/FAQ` },
      { label: "Εξοπλισμός", href: `${SOURCE}/equipment` },
    ],
  },
  {
    label: "Εταιρεία",
    children: [
      { label: "Εξουσιοδοτημένοι Μεταπωλητές", href: `${SOURCE}/authorized-dealers` },
      { label: "Ποιοί Είμαστε", href: `${SOURCE}/about` },
      { label: "Βίντεο", href: `${SOURCE}/videos` },
    ],
  },
  { label: "Επικοινωνία", href: `${SOURCE}/contact` },
];

export const socials = [
  { icon: "rr-i-simple-icons-whatsapp", href: "https://wa.me/306987706053", label: "+306987706053" },
  { icon: "rr-i-simple-icons-instagram", href: "https://www.instagram.com/raceroms/", label: "raceroms" },
  { icon: "rr-i-simple-icons-facebook", href: "https://www.facebook.com/raceroms", label: "https://www.facebook.com/raceroms" },
  { icon: "rr-i-simple-icons-tiktok", href: "https://www.tiktok.com/@raceroms", label: "https://www.tiktok.com/@raceroms" },
  { icon: "rr-i-simple-icons-youtube", href: "https://www.youtube.com/@raceroms", label: "raceroms" },
  { icon: "rr-i-simple-icons-viber", href: "viber://contact?number=%2B306973766116", label: "Contact us on Viber" },
];

export const phoneMenu = [
  { city: "Θεσσαλονίκη", phone: "+30 2311 11 2990" },
  { city: "Αθήνα", phone: "+30 211 4233 343" },
  { city: "Ιωαννινα", phone: "+30 2651 091624" },
  { city: "Ρόδος", phone: "+30 6976 762533" },
  { city: "On The Go", phone: "+30 698 6816 636" },
];

export const languages = [
  { code: "en", label: "English", flag: "/sites/raceroms/images/en.svg", href: `${SOURCE}/en` },
  { code: "gr", label: "Greek", flag: "/sites/raceroms/images/gr.svg", href: "/" },
];
