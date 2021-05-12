import {
  GET_CLASS,
  GET_LIST,
  GET_ELEMENT_CLASS,
  GET_ELEMENT,
  GET_FOOD_INFO,
  SET_ELEMENT_CLASS_STATUS,
  SET_TAB_DATA,
  SET_TAB_DATA_NULL,
  SET_CURRENT,
  SET_FOOD_COOD,
  GET_FOOD_ALL_LIST,
  SET_SELECTED_FOOD,
  DELETE_SELECTED_FOOD,
  SET_SELECTED_ELEMENT,
  DELETE_SELECTED_ELEMENT,
  SET_TABLE_DATA
} from '../constants'

const INITIAL_STATE = {
  classList: [],
  foodList: [],
  elementClassMap: [],
  elementMap: [],
  foodInfo: {},
  tabData: [],
  current: 0,
  foodCodes: {}, //存储收藏的元素
  foodAllList: [], //所有食材列表
  selectedFood: {}, //存储所有食材中已选中的食材
  selectedElement: {}, //存储所有元素中已选中的元素
  tableData: [],
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
    case SET_TAB_DATA_NULL:
      return {
        ...state,
        tabData: state.classList.map((item, index) => {
          return {
            condition: null,
            data: []
          }
        })
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
    case SET_SELECTED_ELEMENT:
      return {
        ...state,
        selectedElement: {
          ...state.selectedElement,
          [action.data.code]: action.data
        }
      }
      break;
    case DELETE_SELECTED_ELEMENT:
      const ele = state.selectedElement;
      delete ele[action.code]
      return {
        ...state,
        selectedElement: {
          ...ele
        }
      }
      break;
    case SET_TABLE_DATA:
      return {
        ...state,
        tableData: action.data
      }
      break;
    default:
      return state
  }
}
