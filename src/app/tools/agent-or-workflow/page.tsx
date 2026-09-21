'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GitBranch, RotateCcw, ArrowLeft } from 'lucide-react'

/**
 * A decision aid for the question people skip: should this be an agent at all?
 *
 * The criteria follow the evaluation checklist Anthropic's Barry Zhang lays out
 * in "How We Build Effective Agents" — map the decision tree, weigh value
 * against token cost, find the real bottleneck, and price the cost of a mistake.
 * The scoring here is ours; it exists to make the trade-offs explicit rather
 * than to be authoritative.
 */

interface Question {
  id: string
  question: string
  help: string
  options: { label: string; score: number; note?: string }[]
}

const QUESTIONS: Question[] = [
  {
    id: 'decision-tree',
    question: 'Can you draw the decision tree for this task?',
    help: 'If you can write down every branch the task could take, you can encode those branches directly.',
    options: [
      {
        label: 'Yes — I could write the whole flowchart',
        score: 0,
        note: 'A flowchart you can draw is a script you can write. Scripts are cheaper, faster and reproducible.',
      },
      { label: 'Mostly, with some messy edges', score: 1 },
      {
        label: 'No — the path depends on what it finds',
        score: 3,
        note: 'This is the strongest single argument for an agent.',
      },
    ],
  },
  {
    id: 'token-budget',
    question: 'Roughly what does one run cost in tokens?',
    help: 'Agents pay for exploration. Below roughly 30,000–50,000 tokens, that overhead rarely earns its keep.',
    options: [
      { label: 'Small — well under ~30k tokens', score: 0 },
      { label: 'Moderate — around 30k–50k tokens', score: 1 },
      {
        label: 'Large — well over 50k, and worth it',
        score: 3,
        note: 'High token cost is only acceptable when the task value is correspondingly high.',
      },
    ],
  },
  {
    id: 'error-cost',
    question: 'What happens when it gets something wrong?',
    help: 'Autonomy multiplies both good and bad outcomes. The question is whether a mistake is recoverable.',
    options: [
      { label: 'Trivial — I notice and rerun it', score: 3 },
      { label: 'Annoying but recoverable', score: 2 },
      {
        label: 'Expensive or hard to undo',
        score: 0,
        note: 'Keep a human in the loop, or constrain the task until errors become cheap.',
      },
    ],
  },
  {
    id: 'bottleneck',
    question: 'What is actually slowing this task down?',
    help: 'If the bottleneck is not judgement, an agent will not remove it.',
    options: [
      {
        label: 'Repetitive typing or mechanical steps',
        score: 0,
        note: 'A script or a slash command solves this without the overhead.',
      },
      { label: 'Looking things up across many places', score: 2 },
      {
        label: 'Judgement calls that depend on context',
        score: 3,
      },
    ],
  },
  {
    id: 'verification',
    question: 'Can the task check its own work?',
    help: 'Tests, type checks, linters and builds give an agent a signal to iterate against.',
    options: [
      {
        label: 'Yes — tests or checks tell it if it succeeded',
        score: 3,
        note: 'This is what lets an agent recover from its own mistakes.',
      },
      { label: 'Partly — some steps are verifiable', score: 2 },
      {
        label: 'No — only I can tell if it worked',
        score: 0,
        note: 'Without a feedback signal an agent cannot tell progress from drift.',
      },
    ],
  },
]

type Verdict = {
  title: string
  body: string
  next: string
  tone: 'workflow' | 'either' | 'agent'
}

function verdictFor(score: number, max: number): Verdict {
  const pct = score / max
  if (pct < 0.35)
    return {
      tone: 'workflow',
      title: 'Build a deterministic workflow',
      body: 'Everything you described can be written down in advance. A script, a slash command, or a hook will be faster, cheaper and reproducible — and it will not surprise you at three in the morning.',
      next: 'Start with a custom slash command. If it grows branches you cannot enumerate, revisit this.',
    }
  if (pct < 0.65)
    return {
      tone: 'either',
      title: 'Start as a workflow, leave room to grow',
      body: 'This sits on the line. The usual mistake is reaching for an agent first and discovering the task was scriptable all along. Write the deterministic version, find where it actually breaks, and let that failure justify the agent.',
      next: 'Encode the parts you can describe. Note every place you had to guess — those are the candidate agent steps.',
    }
  return {
    tone: 'agent',
    title: 'An agent is a reasonable choice',
    body: 'The path depends on what the task discovers, mistakes are cheap, and something can verify the result. That combination is what agents are genuinely for.',
    next: 'Keep the first version small: an environment, a tool set, and a system prompt. Add sophistication only once the basic loop behaves.',
  }
}

