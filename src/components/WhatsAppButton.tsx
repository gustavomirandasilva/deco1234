import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  return (
    <Link
      href={buildWhatsAppLink("Olá! Gostaria de saber mais sobre os perfumes da Deco Imports.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl focus:outline-none"
      aria-label="Contato pelo WhatsApp"
    >
      <FaWhatsapp className="h-8 w-8" />
    </Link>
  );
}
