import {
  GET_CLASS,
  GET_LIST,
  GET_ELEMENT_CLASS,
  GET_ELEMENT,
} from '../constants'

const INITIAL_STATE = {
  classList: [],
  foodList: [],
  elementClassMap: [],
  elementMap: [],
}

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_CLASS:
      return {
        ...state,
        classList: action.data
      }
      break;
    case GET_LIST:
      return {
        ...state,
        foodList: action.data
      }
      break;
    case GET_ELEMENT_CLASS:
      return {
        ...state,
        elementClassMap: action.data
      }
      break;
    case GET_ELEMENT:
      return {
        ...state,
        elementMap: action.data
      }
      break;
    default:
      return state
  }
}
