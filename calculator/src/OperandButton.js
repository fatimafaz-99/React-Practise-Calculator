import { ACTION } from "./App"

export default function Operationbutton({ dispatch, operation }) {

    return <button onClick={() => dispatch({ type: ACTION.OPERAND, payload: { operation } })}>
        {operation}
    </button>
}