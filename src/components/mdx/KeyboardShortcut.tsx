import { cn } from '@/lib/utils'

interface KeyboardShortcutProps {
  keys: string | string[]
  className?: string
}

// Parse a shortcut string like "Cmd+Shift+P" into individual keys
function parseKeys(input: string | string[]): string[] {
  if (Array.isArray(input)) return input
  return input.split('+').map((k) => k.trim())
}

// Map common key names to their display symbols/text
const keyDisplayMap: Record<string, string> = {
  cmd: '⌘',
  command: '⌘',
  ctrl: 'Ctrl',
  control: 'Ctrl',
  alt: '⌥',
  option: '⌥',
  opt: '⌥',
  shift: '⇧',
  enter: '↵',
  return: '↵',
  tab: '⇥',
  esc: 'Esc',
  escape: 'Esc',
  space: '␣',
  backspace: '⌫',
  delete: '⌦',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
}

function getKeyDisplay(key: string): string {
  const normalizedKey = key.toLowerCase()
  return keyDisplayMap[normalizedKey] || key
}

export default function KeyboardShortcut({
  keys,
  className,
}: KeyboardShortcutProps) {
  const parsedKeys = parseKeys(keys)

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {parsedKeys.map((key, index) => (
        <span key={index} className="inline-flex items-center">
          <kbd
            className={cn(
              'inline-flex items-center justify-center rounded-md border',
              'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800',
              'px-1.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300',
              'min-w-[1.5rem] font-mono shadow-sm',
              'select-none'
            )}
          >
            {getKeyDisplay(key)}
          </kbd>
          {index < parsedKeys.length - 1 && (
            <span className="mx-0.5 text-xs text-gray-600 dark:text-gray-500">
              +
            </span>
          )}
        </span>
      ))}
    </span>
  )
}

// Inline keyboard key for single keys in text
interface KbdProps {
  children: string
  className?: string
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded border',
        'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800',
        'px-1.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300',
        'font-mono shadow-sm',
        'mx-0.5 select-none',
        className
      )}
    >
      {getKeyDisplay(children)}
    </kbd>
  )
}
