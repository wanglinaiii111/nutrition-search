import {
  HISTOTY_LIST,
  LIST_OPEN,
  DETELE_LIST_ITEM
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
    case DETELE_LIST_ITEM:
      return {
        ...state,
        historyList: state.historyList.filter(item => {
          return item._id !== action._id
        })
      }
      break;
    default:
      return state
  }
}
