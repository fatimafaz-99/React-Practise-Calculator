import logo from './logo.svg';
import './App.css';
import './style.css'
import DigitButton from './DigitButton';
import { useReducer } from 'react';
import Operationbutton from './OperandButton';


export const ACTION = {

  ADD_DIGITS: 'add',
  CLEAR: 'clear',
  DELETE: 'delete',
  OPERAND: 'operand',
  RESULT: 'result'


}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.ADD_DIGITS:
      if (state.overwrite == true) {
        return {
          ...state,
          currOperand: payload.digit,
          overwrite: false

        }
      }
      if ((payload.digit === "0" && state.currOperand === "0") | (payload.digit === "." && state.currOperand === ".")) return state
      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}`
      }
    case ACTION.CLEAR:
      return {}
    case ACTION.DELETE:
      if (state.overwrite == true | state.currOperand.length === 1) return {
        ...state,
        currOperand: null,
        overwrite: false
      }
      if (state.currOperand == null) { return state }
      return {
        ...state,
        currOperand: state.currOperand.slice(0, -1)

      }


    case ACTION.RESULT:
      if (state.operation == null || state.prevOperand == null || state.currOperand == null) return state
      return {
        ...state,
        overwrite: true,
        prevOperand: null,
        operation: null,
        currOperand: evaluate(state)
      }
    case ACTION.OPERAND:
      if (state.currOperand == null && state.prevOperand == null) { return state }
      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.currOperand,
          currOperand: null
        }
      }
      if (state.currOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }

      }

      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        currOperand: null
      }
  }
}

function evaluate({ currOperand, prevOperand, operation }) {
  let prev = parseFloat(prevOperand)
  let curr = parseFloat(currOperand)
  if (isNaN(prev) | isNaN(curr)) { return "" }
  let res = ""
  switch (operation) {
    case '+':
      res = prev + curr
      break
    case "-":
      res = prev - curr
      break
    case "*":
      res = prev * curr
      break
    case "/":
      res = prev / curr
      break

  }
  return res.toString()

}


function formatNumber(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return FORMAT_INT.format(integer)
}
const FORMAT_INT = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})


function App() {

  const [{ currOperand, prevOperand, operation, overwrite }, dispatch] = useReducer(
    reducer,
    {}
  )

  return (

    <div className='calculator'>
      <div className='output-block'>
        <div className='previousState'>{formatNumber(prevOperand)}{operation}</div>
        <div className='currentState'>{formatNumber(currOperand)}</div>
      </div>

      <button className='span-two' onClick={() => dispatch({ type: ACTION.CLEAR })}>AC</button>
      <button className='span-two' onClick={() => dispatch({ type: ACTION.DELETE })}>DELL</button>

      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <Operationbutton operation="+" dispatch={dispatch} />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <Operationbutton operation="-" dispatch={dispatch} />

      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <Operationbutton operation="/" dispatch={dispatch} />

      <DigitButton digit="0" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <button onClick={() => dispatch({ type: ACTION.RESULT })}>=</button>
      <Operationbutton operation="*" dispatch={dispatch} />

    </div>


  );
}

export default App;
