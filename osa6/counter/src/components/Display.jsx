import { useCounterValue } from '../useCounter'

const Display = () => {
    const counter = useCounterValue()
    return <div>
      {counter}
    </div>
  }

  export default Display