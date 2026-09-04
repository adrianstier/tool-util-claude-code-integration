'use client'

import {
  useState,
  ReactNode,
  Children,
  isValidElement,
  createContext,
  useContext,
} from 'react'
import { cn } from '@/lib/utils'

interface TabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

interface TabsProps {
  defaultTab?: string
  children: ReactNode
  className?: string
}

interface TabListProps {
  children: ReactNode
  className?: string
}

interface TabProps {
  value: string
  children: ReactNode
  icon?: ReactNode
  className?: string
}

interface TabPanelProps {
  value: string
  children: ReactNode
  className?: string
}

export function Tabs({ defaultTab, children, className }: TabsProps) {
  // Find the first Tab value to use as default
  let firstTabValue = defaultTab || ''

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === TabList) {
      const tabListChild = child as React.ReactElement<TabListProps>
      Children.forEach(tabListChild.props.children, (tabChild) => {
        if (
          isValidElement(tabChild) &&
          tabChild.type === Tab &&
          !firstTabValue
        ) {
          const tabElement = tabChild as React.ReactElement<TabProps>
          firstTabValue = tabElement.props.value
        }
      })
    }
  })

  const [activeTab, setActiveTab] = useState(firstTabValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('my-6', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabList({ children, className }: TabListProps) {
  return (
    <div
      className={cn(
        'scrollbar-hide flex gap-1 overflow-x-auto border-b border-ink-200 dark:border-ink-700',
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

export function Tab({ value, children, icon, className }: TabProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tab must be used within Tabs')

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        '-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all',
        isActive
          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
          : 'border-transparent text-ink-600 hover:border-ink-300 hover:text-ink-700 dark:text-ink-400 dark:hover:border-ink-600 dark:hover:text-ink-300',
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  )
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabPanel must be used within Tabs')

  const { activeTab } = context
  const isActive = activeTab === value

  if (!isActive) return null

  return (
    <div
      role="tabpanel"
      className={cn('animate-in fade-in-50 pt-6 duration-200', className)}
    >
      {children}
    </div>
  )
}
