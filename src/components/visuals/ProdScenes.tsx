import { motion } from 'framer-motion'
import { Box, Flow, Scene, Svg, Dot } from './sceneKit'

export function LrSchedule({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Warmup سپس Decay نرخ یادگیری">
      <Svg>
        <motion.path
          d="M40 200 L120 80 L430 160"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth={4}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4 }}
        />
        {playing && (
          <motion.circle r={8} fill="#fbbf24" animate={{ cx: [40, 120, 280, 430], cy: [200, 80, 120, 160] }} transition={{ duration: 2.8, repeat: Infinity }} />
        )}
      </Svg>
    </Scene>
  )
}

export function MixedPrecision({ playing }: { playing: boolean }) {
  return (
    <Scene caption="FP16 سریع · FP32 برای پایداری">
      <Svg>
        <Box x={50} y={100} w={140} h={70} label="FP16" color="#38bdf8" playing={playing} />
        <Box x={280} y={100} w={140} h={70} label="FP32 master" color="#2dd4bf" delay={0.2} playing={playing} />
        {playing && (
          <motion.path
            d="M195 135 C 220 80, 250 80, 275 135"
            fill="none"
            stroke="#fbbf24"
            strokeWidth={3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}
      </Svg>
    </Scene>
  )
}

export function Distributed({ playing }: { playing: boolean }) {
  return (
    <Scene caption="آموزش توزیع‌شده روی چند GPU">
      <Svg>
        <Box x={180} y={30} w={120} h={45} label="Server" color="#fbbf24" playing={playing} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <Flow x1={240} y1={80} x2={85 + i * 100} y2={140} delay={0.1 * i} />
            <Box x={40 + i * 100} y={150} w={85} h={50} label={`GPU${i}`} color="#2dd4bf" delay={0.15 * i} playing={playing} />
          </g>
        ))}
      </Svg>
    </Scene>
  )
}

export function DataQuality({ playing }: { playing: boolean }) {
  return (
    <Scene caption="دادهٔ تمیز از دادهٔ نویزی جدا می‌شود">
      <Svg>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.circle
            key={i}
            cx={80 + i * 55}
            cy={140}
            r={16}
            fill={i === 2 || i === 4 ? '#fb7185' : '#2dd4bf'}
            animate={
              playing && (i === 2 || i === 4)
                ? { cy: [140, 60, -20], opacity: [1, 0.6, 0] }
                : { cy: 140 }
            }
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </Svg>
    </Scene>
  )
}

export function Curriculum({ playing }: { playing: boolean }) {
  return (
    <Scene caption="از نمونه آسان به سخت">
      <Svg>
        {['Easy', 'Medium', 'Hard'].map((l, i) => (
          <Box key={l} x={40 + i * 140} y={110} w={120} h={55} label={l} color={['#2dd4bf', '#fbbf24', '#fb7185'][i]} delay={i * 0.15} playing={playing} />
        ))}
        {playing && (
          <motion.circle r={6} fill="#38bdf8" animate={{ cx: [100, 240, 380], cy: [137, 137, 137] }} transition={{ duration: 2.2, repeat: Infinity }} />
        )}
      </Svg>
    </Scene>
  )
}

export function Checkpoint({ playing }: { playing: boolean }) {
  return (
    <Scene caption="ذخیره نقاط میانی آموزش">
      <Svg>
        <motion.path d="M40 160 L440 160" stroke="#334155" strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => (
          <motion.g key={i}>
            <Box x={50 + i * 100} y={100} w={70} h={45} label={`ck${i}`} color="#2dd4bf" delay={i * 0.12} playing={playing} />
            <Dot x={85 + i * 100} y={160} delay={0.2 + i * 0.1} />
          </motion.g>
        ))}
      </Svg>
    </Scene>
  )
}

export function Hyperparams({ playing }: { playing: boolean }) {
  const knobs = ['lr', 'bs', 'wd', 'drop']
  return (
    <Scene caption="تنظیم هایپرپارامترها">
      <Svg>
        {knobs.map((k, i) => (
          <g key={k}>
            <text x={70 + i * 100} y={60} textAnchor="middle" fill="#94a3b8" fontSize={12}>
              {k}
            </text>
            <rect x={55 + i * 100} y={80} width={30} height={120} rx={15} fill="#0b1524" stroke="#475569" />
            <motion.circle
              cx={70 + i * 100}
              r={12}
              fill="#2dd4bf"
              animate={{ cy: playing ? [100, 170, 120] : 130 }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity }}
            />
          </g>
        ))}
      </Svg>
    </Scene>
  )
}

