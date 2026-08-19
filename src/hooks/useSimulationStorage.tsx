import {
  type SimulationFormData,
  type SimulationRecord,
} from '@/data/simulation'

const LOCAL_STORAGE_KEY = 'simulation-data'

export const useSimulationStorage = () => {
  const readAll = (): SimulationRecord[] => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    return storage ? (JSON.parse(storage) as SimulationRecord[]) : []
  }

  const writeAll = (records: SimulationRecord[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records))
  }

  const saveFormData = (formData: SimulationFormData) => {
    const id = crypto.randomUUID()
    const record: SimulationRecord = {
      ...formData,
      id,
      createdAt: new Date().toISOString(),
    }

    writeAll([...readAll(), record])

    return id
  }

  const getFormData = (id: string): SimulationRecord | null => {
    return readAll().find((record) => record.id === id) || null
  }

  // A ordem do array é a ordem de criação, então o histórico só precisa
  // inverter para mostrar a simulação mais recente primeiro
  const getAllSimulations = (): SimulationRecord[] => {
    return readAll().toReversed()
  }

  const updateSimulation = (id: string, data: SimulationRecord) => {
    const updated = readAll().map((record) =>
      record.id === id ? { ...data } : record,
    )

    writeAll(updated)
  }

  const deleteSimulation = (id: string) => {
    writeAll(readAll().filter((record) => record.id !== id))
  }

  return {
    saveFormData,
    getFormData,
    getAllSimulations,
    updateSimulation,
    deleteSimulation,
  }
}
