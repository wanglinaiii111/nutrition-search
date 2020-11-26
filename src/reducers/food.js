import {
  GET_CLASS,
  GET_LIST,
  GET_ELEMENT_CLASS,
  GET_ELEMENT,
  GET_FOOD_INFO,
  SET_ELEMENT_CLASS_STATUS,
  SET_TAB_DATA,
  SET_CURRENT,
  SET_FOOD_COOD,
  GET_FOOD_ALL_LIST,
  SET_SELECTED_FOOD,
  DELETE_SELECTED_FOOD
} from '../constants'

const INITIAL_STATE = {
  classList: [],
  foodList: [],
  elementClassMap: [],
  elementMap: [],
  foodInfo: {},
  tabData: [],
  current: 0,
  foodCodes: {},
  foodAllList: [],
  selectedFood: {},
}

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_CURRENT:
      return {
        ...state,
        current: action.current
      }
      break;
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
            condition: item.condition,
            data: item.data
          }
        }),
      }
      break;
    case GET_FOOD_ALL_LIST:
      if (action.index === null) {
        return {
          ...state,
          foodAllList: action.data
        }
      }
      return {
        ...state,
        foodAllList: state.foodAllList.map((item, index) => {
          if (index === action.index) {
            return action.data
          }
          return item
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
    case SET_FOOD_COOD:
      return {
        ...state,
        foodCodes: {
          ...state.foodCodes,
          [action.code]: action.status
        }
      }
      break;
    case SET_SELECTED_FOOD:
      return {
        ...state,
        selectedFood: {
          ...state.selectedFood,
          [action.data.code]: action.data
        }
      }
      break;
    case DELETE_SELECTED_FOOD:
      const food = state.selectedFood;
      delete food[action.code]
      return {
        ...state,
        selectedFood: {
          ...food
        }
      }
      break;
    default:
      return state
  }
}