export function GreedyDecode({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Greedy: همیشه محتمل‌ترین توکن">
      <Svg>
        {[0.12, 0.55, 0.2, 0.13].map((v, i) => (
          <motion.rect
            key={i}
            x={60 + i * 95}
            y={200 - v * 160}
            width={50}
            height={v * 160}
            rx={8}
            fill={i === 1 ? '#2dd4bf' : '#334155'}
            animate={playing && i === 1 ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ transformOrigin: `${85 + i * 95}px 200px` }}
          />
        ))}
      </Svg>
    </Scene>
  )
}

export function BeamSearch({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Beam Search چند مسیر را زنده نگه می‌دارد">
      <Svg>
        <Dot x={60} y={140} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <Flow x1={70} y1={140} x2={180} y2={70 + i * 70} delay={0.1 * i} />
            <Dot x={190} y={70 + i * 70} color="#38bdf8" delay={0.2 * i} />
            <Flow x1={200} y1={70 + i * 70} x2={320} y2={100 + (i % 2) * 60} delay={0.25 + i * 0.1} />
          </g>
        ))}
        {playing && (
          <motion.circle r={7} fill="#fbbf24" animate={{ cx: [60, 190, 330], cy: [140, 140, 130] }} transition={{ duration: 2.2, repeat: Infinity }} />
        )}
      </Svg>
    </Scene>
  )
}

export function Temperature({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Temperature توزیع را تیز یا پهن می‌کند">
      <Svg>
        <text x="140" y="40" textAnchor="middle" fill="#94a3b8" fontSize={12}>
          T=0.3
        </text>
        <text x="340" y="40" textAnchor="middle" fill="#94a3b8" fontSize={12}>
          T=1.2
        </text>
        <motion.path d="M60 200 C 100 40, 180 40, 220 200" fill="none" stroke="#2dd4bf" strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <motion.path d="M260 180 C 300 100, 380 100, 420 180" fill="none" stroke="#fbbf24" strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
        {playing && <Dot x={140} y={90} delay={0.5} />}
      </Svg>
    </Scene>
  )
}

