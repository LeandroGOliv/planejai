import { Send } from 'lucide-react'
import { type FormEvent, useState } from 'react'

interface ChatInputProps {
  disabled: boolean
  onSubmit: (question: string) => void
}

export function ChatInput({ disabled, onSubmit }: ChatInputProps) {
  const [value, setValue] = useState('')

  const question = value.trim()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!question || disabled) {
      return
    }

    onSubmit(question)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
      <label htmlFor="chat-question" className="sr-only">
        Pergunte algo sobre a sua simulação
      </label>
      <input
        id="chat-question"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
        }}
        disabled={disabled}
        placeholder="Pergunte algo sobre a sua simulação..."
        className="bg-input border-border text-foreground placeholder:text-muted-foreground h-[54px] min-w-0 flex-1 rounded-[20px] border px-5 text-sm outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !question}
        aria-label="Enviar pergunta"
        className="bg-primary text-primary-foreground flex h-15 w-15 shrink-0 cursor-pointer items-center justify-center rounded-2xl transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send size={22} />
      </button>
    </form>
  )
}
