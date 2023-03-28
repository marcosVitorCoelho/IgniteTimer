import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../..'
import { CountdownContainer, Separator } from './styles'

export function CountDown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentyCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 // total de segundos que foi settado na tarefa

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0 // subtrai o total de segundos pelos segundos que já passaram, isso faz o currentSeconds reduzir

  const minutesAmount = Math.floor(currentSeconds / 60) // Math.floor sempre arredonda pra baixo. Ex: 24,5, ele arredonda pra 24
  const secondsAmount = currentSeconds % 60 // O resto da divisão do total de segundos por 60 pode não ser exata, o resto é a quantidade de segundos

  const minutes = String(minutesAmount).padStart(2, '0') // Preenche o array com '0' até chegar no tamanho limite definido '2' caso não tive tamanho limite (ex: 10min), se for 9min, ele preenche com 09
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }

    return () => {
      document.title = ``
    }
  }, [minutes, seconds, activeCycle])

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        // Compara a data da criação da tarefa com a data atual e coloca a diferença de segundos (Crescente)
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        if (secondsDifference >= totalSeconds) {
          markCurrentyCycleAsFinished()
          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      // React limpa os efeitos da renderização anterior antes de rodar os efeitos da próxima vez.
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentyCycleAsFinished,
    setSecondsPassed,
  ])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
