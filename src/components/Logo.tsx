// Mesmo desenho do favicon (public/favicon.svg), como componente React,
// para usarmos no cabeçalho do site. Mantê-los como dois ficheiros
// separados (em vez de gerar o favicon a partir deste) é uma
// limitação aceitável: favicons têm de ser ficheiros estáticos, não
// podem ser componentes React.
interface LogoProps {
  size?: number;
}

export function Logo({ size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Ícone do GitHub Profile Analytics"
    >
      <rect width="64" height="64" rx="14" fill="#0b0e11" />
      <rect x="2.5" y="2.5" width="59" height="59" rx="12" fill="none" stroke="#1f6b45" strokeWidth="1.5" />
      <path
        d="M12 20 L21 30 L12 40"
        fill="none"
        stroke="#4ade80"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="30" y="34" width="6" height="10" rx="1.5" fill="#4ade80" />
      <rect x="40" y="26" width="6" height="18" rx="1.5" fill="#4ade80" />
      <rect x="50" y="18" width="6" height="26" rx="1.5" fill="#fbbf24" />
    </svg>
  );
}
