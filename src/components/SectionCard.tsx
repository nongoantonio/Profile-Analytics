import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  delay?: number;
}

// Componente pequeno e "burro": só dá um cabeçalho consistente
// (ícone + título) a todas as secções do dashboard, para não repetir
// o mesmo markup em cada uma.
export function SectionCard({ title, icon, children, delay = 0 }: SectionCardProps) {
  return (
    <motion.section
      className="section-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
    >
      <h3 className="section-card__title">
        {icon}
        {title}
      </h3>
      {children}
    </motion.section>
  );
}
