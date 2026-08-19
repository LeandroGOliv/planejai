import { MessageCircle, RefreshCw } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import Skeleton from 'react-loading-skeleton'

import { Button } from '@/components/shared/Button'
import { Divider } from '@/components/shared/Divider'
import type { ChatMessage } from '@/data/simulation'

interface ConversationProps {
  messages: ChatMessage[]
  pendingQuestion: string | null
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

interface EntryProps extends PropsWithChildren {
  label: string
}

function Entry({ label, children }: EntryProps) {
  return (
    <section>
      <Divider orientation="horizontal" spacing={24} />
      <div className="mb-2 flex items-center gap-2">
        <MessageCircle size={24} className="text-primary" />
        <span className="text-muted-foreground text-base font-semibold">
          {label}
        </span>
      </div>
      {children}
    </section>
  )
}

export function Conversation({
  messages,
  pendingQuestion,
  isLoading,
  error,
  onRetry,
}: ConversationProps) {
  return (
    <>
      {messages.map((message) => (
        <Entry
          key={message.id}
          label={message.role === 'user' ? 'Você' : 'Resposta da IA'}
        >
          <p
            className={[
              'text-base leading-relaxed whitespace-pre-line',
              message.role === 'user'
                ? 'text-muted-foreground'
                : 'text-foreground',
            ].join(' ')}
          >
            {message.content}
          </p>
        </Entry>
      ))}

      {/* A pergunta pendente só vira mensagem salva quando a IA responde */}
      {pendingQuestion && (
        <>
          <Entry label="Você">
            <p className="text-muted-foreground text-base leading-relaxed whitespace-pre-line">
              {pendingQuestion}
            </p>
          </Entry>

          <Entry label="Resposta da IA">
            {isLoading && (
              <Skeleton
                count={3}
                baseColor="var(--color-skeleton-base)"
                highlightColor="var(--color-skeleton-highlight)"
                className="mb-1 rounded-lg"
              />
            )}

            {!isLoading && error && (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm text-red-500">⚠️ {error}</p>
                <Button
                  variant="primary"
                  size="sm"
                  icon={RefreshCw}
                  onClick={onRetry}
                >
                  Tentar novamente
                </Button>
              </div>
            )}
          </Entry>
        </>
      )}
    </>
  )
}
