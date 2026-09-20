import { AlertTriangle, Clock } from "lucide-react";

interface StateMessageProps {
  title: string;
  description: string;
  variant?: "error" | "rate-limit";
}

export function StateMessage({ title, description, variant = "error" }: StateMessageProps) {
  const Icon = variant === "rate-limit" ? Clock : AlertTriangle;

  return (
    <div className={"state-message state-message--" + variant}>
      <Icon size={28} strokeWidth={1.8} aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
