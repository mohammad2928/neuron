import { motion } from 'framer-motion'
import { Box, Flow, Scene, Svg, Dot } from './sceneKit'

export function PerceptronViz({ playing }: { playing: boolean }) {
  return (
    <Scene caption="پرسپترون: وزن‌دهی ورودی‌ها + فعال‌سازی">
      <Svg>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <Dot x={70} y={70 + i * 60} color="#38bdf8" delay={i * 0.1} />
            <Flow x1={85} y1={70 + i * 60} x2={200} y2={140} delay={0.15 * i} />
          </g>
        ))}
        <Box x={200} y={110} w={100} h={60} label="Σ + f" color="#2dd4bf" playing={playing} />
        <Flow x1={305} y1={140} x2={380} y2={140} delay={0.5} color="#fbbf24" />
        <Box x={380} y={115} w={70} h={50} label="y" color="#fbbf24" delay={0.4} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function MlpLayers({ playing }: { playing: boolean }) {
  const layers = [
    [70, 3],
    [180, 4],
    [290, 4],
    [400, 2],
  ] as const
  return (
    <Scene caption="MLP: لایه‌های پنهان ظرفیت غیرخطی می‌سازند">
      <Svg>
        {layers.map(([x, n], li) =>
          Array.from({ length: n }).map((_, i) => {
            const y = 140 - ((n - 1) * 28) / 2 + i * 28
            return (
              <motion.circle
                key={`${li}-${i}`}
                cx={x}
                cy={y}
                r={12}
                fill="#0b1524"
                stroke={['#94a3b8', '#38bdf8', '#2dd4bf', '#fbbf24'][li]}
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: li * 0.15 + i * 0.05 }}
              />
            )
          }),
        )}
        {playing &&
          layers.slice(0, -1).map(([x, n], li) => {
            const x2 = layers[li + 1][0]
            const n2 = layers[li + 1][1]
            return Array.from({ length: n }).flatMap((_, i) =>
              Array.from({ length: n2 }).map((__, j) => {
                const y1 = 140 - ((n - 1) * 28) / 2 + i * 28
                const y2 = 140 - ((n2 - 1) * 28) / 2 + j * 28
                return (
                  <motion.line
                    key={`${li}-${i}-${j}`}
                    x1={x + 12}
                    y1={y1}
                    x2={x2 - 12}
                    y2={y2}
                    stroke="#2dd4bf"
                    strokeWidth={1}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.08, 0.35, 0.08] }}
                    transition={{ duration: 2, delay: (i + j) * 0.05, repeat: Infinity }}
                  />
                )
              }),
            )
          })}
      </Svg>
    </Scene>
  )
}

export function Activations({ playing }: { playing: boolean }) {
  return (
    <Scene caption="ReLU / Sigmoid / Tanh — غیرخطی ضروری">
      <Svg>
        {[
          { d: 'M40 200 L140 200 L160 60 L240 60', c: '#2dd4bf', n: 'ReLU' },
          { d: 'M260 200 C 300 200, 320 60, 380 60', c: '#38bdf8', n: 'Sigmoid' },
        ].map((p, i) => (
          <g key={p.n}>
            <motion.path
              d={p.d}
              fill="none"
              stroke={p.c}
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: playing ? 1 : 0.4 }}
              transition={{ duration: 1.2, delay: i * 0.2 }}
            />
            <text x={i === 0 ? 120 : 340} y={40} fill={p.c} fontSize={13}>
              {p.n}
            </text>
          </g>
        ))}
      </Svg>
    </Scene>
  )
}

export function BackpropViz({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Forward برای خروجی · Backward برای گرادیان">
      <Svg>
        <Box x={40} y={110} w={90} h={50} label="x" playing={playing} />
        <Flow x1={135} y1={135} x2={175} y2={135} />
        <Box x={180} y={110} w={90} h={50} label="fθ" color="#38bdf8" delay={0.15} playing={playing} />
        <Flow x1={275} y1={135} x2={315} y2={135} delay={0.2} />
        <Box x={320} y={110} w={90} h={50} label="Loss" color="#fb7185" delay={0.3} playing={playing} />
        {playing && (
          <motion.path
            d="M365 165 C 280 230, 180 230, 95 165"
            fill="none"
            stroke="#fbbf24"
            strokeWidth={3}
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <text x={240} y={250} textAnchor="middle" fill="#fbbf24" fontSize={12}>
          ∂L/∂θ
        </text>
      </Svg>
    </Scene>
  )
}

export function NormFlow({ playing }: { playing: boolean }) {
  return (
    <Scene caption="نرمال‌سازی توزیع فعال‌سازی‌ها را پایدار می‌کند">
      <Svg>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.rect
            key={i}
            x={60 + i * 70}
            y={80}
            width={40}
            height={120}
            rx={10}
            fill="#0b1524"
            stroke="#38bdf8"
            animate={{
              height: playing ? [60 + i * 18, 90, 60 + i * 18] : 100,
              y: playing ? [140 - (60 + i * 18) / 2, 95, 140 - (60 + i * 18) / 2] : 80,
            }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
        <motion.line
          x1="50"
          x2="430"
          y1="140"
          y2="140"
          stroke="#2dd4bf"
          strokeDasharray="4 4"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </Svg>
    </Scene>
  )
}

export function DropoutViz({ playing }: { playing: boolean }) {
  const nodes = Array.from({ length: 12 }, (_, i) => ({
    x: 80 + (i % 4) * 90,
    y: 70 + Math.floor(i / 4) * 70,
    drop: i === 2 || i === 5 || i === 9,
  }))
  return (
    <Scene caption="Dropout بعضی نورون‌ها را تصادفاً خاموش می‌کند">
      <Svg>
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={18}
            fill={n.drop ? '#1f2937' : '#0b1524'}
            stroke={n.drop ? '#475569' : '#2dd4bf'}
            strokeWidth={2}
            animate={
              playing && n.drop
                ? { opacity: [1, 0.15, 1], scale: [1, 0.7, 1] }
                : { opacity: 1 }
            }
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.05 }}
          />
        ))}
      </Svg>
    </Scene>
  )
}

