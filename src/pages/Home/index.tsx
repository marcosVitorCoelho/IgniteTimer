import { HandPalm, Play } from 'phosphor-react'
import { createContext, useState } from 'react'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { NewCycleForm } from './Components/NewCycleForm'
import { CountDown } from './Components/CountDown'
import * as zod from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
  markCurrentyCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleformData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>('')
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  const newCycleForm = useForm<NewCycleformData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentyCycleAsFinished() {
    setCycles(
      (state) =>
        // O map varre o array
        state.map((cycle) => {
          // Nessa condição, verifica cada ciclo no array e compara os IDs afim de identificar o ciclo que está atualmente ativo
          if (cycle.id === activeCycleId) {
            return { ...cycle, finishedDate: new Date() } // Se achou o ciclo ativo muda uma informação (nesse caso insere)
          } else {
            return cycle // se não achou, retorna o ciclo
          }
        }),
      // No final, teremos um novo array com todos os ciclos que já existiam, mas com o ciclo que estava ativo com um novo atributo (finishedDate)
    )
  }

  function handleCreateNewCycle(data: NewCycleformData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    setAmountSecondsPassed(0)
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    reset()
  }

  function handleInterruptCyle() {
    setCycles(
      (state) =>
        // O map varre o array
        state.map((cycle) => {
          // Nessa condição, verifica cada ciclo no array e compara os IDs afim de identificar o ciclo que está atualmente ativo
          if (cycle.id === activeCycleId) {
            return { ...cycle, interruptedDate: new Date() } // Se achou o ciclo ativo muda uma informação (nesse caso insere)
          } else {
            return cycle // se não achou, retorna o ciclo
          }
        }),
      // No final, teremos um novo array com todos os ciclos que já existiam,mas com o ciclo que estava ativo com um novo atributo (InterruptedDate)
    )
    setActiveCycleId(null)
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  /**
   * Prop Drilling -> Quando a gente tem MUITAS propriedades APENAS para comunicação entre componentes (ContextAPI)
   * ContextAPI -> Permite compartilharmos informações entre vários componentes ao mesmo tempo
   */

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentyCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
          }}
        >
          {/* Provedor */}
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>

          <CountDown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCyle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
