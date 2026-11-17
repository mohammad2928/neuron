import { motion } from 'framer-motion'
import { Box, Flow, Scene, Svg, Dot } from './sceneKit'

export function MlLoop({ playing }: { playing: boolean }) {
  const nodes = [
    { x: 190, y: 36, label: 'Data', c: '#38bdf8' },
    { x: 330, y: 110, label: 'Model', c: '#2dd4bf' },
    { x: 190, y: 200, label: 'Predict', c: '#fbbf24' },
    { x: 50, y: 110, label: 'Learn', c: '#fb7185' },
  ]
  return (
    <Scene caption="چرخه یادگیری ماشین: داده → مدل → پیش‌بینی → یادگیری">
      <Svg>
        {playing && (
          <motion.ellipse
            cx="210"
            cy="140"
            rx="120"
            ry="78"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth={2}
            strokeDasharray="8 8"
            initial={{ pathLength: 0, rotate: 0 }}
            animate={{ pathLength: 1, rotate: 360 }}
            transition={{ pathLength: { duration: 1 }, rotate: { duration: 10, repeat: Infinity, ease: 'linear' } }}
            style={{ transformOrigin: '210px 140px' }}
          />
        )}
        {nodes.map((n, i) => (
          <Box key={n.label} x={n.x} y={n.y} w={90} h={42} label={n.label} color={n.c} delay={i * 0.12} playing={playing} />
        ))}
      </Svg>
    </Scene>
  )
}

export function LearningTypes({ playing }: { playing: boolean }) {
  const items = [
    { t: 'Supervised', c: '#2dd4bf' },
    { t: 'Unsupervised', c: '#38bdf8' },
    { t: 'RL', c: '#fbbf24' },
  ]
  return (
    <Scene caption="سه خانواده اصلی یادگیری">
      <Svg>
        {items.map((it, i) => (
          <g key={it.t}>
            <Box x={40 + i * 145} y={100} w={120} h={70} label={it.t} color={it.c} delay={i * 0.15} playing={playing} />
            {playing &&
              Array.from({ length: 5 }).map((_, k) => (
                <motion.circle
                  key={k}
                  cx={70 + i * 145 + k * 14}
                  cy={70}
                  r={4}
                  fill={it.c}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: [0, 8, 0], opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 + k * 0.05, duration: 1.4, repeat: Infinity }}
                />
              ))}
          </g>
        ))}
      </Svg>
    </Scene>
  )
}

export function DataSplit({ playing }: { playing: boolean }) {
  const parts = [
    { label: 'Train', w: 240, c: '#2dd4bf' },
    { label: 'Val', w: 90, c: '#fbbf24' },
    { label: 'Test', w: 80, c: '#fb7185' },
  ]
  let x = 40
  return (
    <Scene caption="جداسازی داده برای تعمیم واقعی">
      <Svg>
        {parts.map((p, i) => {
          const bx = x
          x += p.w + 12
          return (
            <motion.g key={p.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}>
              <motion.rect
                x={bx}
                y={110}
                width={p.w}
                height={60}
                rx={14}
                fill="#0b1524"
                stroke={p.c}
                strokeWidth={2}
                animate={playing ? { scaleY: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                style={{ transformOrigin: `${bx + p.w / 2}px 140px` }}
              />
              <text x={bx + p.w / 2} y={145} textAnchor="middle" fill={p.c} fontSize={14} fontFamily="Syne, Vazirmatn">
                {p.label}
              </text>
            </motion.g>
          )
        })}
      </Svg>
    </Scene>
  )
}

export function BiasVariance({ playing }: { playing: boolean }) {
  return (
    <Scene caption="تعادل بایاس–واریانس">
      <Svg>
        <text x="120" y="40" textAnchor="middle" fill="#94a3b8" fontSize={12}>
          Underfit
        </text>
        <text x="360" y="40" textAnchor="middle" fill="#94a3b8" fontSize={12}>
          Overfit
        </text>
        <motion.path
          d="M40 180 Q 140 40 240 140 T 440 80"
          fill="none"
          stroke="#fb7185"
          strokeWidth={3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: playing ? 1 : 0.3 }}
          transition={{ duration: 1.4 }}
        />
        <motion.path
          d="M40 160 Q 160 150 240 145 T 440 140"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth={3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: playing ? 1 : 0.3 }}
          transition={{ duration: 1.4, delay: 0.2 }}
        />
        {playing && <Dot x={240} y={145} color="#fbbf24" delay={0.8} />}
      </Svg>
    </Scene>
  )
}

