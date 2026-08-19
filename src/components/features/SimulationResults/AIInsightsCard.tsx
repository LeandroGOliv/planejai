import 'react-loading-skeleton/dist/skeleton.css'

import { useEffect, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'

import { ChatInput } from '@/components/features/Insights/ChatInput'
import { Conversation } from '@/components/features/Insights/Conversation'
import { Divider } from '@/components/shared/Divider'
import { useConversation } from '@/hooks/useConversation'
import { useInsight } from '@/hooks/useInsight'

import { Content } from '../Insights/Content'
import { Error } from '../Insights/Error'

interface AIInsightCardProps {
  simulationId: string
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)
  const {
    messages,
    pendingQuestion,
    isLoading: isAnswering,
    error: conversationError,
    sendQuestion,
    retry,
  } = useConversation(simulationId)

  const scrollRef = useRef<HTMLDivElement>(null)
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    const container = scrollRef.current

    if (!container) {
      return
    }

    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
  }, [messages, pendingQuestion, isAnswering])

  return (
    <div className="bg-card order-2 rounded-[22px] p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex items-center gap-3">
        <span>✨</span>
        <span className="text-primary text-sm font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {insight?.title && (
        <h2 className="text-foreground mb-2.5 text-[32px] leading-tight font-semibold">
          {insight.title}
        </h2>
      )}

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}

      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => {
            fetchInsight(simulationId)
          }}
        />
      )}

      {!isLoading && insight && !error && (
        <>
          <div
            ref={scrollRef}
            className="border-border max-h-112 [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] overflow-y-auto rounded-2xl border p-4"
          >
            <Content insight={insight} />
            <Conversation
              messages={messages}
              pendingQuestion={pendingQuestion}
              isLoading={isAnswering}
              error={conversationError}
              onRetry={retry}
            />
          </div>

          <Divider orientation="horizontal" spacing={24} />

          <ChatInput
            disabled={isAnswering}
            onSubmit={(question) => {
              void sendQuestion(question)
            }}
          />
        </>
      )}
    </div>
  )
}