const TONE_STYLE: Record<Verdict['tone'], string> = {
  workflow: 'border-cobalt-500 bg-cobalt-50 dark:bg-cobalt-950/30',
  either: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30',
  agent: 'border-sage-500 bg-sage-50 dark:bg-sage-950/30',
}

export default function AgentOrWorkflowPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const max = QUESTIONS.reduce(
    (t, q) => t + Math.max(...q.options.map((o) => o.score)),
    0
  )
  const answered = Object.keys(answers).length
  const complete = answered === QUESTIONS.length
  const score = Object.values(answers).reduce((a, b) => a + b, 0)
  const verdict = complete ? verdictFor(score, max) : null

  const notes = QUESTIONS.flatMap((q) => {
    const picked = answers[q.id]
    if (picked === undefined) return []
    const opt = q.options.find((o) => o.score === picked)
    return opt?.note ? [{ q: q.question, note: opt.note }] : []
  })

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-950">
      <div className="border-b border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/agents"
            className="mb-6 inline-flex items-center gap-2 text-sm text-ink-600 hover:text-primary-600 dark:text-ink-400 dark:hover:text-primary-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Agents track
          </Link>

          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/50">
              <GitBranch className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-ink-900 dark:text-paper-50">
              Agent or Workflow?
            </h1>
          </div>

          <p className="max-w-2xl text-lg text-ink-600 dark:text-ink-300">
            Most things built as agents should have been scripts. Five questions
            to decide before you write any code.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-ink-500 dark:text-ink-400">
            <span>
              {answered} of {QUESTIONS.length} answered
            </span>
            {answered > 0 && (
              <button
                onClick={() => setAnswers({})}
                className="inline-flex items-center gap-1.5 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Start over
              </button>
            )}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-300"
              style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          {QUESTIONS.map((q, i) => (
            <fieldset
              key={q.id}
              className="rounded-xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900"
            >
              <legend className="sr-only">{q.question}</legend>
              <h2 className="mb-1 font-display text-lg font-semibold text-ink-900 dark:text-paper-50">
                <span className="mr-2 text-primary-600 dark:text-primary-400">
                  {i + 1}.
                </span>
                {q.question}
              </h2>
              <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">
                {q.help}
              </p>

              <div className="space-y-2">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.score
                  return (
                    <label
                      key={opt.label}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                        selected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40'
                          : 'border-ink-200 hover:border-primary-300 dark:border-ink-700 dark:hover:border-primary-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={selected}
                        onChange={() =>
                          setAnswers((a) => ({ ...a, [q.id]: opt.score }))
                        }
                        className="mt-1 h-4 w-4 accent-primary-600"
                      />
                      <span className="text-ink-700 dark:text-ink-200">
                        {opt.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>

        {verdict && (
          <div
            className={`mt-8 rounded-xl border-l-4 p-6 ${TONE_STYLE[verdict.tone]}`}
          >
            <h2 className="mb-3 font-display text-xl font-bold text-ink-900 dark:text-paper-50">
              {verdict.title}
            </h2>
            <p className="mb-4 text-ink-700 dark:text-ink-200">
              {verdict.body}
            </p>
            <p className="mb-4 text-ink-700 dark:text-ink-200">
              <strong className="font-semibold">Next: </strong>
              {verdict.next}
            </p>

            {notes.length > 0 && (
              <div className="mb-4 rounded-lg bg-white/70 p-4 dark:bg-ink-900/60">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                  Worth noting
                </h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-600 dark:text-ink-300">
                  {notes.map((n) => (
                    <li key={n.q}>{n.note}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <Link
                href="/agents/building-agents"
                className="text-primary-600 hover:underline dark:text-primary-400"
              >
                Building agents →
              </Link>
              <Link
                href="/tools/slash-commands"
                className="text-primary-600 hover:underline dark:text-primary-400"
              >
                Slash commands →
              </Link>
              <Link
                href="/advanced-topics/plugins-and-hooks"
                className="text-primary-600 hover:underline dark:text-primary-400"
              >
                Hooks →
              </Link>
            </div>
          </div>
        )}

        <p className="mt-8 text-sm text-ink-500 dark:text-ink-400">
          The criteria here follow the evaluation checklist in Anthropic&apos;s
          &ldquo;How We Build Effective Agents&rdquo;. The scoring is ours, and
          is meant to surface the trade-offs rather than settle them.
        </p>
      </div>
    </div>
  )
}
