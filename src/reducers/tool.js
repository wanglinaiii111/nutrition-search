import {
  HISTOTY_LIST,
  LIST_OPEN
} from '../constants'

const INITIAL_STATE = {
  historyList: [],
}

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case HISTOTY_LIST:
      return {
        ...state,
        historyList: action.data
      }
      break;
    case LIST_OPEN:
      return {
        ...state,
        historyList: state.historyList.map((item, index) => {
          if (index === action.index) {
            return {
              ...item,
              open: !item.open
            }
          }
          return item
        })
      }
      break;
    default:
      return state
  }
}
