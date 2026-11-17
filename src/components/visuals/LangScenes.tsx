import { motion } from 'framer-motion'
import { Box, Flow, Scene, Svg, Dot } from './sceneKit'

export function NlpPipeline({ playing }: { playing: boolean }) {
  const steps = ['Text', 'Tokens', 'Model', 'Label']
  return (
    <Scene caption="پایپ‌لاین کلاسیک NLP">
      <Svg>
        {steps.map((s, i) => (
          <g key={s}>
            <Box x={25 + i * 115} y={110} w={95} h={55} label={s} color={['#94a3b8', '#38bdf8', '#2dd4bf', '#fbbf24'][i]} delay={i * 0.12} playing={playing} />
            {i < steps.length - 1 && <Flow x1={125 + i * 115} y1={137} x2={145 + i * 115} y2={137} delay={0.1 + i * 0.12} />}
          </g>
        ))}
        {playing && (
          <motion.circle r={6} fill="#fb7185" animate={{ cx: [70, 185, 300, 415], cy: [137, 137, 137, 137] }} transition={{ duration: 2.6, repeat: Infinity }} />
        )}
      </Svg>
    </Scene>
  )
}

export function TextClean({ playing }: { playing: boolean }) {
  return (
    <Scene caption="پاک‌سازی و نرمال‌سازی متن">
      <Svg>
        <Box x={40} y={90} w={160} h={90} label="« سلام!!! »" color="#fb7185" playing={playing} />
        <Flow x1={210} y1={135} x2={260} y2={135} />
        <Box x={270} y={90} w={160} h={90} label="سلام" color="#2dd4bf" delay={0.25} playing={playing} />
        {playing &&
          ['!', '!', '!'].map((ch, i) => (
            <motion.text
              key={i}
              x={150}
              y={100}
              fill="#fb7185"
              fontSize={18}
              animate={{ y: [100, 40], opacity: [1, 0], x: [150, 150 + i * 20] }}
              transition={{ delay: 0.4 + i * 0.15, duration: 1.1, repeat: Infinity, repeatDelay: 1 }}
            >
              {ch}
            </motion.text>
          ))}
      </Svg>
    </Scene>
  )
}

export function BowMatrix({ playing }: { playing: boolean }) {
  const cells = [1, 0, 2, 0, 1, 3, 1, 0, 0, 2, 1, 1]
  return (
    <Scene caption="ماتریس Bag-of-Words / TF-IDF">
      <Svg>
        {cells.map((v, i) => (
          <motion.rect
            key={i}
            x={80 + (i % 4) * 70}
            y={50 + Math.floor(i / 4) * 60}
            width={55}
            height={45}
            rx={8}
            fill={`rgba(45,212,191,${0.12 + v * 0.2})`}
            stroke="#2dd4bf"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: playing && v > 1 ? [1, 1.06, 1] : 1 }}
            transition={{ delay: i * 0.05, duration: 1.4, repeat: playing && v > 1 ? Infinity : 0 }}
          />
        ))}
      </Svg>
    </Scene>
  )
}

