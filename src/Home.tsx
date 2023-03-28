import { createContext, useContext, useState } from 'react'

const CyclesContext = createContext({} as any) // Criando o contexto, no caso aqui recebe um objeto e seu tipo

function NewCycleForm() {
  const { activeCycle, setActiveCycle } = useContext(CyclesContext) // Usa o contexto e o conteúdo dentro dele passando como parâmetro o contexto
  return (
    <h1>
      NewCycleForm: {activeCycle}
      <button
        onClick={() => {
          setActiveCycle((state: any) => state + 1)
        }}
      >
        Clicar
      </button>
    </h1>
  )
}

function CountDown() {
  const { activeCycle } = useContext(CyclesContext)
  return <h1>CountDown: {activeCycle}</h1>
}

export function Home() {
  const [activeCycle, setActiveCycle] = useState(0)

  return (
    <CyclesContext.Provider value={{ activeCycle, setActiveCycle }}>
      {' '}
      {/** Provider do context, o value recebe o valor que queremos compartilhar entre os componentes filho, deve estar por volta de todos os componentes que preciso usar */}
      <div>
        <NewCycleForm />
        <CountDown />
      </div>
    </CyclesContext.Provider>
  )
}
