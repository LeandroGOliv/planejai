import { useState } from 'react'

import {
  buildConversationContents,
  buildConversationSystemInstruction,
} from '@/data/aiPrompt'
import type { ChatMessage, SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { askQuestion } from '@/services/aiService'

export const useConversation = (id: string) => {
  const { getFormData, updateSimulation } = useSimulationStorage()

  const [messages, setMessages] = useState<ChatMessage[]>(
    () => getFormData(id)?.conversation ?? [],
  )

  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendQuestion = async (question: string) => {
    const simulation = getFormData(id)

    if (!simulation) {
      setError('Simulação não encontrada.')
      return
    }

    setPendingQuestion(question)
    setIsLoading(true)
    setError(null)

    try {
      const answer = await askQuestion(
        buildConversationContents(messages, question),
        buildConversationSystemInstruction(simulation),
      )

      const updated: ChatMessage[] = [
        ...messages,
        { id: crypto.randomUUID(), role: 'user', content: question },
        { id: crypto.randomUUID(), role: 'model', content: answer },
      ]

      setMessages(updated)
      setPendingQuestion(null)
      updateSimulation(id, {
        ...simulation,
        conversation: updated,
      } as SimulationRecord)
    } catch {
      setError('Não foi possível responder agora. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const retry = () => {
    if (pendingQuestion) {
      void sendQuestion(pendingQuestion)
    }
  }

  return { messages, pendingQuestion, isLoading, error, sendQuestion, retry }
}
