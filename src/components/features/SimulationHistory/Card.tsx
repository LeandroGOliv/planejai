import { ExternalLink, Goal, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import { Divider } from '@/components/shared/Divider'
import type { SimulationRecord } from '@/data/simulation'
import { formatCurrency, parseCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { calcMonthlySavings } from '@/utils/simulation'

interface SimulationHistoryCardProps {
  simulation: SimulationRecord
  onDelete: () => void
}

interface MetricProps {
  label: string
  value: string
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="flex flex-col gap-1 lg:flex-1">
      <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground text-base font-semibold">{value}</span>
    </div>
  )
}

export function SimulationHistoryCard({
  simulation,
  onDelete,
}: SimulationHistoryCardProps) {
  const navigate = useNavigate()

  return (
    <article className="bg-card flex flex-col gap-6 rounded-[22px] p-8 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:flex-row lg:items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-[#ECE5F8]">
        <Goal size={22} className="text-primary" />
      </div>

      <div className="flex flex-col gap-6 lg:flex-1 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1 lg:flex-1">
          <span className="text-foreground text-base font-semibold">
            {simulation.goalName}
          </span>
          <span className="text-muted-foreground text-sm">
            {formatDate(simulation.createdAt)}
          </span>
        </div>

        <Metric
          label="Custo da meta"
          value={formatCurrency(parseCurrency(simulation.goalAmount))}
        />
        <Metric label="Prazo" value={`${simulation.goalDeadline} meses`} />
        <Metric
          label="Economia mensal"
          value={formatCurrency(calcMonthlySavings(simulation))}
        />
      </div>

      <Divider orientation="horizontal" spacing={0} className="lg:hidden" />

      <div className="flex items-center justify-center gap-6 lg:shrink-0">
        <Divider
          orientation="vertical"
          spacing={0}
          className="hidden lg:block"
        />

        <button
          type="button"
          onClick={onDelete}
          aria-label={`Excluir simulação ${simulation.goalName}`}
          className="-m-2 flex cursor-pointer items-center justify-center p-2 text-red-500 transition-opacity hover:opacity-70"
        >
          <Trash2 size={20} />
        </button>

        <Divider orientation="vertical" spacing={0} className="lg:hidden" />

        <Button
          variant="secondary"
          size="sm"
          icon={ExternalLink}
          onClick={() => void navigate(`/resultado/${simulation.id}`)}
        >
          Ver detalhes
        </Button>
      </div>
    </article>
  )
}
