import type { LocalizedString } from '../i18n/types'
import type { ReactNode } from 'react'

export interface Category {
  id: string
  title: LocalizedString
}

export interface ResourceLink {
  title: string
  url: string
}

export type VisualKind =
  | 'intro-hero'
  | 'seq-problem'
  | 'rnn-limits'
  | 'attention-intuition'
  | 'qkv-flow'
  | 'dot-product'
  | 'softmax-weights'
  | 'scaled-attention'
  | 'multi-head'
  | 'positional'
  | 'encoder-stack'
  | 'decoder-stack'
  | 'full-transformer'
  | 'self-vs-cross'
  | 'why-scale'
  | 'wrap-up'
  | 'generic'
  | 'ml-loop'
  | 'learning-types'
  | 'data-split'
  | 'bias-variance'
  | 'loss-curve'
  | 'gradient-descent'
  | 'regularization'
  | 'metrics-board'
  | 'feature-pipeline'
  | 'perceptron'
  | 'mlp-layers'
  | 'activations'
  | 'backprop'
  | 'norm-flow'
  | 'dropout'
  | 'cnn-filters'
  | 'pooling'
  | 'residual'
  | 'optimizer-path'
  | 'nlp-pipeline'
  | 'text-clean'
  | 'bow-matrix'
  | 'lm-next-token'
  | 'ngram-window'
  | 'perplexity'
  | 'ner-tags'
  | 'parse-tree'
  | 'semantic-roles'
  | 'vector-space'
  | 'word2vec'
  | 'subword-pieces'
  | 'contextual-emb'
  | 'cosine-sim'
  | 'dim-reduce'
  | 'lstm-gates'
  | 'seq2seq'
  | 'teacher-forcing'
  | 'causal-mask'
  | 'gpt-stack'
  | 'bert-mask'
  | 'pretrain-finetune'
  | 'context-window'
  | 'in-context'
  | 'prompting'
  | 'rag-flow'
  | 'agents-tools'
  | 'scaling-laws'
  | 'moe'
  | 'multimodal'
  | 'tokenize-split'
  | 'bpe-merge'
  | 'tok-issues'
  | 'multilingual-tok'
  | 'lr-schedule'
  | 'mixed-precision'
  | 'distributed'
  | 'data-quality'
  | 'curriculum'
  | 'checkpoint'
  | 'hyperparams'
  | 'greedy-decode'
  | 'beam-search'
  | 'temperature'
  | 'top-p'
  | 'repetition'
  | 'structured-out'
  | 'finetune'
  | 'lora'
  | 'instruction-tune'
  | 'pref-loop'
  | 'rlhf'
  | 'forgetting'
  | 'benchmarks'
  | 'human-eval'
  | 'hallucination'
  | 'toxicity'
  | 'privacy'
  | 'prompt-injection'
  | 'guardrails'
  | 'red-team'
  | 'vit'
  | 'speech-wave'
  | 'diffusion'
  | 'sparse-attn'
  | 'long-context'
  | 'state-space'
  | 'inference-pipe'
  | 'quantization'
  | 'kv-cache'
  | 'batching'
  | 'serving'
  | 'observability'
  | 'ci-eval'
  | 'cost-latency'
  | 'kmeans'
  | 'knn'

export type InteractiveKind =
  | 'quiz'
  | 'temperature'
  | 'softmax'
  | 'learning-rate'
  | 'attention-focus'
  | 'none'

export interface Topic {
  id: string
  category: string
  minutes: number
  tags: string[]
  concepts: string[]
  resources: ResourceLink[]
  title: LocalizedString
  summary: LocalizedString
  /** Super-simple explanation */
  simple: LocalizedString
  /** What is this concept? */
  whatIs: LocalizedString
  /** Mathematics explained in plain language */
  mathExplain: LocalizedString
  /** Why it matters */
  whyMatters: LocalizedString
  /** Concrete tiny example */
  example: LocalizedString
  /** What the animation is showing */
  visualExplain: LocalizedString
  narration: LocalizedString
  deepDive: LocalizedString
  formula: LocalizedString
  interactive?: InteractiveKind
  visual?: VisualKind
}

export interface StepVisualProps {
  playing: boolean
  title?: string
}

export type VisualRegistry = Record<VisualKind, (props: StepVisualProps) => ReactNode>
