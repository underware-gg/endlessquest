import { useComponentValue } from '@latticexyz/react'
import { useMUD } from "../../store";

export const CounterValue = () => {
  const {
    networkLayer: {
      components: { Counter },
      systemCalls: { increment },
      singletonEntity, storeCache,
    }
  } = useMUD()

  const counter1 = useComponentValue(Counter, singletonEntity)
  // const counter2 = storeCache.tables.Counter.get(singletonEntity)

  // console.log(`COUNTER`, counter1, counter2)

  return (
    <div style={{
      position: 'absolute',
      top: '0',
      left: '0',
      padding: '0.1em',
      color: '#fff',
      fontSize: '50px',
    }}>
      {counter1?.value ?? '?'}
    </div>
  )
}
