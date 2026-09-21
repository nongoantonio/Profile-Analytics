import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { LanguageSlice } from "../types/github";
import { useLanguage } from "../context/LanguageContext";

interface LanguageChartProps {
  data: LanguageSlice[];
}

// Paleta própria para as fatias do gráfico — verde principal + tons
// complementares, todos com bom contraste sobre o fundo escuro.
const COLORS = ["#4ade80", "#fbbf24", "#38bdf8", "#f472b6", "#a78bfa", "#94a3b8"];

export function LanguageChart({ data }: LanguageChartProps) {
  const { t } = useLanguage();

  if (data.length === 0) {
    return (
      <div className="language-chart language-chart--empty">
        <p>{t.languageChart.empty}</p>
      </div>
    );
  }

  return (
    <div className="language-chart">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#151920",
              border: "1px solid #262b33",
              borderRadius: 8,
              color: "#e8eaed",
              fontSize: "0.85rem",
            }}
            formatter={(value, name) => [`${value} ${t.languageChart.tooltipSuffix}`, name]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "0.8rem", color: "#8b94a3" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
