import { Clock, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/shared/Button'

export function EmptyState() {
  const navigate = useNavigate()

  return (
    <div className="bg-card flex flex-col items-center gap-4 rounded-[22px] p-10 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
      <div className="bg-muted-primary flex h-14 w-14 items-center justify-center rounded-2xl">
        <Clock size={28} className="text-primary" />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-foreground text-lg font-semibold">
          Nenhuma simulação por aqui ainda
        </h2>
        <p className="text-muted-foreground text-sm">
          Faça sua primeira simulação para acompanhar seus planos financeiros.
        </p>
      </div>

      <Button
        variant="primary"
        icon={TrendingUp}
        onClick={() => void navigate('/')}
      >
        Nova simulação
      </Button>
    </div>
  )
}