export function CnnFilters({ playing }: { playing: boolean }) {
  return (
    <Scene caption="CNN: فیلتر روی تصویر می‌لغزد">
      <Svg>
        <rect x="40" y="50" width="180" height="180" rx="12" fill="#0b1524" stroke="#64748b" strokeWidth={2} />
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 6 }).map((__, c) => (
            <rect
              key={`${r}-${c}`}
              x={55 + c * 26}
              y={65 + r * 26}
              width={22}
              height={22}
              rx={3}
              fill={`rgba(45,212,191,${0.15 + ((r + c) % 3) * 0.15})`}
            />
          )),
        )}
        {playing && (
          <motion.rect
            width={56}
            height={56}
            rx={6}
            fill="rgba(251,191,36,0.2)"
            stroke="#fbbf24"
            strokeWidth={2}
            animate={{ x: [55, 133, 55], y: [65, 143, 65] }}
            transition={{ duration: 3.2, repeat: Infinity }}
          />
        )}
        <Flow x1={235} y1={140} x2={285} y2={140} delay={0.2} />
        <Box x={290} y={105} w={140} h={70} label="Feature map" color="#38bdf8" playing={playing} />
      </Svg>
    </Scene>
  )
}

export function PoolingViz({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Pooling اندازه را کم و ویژگی غالب را نگه می‌دارد">
      <Svg>
        {[0, 1, 2, 3].map((i) => (
          <motion.rect
            key={i}
            x={50 + (i % 2) * 70}
            y={70 + Math.floor(i / 2) * 70}
            width={60}
            height={60}
            rx={8}
            fill="#134e4a"
            stroke="#2dd4bf"
            animate={{ opacity: playing ? [0.5, 1, 0.5] : 1 }}
            transition={{ delay: i * 0.1, duration: 1.4, repeat: Infinity }}
          />
        ))}
        <Flow x1={210} y1={140} x2={270} y2={140} />
        <Box x={280} y={105} w={120} h={70} label="MaxPool" color="#fbbf24" playing={playing} />
      </Svg>
    </Scene>
  )
}

export function ResidualViz({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Residual: مسیر میان‌بر گرادیان را زنده نگه می‌دارد">
      <Svg>
        <Box x={40} y={110} w={80} h={50} label="x" playing={playing} />
        <Flow x1={125} y1={135} x2={170} y2={135} />
        <Box x={175} y={110} w={110} h={50} label="F(x)" color="#38bdf8" delay={0.15} playing={playing} />
        <Flow x1={290} y1={135} x2={340} y2={135} delay={0.25} />
        <Box x={345} y={110} w={90} h={50} label="x+F(x)" color="#2dd4bf" delay={0.35} playing={playing} />
        {playing && (
          <motion.path
            d="M80 110 C 80 50, 380 50, 380 110"
            fill="none"
            stroke="#fbbf24"
            strokeWidth={3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        )}
      </Svg>
    </Scene>
  )
}

export function OptimizerPath({ playing }: { playing: boolean }) {
  return (
    <Scene caption="SGD در برابر Adam — مسیر همگرایی">
      <Svg>
        <motion.path
          d="M50 200 C 120 180, 140 60, 220 120 S 320 210, 430 80"
          fill="none"
          stroke="#64748b"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        <motion.path
          d="M50 200 C 140 170, 180 90, 260 100 S 360 90, 430 80"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth={3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5 }}
        />
        {playing && (
          <motion.circle
            r={8}
            fill="#fbbf24"
            animate={{ cx: [50, 160, 260, 360, 430], cy: [200, 120, 100, 95, 80] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          />
        )}
        <text x={100} y={250} fill="#94a3b8" fontSize={12}>
          SGD zig-zag
        </text>
        <text x={320} y={250} fill="#2dd4bf" fontSize={12}>
          Adam adaptive
        </text>
      </Svg>
    </Scene>
  )
}
