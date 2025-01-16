import { useContext } from 'react'
import CounterContext from './CounterContext'

export const useCounterValue = () => {
    const counterAndDispatch = useContext(CounterContext)
    return counterAndDispatch ? counterAndDispatch[0] : 0
}
  
export const useCounterDispatch = () => {
    const counterAndDispatch = useContext(CounterContext)
    return counterAndDispatch ? counterAndDispatch[1] : () => {}
}