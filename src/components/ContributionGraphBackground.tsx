// Fundo puramente decorativo do hero, inspirado no "calendário de
// contribuições" que muitas plataformas de código usam (uma grelha de
// quadrados, cada um com um tom de verde consoante a intensidade de
// atividade nesse dia). Não é uma cópia de nenhum logótipo — é um
// padrão genérico de visualização de dados (um "heatmap"), aqui feito
// só com CSS/SVG, sem depender de nenhuma imagem externa.
//
// Os valores de intensidade são fixos (não aleatórios a cada render),
// para o fundo não "saltar" cada vez que o componente atualiza.
const INTENSITY_PATTERN = [
  0, 1, 0, 2, 1, 0, 3, 2, 1, 0, 2, 4, 1, 0, 2, 1, 0, 3, 1, 0,
  1, 0, 2, 1, 3, 0, 1, 2, 0, 4, 2, 1, 0, 1, 3, 0, 2, 1, 0, 2,
  0, 2, 1, 0, 3, 1, 2, 0, 1, 0, 4, 2, 1, 0, 2, 1, 3, 0, 1, 0,
  2, 0, 1, 3, 0, 2, 1, 0, 4, 1, 0, 2, 1, 0, 3, 1, 0, 2, 1, 0,
];

const COLUMNS = 20;
const CELL = 13;
const GAP = 4;

export function ContributionGraphBackground() {
  return (
    <svg
      className="contribution-bg"
      viewBox={`0 0 ${COLUMNS * (CELL + GAP)} ${4 * (CELL + GAP)}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {INTENSITY_PATTERN.map((level, index) => {
        const column = index % COLUMNS;
        const row = Math.floor(index / COLUMNS);
        return (
          <rect
            key={index}
            x={column * (CELL + GAP)}
            y={row * (CELL + GAP)}
            width={CELL}
            height={CELL}
            rx={3}
            className={`contribution-bg__cell contribution-bg__cell--${level}`}
          />
        );
      })}
    </svg>
  );
}