export function LmNextToken({ playing }: { playing: boolean }) {
  const toks = ['من', 'کتاب', 'را', '؟']
  return (
    <Scene caption="مدل زبانی: پیش‌بینی توکن بعدی">
      <Svg>
        {toks.map((t, i) => (
          <motion.g key={t} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
            <rect x={40 + i * 100} y={110} width={80} height={50} rx={12} fill="#0b1524" stroke={i === 3 ? '#fbbf24' : '#2dd4bf'} strokeWidth={2} />
            <text x={80 + i * 100} y={140} textAnchor="middle" fill="#e2e8f0" fontSize={14} fontFamily="Vazirmatn">
              {t}
            </text>
          </motion.g>
        ))}
        {playing && (
          <motion.rect
            x={340}
            y={110}
            width={80}
            height={50}
            rx={12}
            fill="rgba(251,191,36,0.15)"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
      </Svg>
    </Scene>
  )
}

export function NgramWindow({ playing }: { playing: boolean }) {
  return (
    <Scene caption="پنجره n-gram روی توالی">
      <Svg>
        {['a', 'b', 'c', 'd', 'e'].map((t, i) => (
          <Box key={t} x={40 + i * 80} y={120} w={60} h={45} label={t} color="#64748b" delay={i * 0.08} playing={false} />
        ))}
        {playing && (
          <motion.rect
            x={40}
            y={110}
            width={210}
            height={65}
            rx={14}
            fill="rgba(56,189,248,0.12)"
            stroke="#38bdf8"
            strokeWidth={2}
            animate={{ x: [40, 120, 200, 40] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
      </Svg>
    </Scene>
  )
}

export function PerplexityViz({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Perplexity پایین‌تر = مدل مطمئن‌تر">
      <Svg>
        <motion.circle
          cx="240"
          cy="140"
          r={80}
          fill="none"
          stroke="#334155"
          strokeWidth={18}
        />
        <motion.circle
          cx="240"
          cy="140"
          r={80}
          fill="none"
          stroke="#2dd4bf"
          strokeWidth={18}
          strokeLinecap="round"
          strokeDasharray="502"
          initial={{ strokeDashoffset: 502 }}
          animate={{ strokeDashoffset: playing ? 140 : 360 }}
          transition={{ duration: 1.4 }}
          transform="rotate(-90 240 140)"
        />
        <text x="240" y="145" textAnchor="middle" fill="#e2e8f0" fontSize={22} fontFamily="Syne">
          PPL
        </text>
      </Svg>
    </Scene>
  )
}

export function NerTags({ playing }: { playing: boolean }) {
  const items = [
    { t: 'سارا', tag: 'PER', c: '#2dd4bf' },
    { t: 'در', tag: 'O', c: '#64748b' },
    { t: 'تهران', tag: 'LOC', c: '#fbbf24' },
    { t: 'است', tag: 'O', c: '#64748b' },
  ]
  return (
    <Scene caption="برچسب‌گذاری موجودیت / نقش">
      <Svg>
        {items.map((it, i) => (
          <motion.g key={it.t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
            <rect x={30 + i * 110} y={100} width={95} height={70} rx={12} fill="#0b1524" stroke={it.c} strokeWidth={2} />
            <text x={77 + i * 110} y={130} textAnchor="middle" fill="#e2e8f0" fontSize={14} fontFamily="Vazirmatn">
              {it.t}
            </text>
            <motion.text
              x={77 + i * 110}
              y={155}
              textAnchor="middle"
              fill={it.c}
              fontSize={12}
              animate={playing ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {it.tag}
            </motion.text>
          </motion.g>
        ))}
      </Svg>
    </Scene>
  )
}

export function ParseTree({ playing }: { playing: boolean }) {
  return (
    <Scene caption="درخت تجزیه نحوی">
      <Svg>
        <Box x={190} y={30} w={90} h={40} label="S" color="#2dd4bf" playing={playing} />
        <Flow x1={210} y1={70} x2={120} y2={110} delay={0.2} />
        <Flow x1={260} y1={70} x2={340} y2={110} delay={0.25} />
        <Box x={70} y={115} w={90} h={40} label="NP" color="#38bdf8" delay={0.2} playing={playing} />
        <Box x={300} y={115} w={90} h={40} label="VP" color="#fbbf24" delay={0.3} playing={playing} />
        <Flow x1={100} y1={155} x2={80} y2={195} delay={0.4} />
        <Flow x1={130} y1={155} x2={150} y2={195} delay={0.45} />
        <Box x={40} y={200} w={70} h={36} label="Det" color="#94a3b8" delay={0.4} playing={false} />
        <Box x={120} y={200} w={70} h={36} label="N" color="#94a3b8" delay={0.45} playing={false} />
      </Svg>
    </Scene>
  )
}

export function SemanticRoles({ playing }: { playing: boolean }) {
  return (
    <Scene caption="نقش معنایی: Agent / Action / Patient">
      <Svg>
        <Box x={30} y={110} w={110} h={55} label="Agent" color="#2dd4bf" playing={playing} />
        <Box x={175} y={110} w={120} h={55} label="Action" color="#fbbf24" delay={0.15} playing={playing} />
        <Box x={330} y={110} w={110} h={55} label="Patient" color="#38bdf8" delay={0.3} playing={playing} />
        {playing && <Dot x={240} y={70} delay={0.5} />}
      </Svg>
    </Scene>
  )
}

export function VectorSpace({ playing }: { playing: boolean }) {
  const pts = [
    { x: 120, y: 80, l: 'cat' },
    { x: 150, y: 110, l: 'dog' },
    { x: 340, y: 90, l: 'car' },
    { x: 360, y: 150, l: 'bus' },
    { x: 220, y: 200, l: 'king' },
  ]
  return (
    <Scene caption="کلمات نزدیک در فضای برداری">
      <Svg>
        <line x1="40" y1="240" x2="440" y2="240" stroke="#334155" />
        <line x1="40" y1="240" x2="40" y2="40" stroke="#334155" />
        {pts.map((p, i) => (
          <motion.g key={p.l} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
            <circle cx={p.x} cy={p.y} r={10} fill="#2dd4bf" />
            <text x={p.x + 14} y={p.y + 4} fill="#e2e8f0" fontSize={12}>
              {p.l}
            </text>
          </motion.g>
        ))}
        {playing && (
          <motion.circle
            cx="135"
            cy="95"
            r={40}
            fill="rgba(45,212,191,0.08)"
            stroke="#2dd4bf"
            animate={{ r: [34, 48, 34] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </Svg>
    </Scene>
  )
}

export function Word2VecViz({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Word2Vec: قیاس برداری">
      <Svg>
        <text x="240" y="50" textAnchor="middle" fill="#94a3b8" fontSize={14} direction="ltr">
          king - man + woman ≈ queen
        </text>
        {['king', 'man', 'woman', 'queen'].map((w, i) => (
          <Box key={w} x={30 + i * 110} y={120} w={95} h={50} label={w} color={['#fbbf24', '#fb7185', '#38bdf8', '#2dd4bf'][i]} delay={i * 0.12} playing={playing} />
        ))}
        {playing && (
          <motion.path
            d="M80 180 C 160 230, 320 230, 400 180"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth={2}
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </Svg>
    </Scene>
  )
}

export function SubwordPieces({ playing }: { playing: boolean }) {
  const parts = ['بازی', '##گر', '##ان']
  return (
    <Scene caption="زیرواژه: ریشه + پسوندها">
      <Svg>
        {parts.map((p, i) => (
          <Box key={p} x={60 + i * 120} y={110} w={100} h={55} label={p} color="#38bdf8" delay={i * 0.15} playing={playing} />
        ))}
        {playing && (
          <motion.rect
            x={60}
            y={100}
            width={340}
            height={75}
            rx={16}
            fill="rgba(56,189,248,0.08)"
            stroke="#38bdf8"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
      </Svg>
    </Scene>
  )
}

export function ContextualEmb({ playing }: { playing: boolean }) {
  return (
    <Scene caption="یک کلمه، دو بافت → دو بردار">
      <Svg>
        <Box x={40} y={60} w={180} h={50} label="رودخانه بانک" color="#2dd4bf" playing={playing} />
        <Box x={260} y={60} w={180} h={50} label="بانک پول" color="#fbbf24" delay={0.15} playing={playing} />
        <Flow x1={130} y1={115} x2={130} y2={160} delay={0.3} />
        <Flow x1={350} y1={115} x2={350} y2={160} delay={0.35} color="#fbbf24" />
        <Box x={80} y={170} w={100} h={45} label="v₁" color="#2dd4bf" delay={0.4} playing={playing} />
        <Box x={300} y={170} w={100} h={45} label="v₂" color="#fbbf24" delay={0.45} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function CosineSim({ playing }: { playing: boolean }) {
  return (
    <Scene caption="شباهت کسینوسی بین دو بردار">
      <Svg>
        <line x1="240" y1="220" x2="240" y2="40" stroke="#334155" />
        <line x1="80" y1="220" x2="400" y2="220" stroke="#334155" />
        <motion.line x1="240" y1="220" x2="340" y2="90" stroke="#2dd4bf" strokeWidth={3} markerEnd="url(#arrowHead)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <motion.line x1="240" y1="220" x2="150" y2="100" stroke="#fbbf24" strokeWidth={3} markerEnd="url(#arrowAmber)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
        {playing && (
          <motion.path
            d="M300 140 A 40 40 0 0 0 190 145"
            fill="none"
            stroke="#38bdf8"
            strokeWidth={2}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}
        <text x="240" y="260" textAnchor="middle" fill="#94a3b8" fontSize={12}>
          cos θ
        </text>
      </Svg>
    </Scene>
  )
}

export function DimReduce({ playing }: { playing: boolean }) {
  return (
    <Scene caption="کاهش بُعد برای نمایش">
      <Svg>
        {[0, 1, 2].map((z) => (
          <motion.rect
            key={z}
            x={80 + z * 20}
            y={70 + z * 20}
            width={140}
            height={100}
            rx={12}
            fill="rgba(45,212,191,0.08)"
            stroke="#2dd4bf"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - z * 0.25 }}
            transition={{ delay: z * 0.15 }}
          />
        ))}
        <Flow x1={280} y1={140} x2={330} y2={140} />
        <Box x={340} y={110} w={100} h={60} label="2D/3D" color="#fbbf24" delay={0.4} playing={playing} />
      </Svg>
    </Scene>
  )
}