export function TopP({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Nucleus / Top-p فقط جرم احتمال کافی را نگه می‌دارد">
      <Svg>
        {[0.35, 0.25, 0.2, 0.1, 0.07, 0.03].map((v, i) => (
          <motion.rect
            key={i}
            x={50 + i * 65}
            y={200 - v * 280}
            width={45}
            height={v * 280}
            rx={8}
            fill={i < 3 ? '#2dd4bf' : '#334155'}
            initial={{ height: 0, y: 200 }}
            animate={{ height: v * 280, y: 200 - v * 280 }}
            transition={{ delay: i * 0.08 }}
          />
        ))}
        {playing && (
          <motion.rect
            x={45}
            y={70}
            width={200}
            height={140}
            rx={12}
            fill="rgba(45,212,191,0.08)"
            stroke="#2dd4bf"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </Svg>
    </Scene>
  )
}

export function Repetition({ playing }: { playing: boolean }) {
  return (
    <Scene caption="جریمه تکرار جلوی حلقه را می‌گیرد">
      <Svg>
        {['با', 'با', 'با'].map((t, i) => (
          <motion.g key={i} animate={playing ? { opacity: [1, 0.3, 1], x: [0, 4, 0] } : {}} transition={{ delay: i * 0.15, duration: 1.2, repeat: Infinity }}>
            <Box x={40 + i * 90} y={110} w={70} h={50} label={t} color="#fb7185" playing={false} />
          </motion.g>
        ))}
        <Flow x1={310} y1={135} x2={350} y2={135} color="#2dd4bf" />
        <Box x={360} y={110} w={80} h={50} label="penalty" color="#2dd4bf" delay={0.3} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function StructuredOut({ playing }: { playing: boolean }) {
  return (
    <Scene caption="خروجی ساخت‌یافته مثل JSON">
      <Svg>
        <Box x={80} y={60} w={320} h={160} label="{  name,  score,  ok  }" color="#2dd4bf" playing={playing} />
        {playing && (
          <motion.rect
            x={100}
            y={90}
            width={280}
            height={8}
            rx={4}
            fill="#38bdf8"
            animate={{ scaleX: [0.2, 1, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ transformOrigin: '100px 94px' }}
          />
        )}
      </Svg>
    </Scene>
  )
}

export function Finetune({ playing }: { playing: boolean }) {
  return (
    <Scene caption="به‌روزرسانی وزن‌ها روی داده تخصصی">
      <Svg>
        <Box x={40} y={100} w={140} h={60} label="Base θ" color="#94a3b8" playing={playing} />
        <Flow x1={190} y1={130} x2={240} y2={130} />
        <Box x={250} y={100} w={170} h={60} label="θ + Δθ task" color="#2dd4bf" delay={0.2} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function LoraViz({ playing }: { playing: boolean }) {
  return (
    <Scene caption="LoRA: دو ماتریس کم‌رتبه کنار وزن اصلی">
      <Svg>
        <Box x={40} y={100} w={120} h={70} label="W frozen" color="#64748b" playing={playing} />
        <text x="200" y="140" fill="#fbbf24" fontSize={22}>
          +
        </text>
        <Box x={230} y={70} w={90} h={50} label="A" color="#38bdf8" delay={0.15} playing={playing} />
        <Box x={230} y={150} w={90} h={50} label="B" color="#2dd4bf" delay={0.25} playing={playing} />
        <Flow x1={330} y1={135} x2={380} y2={135} delay={0.35} />
        <Box x={385} y={110} w={70} h={50} label="out" color="#fbbf24" delay={0.4} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function InstructionTune({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Instruction → Response">
      <Svg>
        <Box x={40} y={100} w={160} h={60} label="Instruction" color="#38bdf8" playing={playing} />
        <Flow x1={210} y1={130} x2={260} y2={130} />
        <Box x={270} y={100} w={160} h={60} label="Response" color="#2dd4bf" delay={0.2} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function PrefLoop({ playing }: { playing: boolean }) {
  return (
    <Scene caption="ترجیح انسان بین دو پاسخ">
      <Svg>
        <Box x={40} y={50} w={400} h={45} label="Prompt" color="#94a3b8" playing={playing} />
        <Box x={40} y={130} w={170} h={60} label="Answer A ✓" color="#2dd4bf" delay={0.15} playing={playing} />
        <Box x={270} y={130} w={170} h={60} label="Answer B" color="#fb7185" delay={0.25} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function Rlhf({ playing }: { playing: boolean }) {
  return (
    <Scene caption="RLHF: مدل پاداش رفتار را هدایت می‌کند">
      <Svg>
        <Box x={30} y={110} w={110} h={55} label="Policy" playing={playing} />
        <Flow x1={145} y1={137} x2={185} y2={137} />
        <Box x={190} y={110} w={110} h={55} label="Reward" color="#fbbf24" delay={0.15} playing={playing} />
        <Flow x1={305} y1={137} x2={345} y2={137} delay={0.25} />
        <Box x={350} y={110} w={100} h={55} label="Update" color="#2dd4bf" delay={0.3} playing={playing} />
        {playing && (
          <motion.path
            d="M400 170 C 240 230, 120 230, 80 170"
            fill="none"
            stroke="#38bdf8"
            strokeWidth={2}
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        )}
      </Svg>
    </Scene>
  )
}

export function Forgetting({ playing }: { playing: boolean }) {
  return (
    <Scene caption="فراموشی فاجعه‌بار دانش قبلی">
      <Svg>
        {['A', 'B', 'C', 'D'].map((l, i) => (
          <motion.circle
            key={l}
            cx={90 + i * 90}
            cy={140}
            r={24}
            fill="#0b1524"
            stroke="#2dd4bf"
            strokeWidth={2}
            animate={playing ? { opacity: [1, 1, 0.15], scale: [1, 1, 0.7] } : {}}
            transition={{ duration: 2.5, delay: i * 0.35, repeat: Infinity }}
          />
        ))}
      </Svg>
    </Scene>
  )
}

export function Benchmarks({ playing }: { playing: boolean }) {
  return (
    <Scene caption="جدول بنچمارک">
      <Svg>
        {['MMLU', 'HELM', 'GSM8K', 'Truthful'].map((l, i) => (
          <Box key={l} x={30 + (i % 2) * 220} y={50 + Math.floor(i / 2) * 100} w={190} h={70} label={l} color="#38bdf8" delay={i * 0.12} playing={playing} />
        ))}
      </Svg>
    </Scene>
  )
}

export function HumanEval({ playing }: { playing: boolean }) {
  return (
    <Scene caption="ارزیابی انسانی با امتیاز">
      <Svg>
        {[1, 2, 3, 4, 5].map((n, i) => (
          <motion.polygon
            key={n}
            points="0,-18 5,-5 18,-5 8,3 11,16 0,8 -11,16 -8,3 -18,-5 -5,-5"
            fill={i < 4 ? '#fbbf24' : '#334155'}
            transform={`translate(${90 + i * 70} 140)`}
            animate={playing && i < 4 ? { scale: [1, 1.15, 1] } : {}}
            transition={{ delay: i * 0.1, duration: 1.2, repeat: Infinity }}
          />
        ))}
      </Svg>
    </Scene>
  )
}

export function Hallucination({ playing }: { playing: boolean }) {
  return (
    <Scene caption="تولید با اعتماد بالا ولی نادرست">
      <Svg>
        <Box x={40} y={100} w={160} h={60} label="Fluent text" color="#38bdf8" playing={playing} />
        <Flow x1={210} y1={130} x2={260} y2={130} color="#fb7185" />
        <Box x={270} y={100} w={160} h={60} label="Wrong fact" color="#fb7185" delay={0.2} playing={playing} />
        {playing && (
          <motion.text x="240" y="210" textAnchor="middle" fill="#fb7185" fontSize={14} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity }}>
            ⚠ hallucination
          </motion.text>
        )}
      </Svg>
    </Scene>
  )
}

export function Toxicity({ playing }: { playing: boolean }) {
  return (
    <Scene caption="فیلتر سمّیت و سوگیری">
      <Svg>
        <Box x={40} y={110} w={130} h={55} label="Output" color="#94a3b8" playing={playing} />
        <Flow x1={175} y1={137} x2={220} y2={137} />
        <Box x={225} y={110} w={100} h={55} label="Filter" color="#fbbf24" delay={0.15} playing={playing} />
        <Flow x1={330} y1={137} x2={370} y2={137} delay={0.25} />
        <Box x={375} y={110} w={70} h={55} label="Safe" color="#2dd4bf" delay={0.3} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function Privacy({ playing }: { playing: boolean }) {
  return (
    <Scene caption="حفاظت از داده حساس">
      <Svg>
        <Box x={140} y={90} w={200} h={100} label="Private Vault" color="#38bdf8" playing={playing} />
        {playing &&
          [0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              r={6}
              fill="#fb7185"
              animate={{ cx: [60, 140], cy: [70 + i * 40, 140], opacity: [1, 0] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
      </Svg>
    </Scene>
  )
}

export function PromptInjection({ playing }: { playing: boolean }) {
  return (
    <Scene caption="تزریق دستور مخرب داخل ورودی">
      <Svg>
        <Box x={40} y={90} w={180} h={80} label="User text" color="#94a3b8" playing={playing} />
        <motion.text
          x="130"
          y="150"
          textAnchor="middle"
          fill="#fb7185"
          fontSize={11}
          animate={playing ? { opacity: [0, 1, 0] } : {}}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          ignore rules...
        </motion.text>
        <Flow x1={230} y1={130} x2={280} y2={130} color="#fb7185" />
        <Box x={290} y={100} w={140} h={60} label="Model risk" color="#fb7185" delay={0.2} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function Guardrails({ playing }: { playing: boolean }) {
  return (
    <Scene caption="گاردریل دور مدل">
      <Svg>
        <motion.rect
          x={100}
          y={50}
          width={280}
          height={180}
          rx={24}
          fill="rgba(45,212,191,0.06)"
          stroke="#2dd4bf"
          strokeWidth={3}
          strokeDasharray="8 6"
          animate={playing ? { strokeDashoffset: [0, 28] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <Box x={170} y={110} w={140} h={60} label="LLM" color="#38bdf8" playing={playing} />
      </Svg>
    </Scene>
  )
}

export function RedTeam({ playing }: { playing: boolean }) {
  return (
    <Scene caption="حمله کنترل‌شده برای کشف ضعف">
      <Svg>
        <Box x={40} y={110} w={140} h={55} label="Attacker" color="#fb7185" playing={playing} />
        <Flow x1={185} y1={137} x2={235} y2={137} color="#fb7185" />
        <Box x={240} y={110} w={180} h={55} label="System under test" color="#2dd4bf" delay={0.2} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function Vit({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Vision Transformer: تکه‌های تصویر → توکن">
      <Svg>
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.rect
            key={i}
            x={40 + (i % 3) * 55}
            y={60 + Math.floor(i / 3) * 55}
            width={48}
            height={48}
            rx={8}
            fill="#134e4a"
            stroke="#2dd4bf"
            animate={playing ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ delay: i * 0.08, duration: 1.4, repeat: Infinity }}
          />
        ))}
        <Flow x1={220} y1={140} x2={270} y2={140} />
        <Box x={280} y={110} w={150} h={60} label="Transformer" color="#38bdf8" delay={0.3} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function SpeechWave({ playing }: { playing: boolean }) {
  return (
    <Scene caption="سیگنال گفتار به متن">
      <Svg>
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.rect
            key={i}
            x={40 + i * 12}
            width={8}
            rx={3}
            fill="#38bdf8"
            animate={{
              height: playing ? [20, 40 + (i % 7) * 12, 20] : 30,
              y: playing ? [140, 140 - (20 + (i % 7) * 6), 140] : 125,
            }}
            transition={{ duration: 1.2, delay: i * 0.04, repeat: Infinity }}
          />
        ))}
        <text x="240" y="230" textAnchor="middle" fill="#94a3b8" fontSize={12}>
          waveform → tokens
        </text>
      </Svg>
    </Scene>
  )
}

export function Diffusion({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Diffusion: نویز → تصویر">
      <Svg>
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            cx={80 + i * 100}
            cy={140}
            r={34}
            fill={`rgba(45,212,191,${0.1 + i * 0.18})`}
            stroke="#2dd4bf"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2 }}
          />
        ))}
        {playing && (
          <motion.circle r={6} fill="#fbbf24" animate={{ cx: [80, 180, 280, 380], cy: [140, 140, 140, 140] }} transition={{ duration: 2.5, repeat: Infinity }} />
        )}
      </Svg>
    </Scene>
  )
}

export function SparseAttn({ playing }: { playing: boolean }) {
  const n = 6
  return (
    <Scene caption="Attention تنک: فقط همسایه‌ها/الگوهای خاص">
      <Svg>
        {Array.from({ length: n }).map((_, r) =>
          Array.from({ length: n }).map((__, c) => {
            const on = Math.abs(r - c) <= 1 || (r + c) % 5 === 0
            return (
              <motion.rect
                key={`${r}-${c}`}
                x={110 + c * 40}
                y={30 + r * 40}
                width={32}
                height={32}
                rx={5}
                fill={on ? 'rgba(45,212,191,0.45)' : '#111827'}
                stroke={on ? '#2dd4bf' : '#1f2937'}
                animate={playing && on ? { opacity: [0.5, 1, 0.5] } : {}}
                transition={{ duration: 1.4, delay: (r + c) * 0.03, repeat: Infinity }}
              />
            )
          }),
        )}
      </Svg>
    </Scene>
  )
}

export function LongContext({ playing }: { playing: boolean }) {
  return (
    <Scene caption="توالی خیلی بلند">
      <Svg>
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.rect
            key={i}
            x={30 + i * 23}
            y={120}
            width={18}
            height={36}
            rx={4}
            fill={i < 14 ? '#2dd4bf' : '#334155'}
            animate={playing ? { y: [120, 112, 120] } : {}}
            transition={{ delay: i * 0.04, duration: 1.1, repeat: Infinity }}
          />
        ))}
      </Svg>
    </Scene>
  )
}

export function StateSpace({ playing }: { playing: boolean }) {
  return (
    <Scene caption="State Space: حالت فشرده در زمان">
      <Svg>
        {['xₜ', 'hₜ', 'yₜ'].map((l, i) => (
          <Box key={l} x={50 + i * 140} y={110} w={110} h={55} label={l} color={['#94a3b8', '#2dd4bf', '#fbbf24'][i]} delay={i * 0.15} playing={playing} />
        ))}
        {playing && (
          <motion.path
            d="M160 110 C 160 50, 300 50, 300 110"
            fill="none"
            stroke="#38bdf8"
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </Svg>
    </Scene>
  )
}

export function InferencePipe({ playing }: { playing: boolean }) {
  return (
    <Scene caption="خط لوله استنتاج بهینه">
      <Svg>
        {['Queue', 'Batch', 'Generate', 'Stream'].map((l, i) => (
          <g key={l}>
            <Box x={20 + i * 115} y={110} w={100} h={55} label={l} color="#2dd4bf" delay={i * 0.12} playing={playing} />
            {i < 3 && <Flow x1={125 + i * 115} y1={137} x2={140 + i * 115} y2={137} delay={0.1 + i * 0.12} />}
          </g>
        ))}
      </Svg>
    </Scene>
  )
}

export function Quantization({ playing }: { playing: boolean }) {
  return (
    <Scene caption="کاهش دقت وزن‌ها برای سرعت/حافظه">
      <Svg>
        <Box x={40} y={100} w={140} h={70} label="FP16" color="#38bdf8" playing={playing} />
        <Flow x1={190} y1={135} x2={240} y2={135} />
        <Box x={250} y={100} w={170} h={70} label="INT8 / INT4" color="#2dd4bf" delay={0.2} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function KvCache({ playing }: { playing: boolean }) {
  return (
    <Scene caption="KV Cache جلوگیری از محاسبه دوباره">
      <Svg>
        <Box x={40} y={90} w={150} h={90} label="Past K/V" color="#38bdf8" playing={playing} />
        <Box x={250} y={90} w={170} h={90} label="New token" color="#2dd4bf" delay={0.2} playing={playing} />
        {playing && (
          <motion.path
            d="M195 135 L245 135"
            stroke="#fbbf24"
            strokeWidth={3}
            markerEnd="url(#arrowAmber)"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
      </Svg>
    </Scene>
  )
}

export function Batching({ playing }: { playing: boolean }) {
  return (
    <Scene caption="چند درخواست همزمان در یک بچ">
      <Svg>
        {[0, 1, 2].map((i) => (
          <motion.rect
            key={i}
            x={60}
            y={50 + i * 55}
            width={160}
            height={40}
            rx={10}
            fill="#0b1524"
            stroke="#38bdf8"
            animate={playing ? { x: [60, 260] } : {}}
            transition={{ duration: 1.8, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
        <Box x={260} y={100} w={140} h={60} label="GPU batch" color="#2dd4bf" playing={playing} />
      </Svg>
    </Scene>
  )
}

export function Serving({ playing }: { playing: boolean }) {
  return (
    <Scene caption="سروینگ مدل در پروداکشن">
      <Svg>
        <Box x={30} y={110} w={100} h={55} label="Client" playing={playing} />
        <Flow x1={135} y1={137} x2={175} y2={137} />
        <Box x={180} y={110} w={120} h={55} label="Gateway" color="#fbbf24" delay={0.15} playing={playing} />
        <Flow x1={305} y1={137} x2={345} y2={137} delay={0.25} />
        <Box x={350} y={110} w={100} h={55} label="Model" color="#2dd4bf" delay={0.3} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function Observability({ playing }: { playing: boolean }) {
  return (
    <Scene caption="مانیتورینگ latency و خطا">
      <Svg>
        <motion.path
          d="M40 180 C 100 160, 140 80, 200 120 S 300 40, 440 90"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth={3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5 }}
        />
        {playing && <Dot x={300} y={70} delay={0.6} />}
        <text x="240" y="230" textAnchor="middle" fill="#94a3b8" fontSize={12}>
          p95 latency
        </text>
      </Svg>
    </Scene>
  )
}

export function CiEval({ playing }: { playing: boolean }) {
  return (
    <Scene caption="ارزیابی خودکار در CI">
      <Svg>
        {['Commit', 'Tests', 'Eval', 'Gate'].map((l, i) => (
          <Box key={l} x={25 + i * 115} y={110} w={100} h={55} label={l} color={i === 3 ? '#fbbf24' : '#2dd4bf'} delay={i * 0.12} playing={playing} />
        ))}
      </Svg>
    </Scene>
  )
}

export function CostLatency({ playing }: { playing: boolean }) {
  return (
    <Scene caption="تعادل هزینه و تأخیر">
      <Svg>
        <motion.path d="M50 200 L240 60 L430 200" fill="none" stroke="#334155" strokeWidth={3} />
        <motion.circle
          r={10}
          fill="#2dd4bf"
          animate={playing ? { cx: [120, 240, 360, 240], cy: [150, 60, 150, 60] } : { cx: 240, cy: 60 }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <text x="120" y="230" fill="#94a3b8" fontSize={12}>
          cheap
        </text>
        <text x="340" y="230" fill="#94a3b8" fontSize={12}>
          fast
        </text>
      </Svg>
    </Scene>
  )
}
