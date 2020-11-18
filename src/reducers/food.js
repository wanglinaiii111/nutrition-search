import {
  GET_CLASS,
  GET_LIST,
  GET_ELEMENT_CLASS,
  GET_ELEMENT,
  GET_FOOD_INFO,
  SET_ELEMENT_CLASS_STATUS,
  SET_TAB_DATA
} from '../constants'

const INITIAL_STATE = {
  classList: [],
  foodList: [],
  elementClassMap: [],
  elementMap: [],
  foodInfo: {},
  tabData: []
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
    case SET_TAB_DATA:
      if (action.index === null) {
        return {
          ...state,
          tabData: action.data
        }
      }
      return {
        ...state,
        tabData: state.tabData.map((item, index) => {
          if (index === action.index) {
            return {
              condition: action.data.condition,
              data: action.data.data
            }
          }
          return {
            condition: {},
            data: []
          }
        }),
      }
      break;
    case GET_ELEMENT_CLASS:
      return {
        ...state,
        elementClassMap: action.data.map(item => {
          return {
            ...item,
            isOpened: true
          }
        })
      }
      break;
    case SET_ELEMENT_CLASS_STATUS:
      return {
        ...state,
        elementClassMap: state.elementClassMap.map((item, index) => {
          if (action.index === index) {
            return {
              ...item,
              isOpened: action.status
            }
          }
          return item
        })
      }
      break;
    case GET_ELEMENT:
      return {
        ...state,
        elementMap: action.data
      }
      break;
    case GET_FOOD_INFO:
      return {
        ...state,
        foodInfo: action.data
      }
      break;
    default:
      return state
  }
}
