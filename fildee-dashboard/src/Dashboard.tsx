type Indicator = {
  label: string;
  value: string;
  variation: string;
  trend: 'up' | 'down' | 'neutral';
};

type DataPoint = {
  label: string;
  value: number;
};

type Alert = {
  time: string;
  title: string;
  level: 'alta' | 'média' | 'baixa';
};

const indicators: Indicator[] = [
  { label: 'Umidade média do solo', value: '41%', variation: '+3% vs. ontem', trend: 'up' },
  { label: 'Temperatura do ar', value: '28°C', variation: '+1.2°C hoje', trend: 'up' },
  { label: 'Talhões monitorados', value: '24', variation: '100% online', trend: 'neutral' },
  { label: 'Risco hídrico', value: 'Baixo', variation: '-12% na semana', trend: 'down' }
];

const soilMoistureSeries: DataPoint[] = [
  { label: 'Seg', value: 35 },
  { label: 'Ter', value: 37 },
  { label: 'Qua', value: 39 },
  { label: 'Qui', value: 44 },
  { label: 'Sex', value: 42 },
  { label: 'Sáb', value: 41 },
  { label: 'Dom', value: 43 }
];

const airTemperatureSeries: DataPoint[] = [
  { label: 'Seg', value: 24 },
  { label: 'Ter', value: 26 },
  { label: 'Qua', value: 27 },
  { label: 'Qui', value: 30 },
  { label: 'Sex', value: 29 },
  { label: 'Sáb', value: 28 },
  { label: 'Dom', value: 27 }
];

const recentAlerts: Alert[] = [
  { time: '08:15', title: 'Queda brusca de umidade no Talhão 07', level: 'alta' },
  { time: '10:40', title: 'Pico de temperatura acima de 31°C', level: 'média' },
  { time: '13:05', title: 'Sensor S-14 precisa de calibração', level: 'baixa' },
  { time: '16:20', title: 'Janela ideal de irrigação iniciada', level: 'média' }
];

const trendLabel: Record<Indicator['trend'], string> = {
  up: 'dashboard__trend dashboard__trend--up',
  down: 'dashboard__trend dashboard__trend--down',
  neutral: 'dashboard__trend'
};

const alertLabel: Record<Alert['level'], string> = {
  alta: 'alert alert--high',
  média: 'alert alert--medium',
  baixa: 'alert alert--low'
};

function LineChart({ title, data, color, unit }: { title: string; data: DataPoint[]; color: string; unit: string }) {
  const width = 720;
  const height = 230;
  const min = Math.min(...data.map((d) => d.value)) - 2;
  const max = Math.max(...data.map((d) => d.value)) + 2;

  const points = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * (width - 40) + 20;
      const y = height - ((point.value - min) / (max - min)) * (height - 40) - 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <article className="dashboard__panel">
      <header className="dashboard__panelHeader">
        <h3>{title}</h3>
      </header>

      <div className="chart">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
          <polyline points={points} stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * (width - 40) + 20;
            const y = height - ((point.value - min) / (max - min)) * (height - 40) - 20;
            return <circle key={point.label} cx={x} cy={y} r="4" fill={color} />;
          })}
        </svg>

        <ul className="chart__labels">
          {data.map((point) => (
            <li key={point.label}>
              <span>{point.label}</span>
              <strong>
                {point.value}
                {unit}
              </strong>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Dashboard() {
  return (
    <main className="dashboard">
      <section className="dashboard__hero">
        <div>
          <p className="dashboard__overline">Fildee · Monitoramento inteligente</p>
          <h1>Painel operacional de campo</h1>
          <p className="dashboard__subtitle">Visão consolidada dos indicadores climáticos e recomendações automáticas para tomada de decisão.</p>
        </div>
      </section>

      <section className="dashboard__cards" aria-label="Indicadores atuais">
        {indicators.map((indicator) => (
          <article key={indicator.label} className="dashboard__card">
            <p>{indicator.label}</p>
            <strong>{indicator.value}</strong>
            <span className={trendLabel[indicator.trend]}>{indicator.variation}</span>
          </article>
        ))}
      </section>

      <section className="dashboard__grid">
        <LineChart title="Evolução da umidade do solo" data={soilMoistureSeries} color="#1fa87a" unit="%" />
        <LineChart title="Temperatura do ar" data={airTemperatureSeries} color="#eb7f35" unit="°C" />

        <article className="dashboard__panel dashboard__panel--insight">
          <header className="dashboard__panelHeader">
            <h3>Insight da IA Fildee</h3>
          </header>
          <p>
            Com base no padrão dos últimos 7 dias, a IA prevê redução de 6% na umidade média entre domingo e segunda-feira.
            Recomendação: antecipar irrigação noturna no Talhão 07 e priorizar áreas com temperatura acima de 29°C.
          </p>
          <ul>
            <li>Probabilidade de estresse hídrico em 48h: <strong>72%</strong></li>
            <li>Janela sugerida de irrigação: <strong>22:00 às 01:30</strong></li>
            <li>Economia estimada de água com ajuste fino: <strong>até 14%</strong></li>
          </ul>
        </article>

        <article className="dashboard__panel">
          <header className="dashboard__panelHeader">
            <h3>Alertas recentes</h3>
          </header>
          <ul className="alerts">
            {recentAlerts.map((alert) => (
              <li key={`${alert.time}-${alert.title}`} className={alertLabel[alert.level]}>
                <span>{alert.time}</span>
                <p>{alert.title}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