export function LossCurve({ playing }: { playing: boolean }) {
  return (
    <Scene caption="کاهش Loss در طول آموزش">
      <Svg>
        <line x1="50" y1="220" x2="440" y2="220" stroke="#475569" />
        <line x1="50" y1="40" x2="50" y2="220" stroke="#475569" />
        <motion.path
          d="M50 50 C 120 40, 160 160, 230 140 S 340 90, 430 70"
          fill="none"
          stroke="url(#flowGrad)"
          strokeWidth={4}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6 }}
        />
        {playing && (
          <motion.circle
            r={7}
            fill="#fbbf24"
            animate={{
              cx: [50, 140, 230, 330, 430],
              cy: [50, 100, 140, 95, 70],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <text x="240" y="255" textAnchor="middle" fill="#94a3b8" fontSize={12}>
          steps →
        </text>
      </Svg>
    </Scene>
  )
}

export function GradientDescent({ playing }: { playing: boolean }) {
  return (
    <Scene caption="گرادیان کاهشی روی سطح خطا">
      <Svg>
        <motion.path
          d="M40 80 Q 140 20, 240 120 T 440 70"
          fill="none"
          stroke="#334155"
          strokeWidth={18}
          strokeLinecap="round"
        />
        <motion.path
          d="M40 80 Q 140 20, 240 120 T 440 70"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth={3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2 }}
        />
        {playing && (
          <motion.circle
            r={10}
            fill="#fbbf24"
            animate={{
              cx: [60, 120, 180, 240, 300, 360],
              cy: [70, 40, 80, 120, 95, 75],
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <text x="240" y="190" textAnchor="middle" fill="#94a3b8" fontSize={13} fontFamily="Vazirmatn">
          حرکت به سمت کمینهٔ محلی/سراسری
        </text>
      </Svg>
    </Scene>
  )
}

export function Regularization({ playing }: { playing: boolean }) {
  return (
    <Scene caption="منظم‌سازی پیچیدگی مدل را مهار می‌کند">
      <Svg>
        <Box x={50} y={90} w={140} h={80} label="Complex" color="#fb7185" playing={playing} />
        <Flow x1={200} y1={130} x2={260} y2={130} delay={0.3} />
        <Box x={270} y={90} w={150} h={80} label="+ L2 / Dropout" color="#2dd4bf" delay={0.2} playing={playing} />
        {playing &&
          [0, 1, 2].map((i) => (
            <motion.rect
              key={i}
              x={80 + i * 28}
              y={200}
              width={18}
              height={40}
              rx={4}
              fill="#fb7185"
              animate={{ height: [40, 18, 40], opacity: [0.9, 0.4, 0.9] }}
              transition={{ delay: i * 0.15, duration: 1.5, repeat: Infinity }}
            />
          ))}
      </Svg>
    </Scene>
  )
}

export function MetricsBoard({ playing }: { playing: boolean }) {
  const metrics = [
    { n: 'Acc', v: 0.86 },
    { n: 'F1', v: 0.81 },
    { n: 'AUC', v: 0.9 },
    { n: 'RMSE', v: 0.35 },
  ]
  return (
    <Scene caption="متریک‌ها کیفیت واقعی را نشان می‌دهند">
      <Svg>
        {metrics.map((m, i) => (
          <g key={m.n}>
            <text x={70 + i * 100} y={230} textAnchor="middle" fill="#94a3b8" fontSize={12}>
              {m.n}
            </text>
            <motion.rect
              x={55 + i * 100}
              y={200 - m.v * 140}
              width={30}
              height={m.v * 140}
              rx={8}
              fill="url(#barGrad)"
              initial={{ height: 0, y: 200 }}
              animate={{ height: playing ? m.v * 140 : 20, y: playing ? 200 - m.v * 140 : 180 }}
              transition={{ delay: i * 0.12, type: 'spring' }}
            />
          </g>
        ))}
      </Svg>
    </Scene>
  )
}

export function FeaturePipeline({ playing }: { playing: boolean }) {
  return (
    <Scene caption="از داده خام تا ویژگی قابل یادگیری">
      <Svg>
        <Box x={30} y={110} w={100} h={50} label="Raw" color="#94a3b8" playing={playing} />
        <Flow x1={135} y1={135} x2={175} y2={135} />
        <Box x={180} y={110} w={110} h={50} label="Clean" color="#38bdf8" delay={0.15} playing={playing} />
        <Flow x1={295} y1={135} x2={335} y2={135} delay={0.2} />
        <Box x={340} y={110} w={110} h={50} label="Features" color="#2dd4bf" delay={0.3} playing={playing} />
        {playing && (
          <motion.circle
            r={6}
            fill="#fbbf24"
            animate={{ cx: [80, 235, 395], cy: [135, 135, 135] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
        )}
      </Svg>
    </Scene>
  )
}
