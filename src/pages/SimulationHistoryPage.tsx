import { useState } from 'react'

import { SimulationHistoryCard } from '@/components/features/SimulationHistory/Card'
import { EmptyState } from '@/components/features/SimulationHistory/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PageHero } from '@/components/shared/PageHero'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export function SimulationHistoryPage() {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()

  const [simulations, setSimulations] = useState<SimulationRecord[]>(() =>
    getAllSimulations(),
  )
  const [simulationToDelete, setSimulationToDelete] =
    useState<SimulationRecord | null>(null)

  const handleConfirmDelete = () => {
    if (!simulationToDelete) {
      return
    }

    deleteSimulation(simulationToDelete.id)
    setSimulations((current) =>
      current.filter((record) => record.id !== simulationToDelete.id),
    )
    setSimulationToDelete(null)
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHero
        title="Histórico de simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros."
      />

      {simulations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-6">
          {simulations.map((simulation) => (
            <SimulationHistoryCard
              key={simulation.id}
              simulation={simulation}
              onDelete={() => {
                setSimulationToDelete(simulation)
              }}
            />
          ))}
        </div>
      )}

      {simulationToDelete && (
        <ConfirmDialog
          title="Excluir simulação?"
          description={`A simulação "${simulationToDelete.goalName}" e o insight gerado para ela serão removidos definitivamente.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setSimulationToDelete(null)
          }}
        />
      )}
    </main>
  )
}
