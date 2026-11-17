import { motion } from 'framer-motion'
import { Box, Flow, Scene, Svg, Dot } from './sceneKit'

export function LstmGates({ playing }: { playing: boolean }) {
  const gates = ['Forget', 'Input', 'Output']
  return (
    <Scene caption="دروازه‌های LSTM حافظه را کنترل می‌کنند">
      <Svg>
        <Box x={160} y={100} w={160} h={70} label="Cell State" color="#2dd4bf" playing={playing} />
        {gates.map((g, i) => (
          <Box key={g} x={30 + i * 150} y={200} w={120} h={45} label={g} color={['#fb7185', '#fbbf24', '#38bdf8'][i]} delay={i * 0.12} playing={playing} />
        ))}
        {playing &&
          gates.map((_, i) => (
            <motion.line
              key={i}
              x1={90 + i * 150}
              y1={200}
              x2={240}
              y2={170}
              stroke="#94a3b8"
              strokeWidth={2}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
      </Svg>
    </Scene>
  )
}

export function Seq2SeqViz({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Encoder فشرده می‌کند · Decoder باز می‌کند">
      <Svg>
        <Box x={30} y={100} w={140} h={70} label="Encoder" color="#2dd4bf" playing={playing} />
        <Flow x1={175} y1={135} x2={215} y2={135} />
        <motion.circle cx="250" cy="135" r={22} fill="#0b1524" stroke="#fbbf24" strokeWidth={2} animate={playing ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 1.4, repeat: Infinity }} />
        <text x="250" y="140" textAnchor="middle" fill="#fbbf24" fontSize={11}>
          z
        </text>
        <Flow x1={275} y1={135} x2={315} y2={135} delay={0.2} />
        <Box x={320} y={100} w={140} h={70} label="Decoder" color="#38bdf8" delay={0.2} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function TeacherForcing({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Teacher Forcing: ورودی بعدی از برچسب طلایی">
      <Svg>
        <Box x={40} y={90} w={160} h={60} label="Gold yₜ" color="#fbbf24" playing={playing} />
        <Flow x1={210} y1={120} x2={260} y2={120} />
        <Box x={270} y={90} w={160} h={60} label="Decoder" color="#2dd4bf" delay={0.2} playing={playing} />
        {playing && (
          <motion.path
            d="M350 155 C 350 210, 120 210, 120 155"
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

export function CausalMask({ playing }: { playing: boolean }) {
  const n = 5
  return (
    <Scene caption="ماسک علیّت: آینده دیده نمی‌شود">
      <Svg>
        {Array.from({ length: n }).map((_, r) =>
          Array.from({ length: n }).map((__, c) => {
            const blocked = c > r
            return (
              <motion.rect
                key={`${r}-${c}`}
                x={120 + c * 42}
                y={40 + r * 42}
                width={36}
                height={36}
                rx={6}
                fill={blocked ? '#1f2937' : 'rgba(45,212,191,0.35)'}
                stroke={blocked ? '#475569' : '#2dd4bf'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: playing && !blocked ? [1, 1.05, 1] : 1 }}
                transition={{ delay: (r + c) * 0.04, duration: 1.3, repeat: playing && !blocked ? Infinity : 0 }}
              />
            )
          }),
        )}
      </Svg>
    </Scene>
  )
}

export function GptStack({ playing }: { playing: boolean }) {
  return (
    <Scene caption="GPT: پشته Decoder-only">
      <Svg>
        {['Token + Pos', 'Masked Self-Attn × N', 'FFN × N', 'LM Head'].map((l, i) => (
          <Box key={l} x={120} y={30 + i * 55} w={240} h={42} label={l} color={['#94a3b8', '#2dd4bf', '#38bdf8', '#fbbf24'][i]} delay={i * 0.12} playing={playing} />
        ))}
      </Svg>
    </Scene>
  )
}

export function BertMask({ playing }: { playing: boolean }) {
  const toks = ['من', '[MASK]', 'کتاب', 'را']
  return (
    <Scene caption="BERT: پیش‌بینی توکن ماسک‌شده">
      <Svg>
        {toks.map((t, i) => (
          <Box key={t} x={30 + i * 110} y={110} w={95} h={55} label={t} color={t.includes('MASK') ? '#fbbf24' : '#2dd4bf'} delay={i * 0.1} playing={playing} />
        ))}
        {playing && (
          <motion.text
            x="185"
            y="90"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize={14}
            fontFamily="Vazirmatn"
            animate={{ opacity: [0.2, 1, 0.2], y: [95, 80, 95] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            می‌خوانم؟
          </motion.text>
        )}
      </Svg>
    </Scene>
  )
}

export function PretrainFinetune({ playing }: { playing: boolean }) {
  return (
    <Scene caption="پیش‌آموزش عمومی → تنظیم تخصصی">
      <Svg>
        <Box x={40} y={100} w={160} h={70} label="Pretrain" color="#38bdf8" playing={playing} />
        <Flow x1={210} y1={135} x2={260} y2={135} />
        <Box x={270} y={100} w={160} h={70} label="Fine-tune" color="#2dd4bf" delay={0.2} playing={playing} />
        {playing && <Dot x={235} y={135} delay={0.4} />}
      </Svg>
    </Scene>
  )
}

export function ContextWindow({ playing }: { playing: boolean }) {
  return (
    <Scene caption="پنجره زمینه ظرفیت حافظه مدل است">
      <Svg>
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.rect
            key={i}
            x={40 + i * 40}
            y={120}
            width={32}
            height={40}
            rx={6}
            fill={i < 7 ? '#134e4a' : '#1f2937'}
            stroke={i < 7 ? '#2dd4bf' : '#475569'}
            animate={playing && i < 7 ? { y: [120, 112, 120] } : {}}
            transition={{ delay: i * 0.05, duration: 1.2, repeat: Infinity }}
          />
        ))}
        <motion.rect
          x={40}
          y={110}
          width={280}
          height={60}
          rx={12}
          fill="rgba(45,212,191,0.08)"
          stroke="#2dd4bf"
          strokeDasharray="6 4"
          animate={playing ? { opacity: [0.4, 1, 0.4] } : {}}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </Svg>
    </Scene>
  )
}

export function InContext({ playing }: { playing: boolean }) {
  return (
    <Scene caption="یادگیری از مثال‌های داخل پرامپت">
      <Svg>
        {['ex1', 'ex2', 'query'].map((l, i) => (
          <Box key={l} x={40 + i * 140} y={110} w={120} h={55} label={l} color={i === 2 ? '#fbbf24' : '#2dd4bf'} delay={i * 0.15} playing={playing} />
        ))}
      </Svg>
    </Scene>
  )
}

export function PromptingViz({ playing }: { playing: boolean }) {
  return (
    <Scene caption="ساختار پرامپت خوب">
      <Svg>
        {['Role', 'Task', 'Constraints', 'Output'].map((l, i) => (
          <Box key={l} x={30} y={30 + i * 55} w={200} h={42} label={l} color={['#38bdf8', '#2dd4bf', '#fbbf24', '#fb7185'][i]} delay={i * 0.12} playing={playing} />
        ))}
        <Flow x1={245} y1={140} x2={300} y2={140} />
        <Box x={310} y={110} w={130} h={60} label="Answer" color="#2dd4bf" delay={0.5} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function RagFlow({ playing }: { playing: boolean }) {
  return (
    <Scene caption="RAG: بازیابی دانش + تولید">
      <Svg>
        <Box x={30} y={110} w={100} h={55} label="Query" playing={playing} />
        <Flow x1={135} y1={137} x2={175} y2={137} />
        <Box x={180} y={60} w={120} h={50} label="Retriever" color="#38bdf8" delay={0.15} playing={playing} />
        <Box x={180} y={160} w={120} h={50} label="Docs" color="#fbbf24" delay={0.25} playing={playing} />
        <Flow x1={305} y1={137} x2={345} y2={137} delay={0.3} />
        <Box x={350} y={110} w={100} h={55} label="LLM" color="#2dd4bf" delay={0.4} playing={playing} />
        {playing && (
          <motion.circle r={5} fill="#fb7185" animate={{ cx: [80, 240, 400], cy: [137, 90, 137] }} transition={{ duration: 2.4, repeat: Infinity }} />
        )}
      </Svg>
    </Scene>
  )
}

export function AgentsTools({ playing }: { playing: boolean }) {
  return (
    <Scene caption="ایجنت فکر می‌کند و ابزار صدا می‌زند">
      <Svg>
        <Box x={170} y={40} w={140} h={55} label="Agent" color="#2dd4bf" playing={playing} />
        {['Search', 'Code', 'API'].map((t, i) => (
          <g key={t}>
            <Flow x1={240} y1={100} x2={90 + i * 150} y2={160} delay={0.15 * i} />
            <Box x={40 + i * 150} y={165} w={100} h={50} label={t} color="#38bdf8" delay={0.2 + i * 0.1} playing={playing} />
          </g>
        ))}
      </Svg>
    </Scene>
  )
}

export function ScalingLaws({ playing }: { playing: boolean }) {
  return (
    <Scene caption="با مقیاس، Loss معمولاً پایین می‌آید">
      <Svg>
        <motion.path
          d="M50 60 C 140 70, 200 150, 430 200"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth={4}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5 }}
        />
        {playing && (
          <motion.circle r={8} fill="#fbbf24" animate={{ cx: [60, 160, 280, 400], cy: [65, 100, 160, 195] }} transition={{ duration: 2.8, repeat: Infinity }} />
        )}
        <text x="240" y="250" textAnchor="middle" fill="#94a3b8" fontSize={12}>
          compute / data / params →
        </text>
      </Svg>
    </Scene>
  )
}

export function MoeViz({ playing }: { playing: boolean }) {
  return (
    <Scene caption="Mixture of Experts: فقط چند کارشناس فعال">
      <Svg>
        <Box x={180} y={30} w={120} h={45} label="Router" color="#fbbf24" playing={playing} />
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            x={40 + i * 105}
            y={140}
            w={90}
            h={55}
            label={`E${i + 1}`}
            color={i === 1 || i === 3 ? '#2dd4bf' : '#475569'}
            delay={i * 0.1}
            playing={playing && (i === 1 || i === 3)}
          />
        ))}
        {playing &&
          [1, 3].map((i) => (
            <motion.line
              key={i}
              x1={240}
              y1={80}
              x2={85 + i * 105}
              y2={140}
              stroke="#2dd4bf"
              strokeWidth={2}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
          ))}
      </Svg>
    </Scene>
  )
}

export function Multimodal({ playing }: { playing: boolean }) {
  return (
    <Scene caption="متن + تصویر + صدا در یک مدل">
      <Svg>
        {['Text', 'Image', 'Audio'].map((l, i) => (
          <Box key={l} x={30 + i * 145} y={50} w={120} h={50} label={l} color={['#2dd4bf', '#38bdf8', '#fbbf24'][i]} delay={i * 0.12} playing={playing} />
        ))}
        <Flow x1={90} y1={105} x2={240} y2={150} delay={0.3} />
        <Flow x1={240} y1={105} x2={240} y2={150} delay={0.35} />
        <Flow x1={390} y1={105} x2={240} y2={150} delay={0.4} color="#fbbf24" />
        <Box x={170} y={160} w={140} h={55} label="Fusion LM" color="#fb7185" delay={0.45} playing={playing} />
      </Svg>
    </Scene>
  )
}

export function TokenizeSplit({ playing }: { playing: boolean }) {
  return (
    <Scene caption="شکستن متن به توکن">
      <Svg>
        <Box x={40} y={100} w={160} h={60} label="نمی‌خواهم" color="#94a3b8" playing={playing} />
        <Flow x1={210} y1={130} x2={250} y2={130} />
        {['نمی', '##خواه', '##م'].map((t, i) => (
          <Box key={t} x={260} y={40 + i * 65} w={150} h={50} label={t} color="#2dd4bf" delay={0.2 + i * 0.1} playing={playing} />
        ))}
      </Svg>
    </Scene>
  )
}

export function BpeMerge({ playing }: { playing: boolean }) {
  return (
    <Scene caption="BPE: جفت‌های پرتکرار ادغام می‌شوند">
      <Svg>
        {['e', 's', 't', 'a', 't', 'e'].map((ch, i) => (
          <Box key={`${ch}-${i}`} x={30 + i * 70} y={120} w={55} h={45} label={ch} color="#64748b" delay={i * 0.05} playing={false} />
        ))}
        {playing && (
          <motion.rect
            x={30}
            y={110}
            width={125}
            height={65}
            rx={12}
            fill="rgba(45,212,191,0.12)"
            stroke="#2dd4bf"
            strokeWidth={2}
            animate={{ x: [30, 170, 310, 30] }}
            transition={{ duration: 3.2, repeat: Infinity }}
          />
        )}
        <text x="240" y="220" textAnchor="middle" fill="#2dd4bf" fontSize={13}>
          merge → est / ate
        </text>
      </Svg>
    </Scene>
  )
}

export function TokIssues({ playing }: { playing: boolean }) {
  return (
    <Scene caption="توکنایزر بد، متن را خرد می‌کند">
      <Svg>
        <Box x={40} y={100} w={160} h={60} label="کوردی/فارسی" color="#fb7185" playing={playing} />
        <Flow x1={210} y1={130} x2={250} y2={130} color="#fb7185" />
        {['##', '??', '##'].map((t, i) => (
          <motion.g key={i} animate={playing ? { y: [0, -6, 0] } : {}} transition={{ delay: i * 0.1, duration: 1, repeat: Infinity }}>
            <Box x={260 + i * 65} y={105} w={55} h={50} label={t} color="#fb7185" delay={0.2 + i * 0.1} playing={false} />
          </motion.g>
        ))}
      </Svg>
    </Scene>
  )
}

export function MultilingualTok({ playing }: { playing: boolean }) {
  return (
    <Scene caption="واژگان مشترک چندزبانه">
      <Svg>
        {['FA', 'AR', 'EN', 'KU'].map((l, i) => (
          <Box key={l} x={30 + i * 110} y={50} w={95} h={45} label={l} color="#38bdf8" delay={i * 0.1} playing={playing} />
        ))}
        <Flow x1={240} y1={100} x2={240} y2={140} delay={0.4} />
        <Box x={140} y={150} w={200} h={55} label="Shared Vocab" color="#2dd4bf" delay={0.45} playing={playing} />
      </Svg>
    </Scene>
  )
}
