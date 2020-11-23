import {
  GET_CLASS,
  GET_LIST,
  GET_ELEMENT_CLASS,
  GET_ELEMENT,
  GET_FOOD_INFO,
  SET_ELEMENT_CLASS_STATUS,
  SET_TAB_DATA,
  SET_USER_COLLECT_STATUS,
  SET_CURRENT,
  SET_FOOD_COOD
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
    case SET_USER_COLLECT_STATUS:
      return {
        ...state,
        foodInfo: {
            ...state.foodInfo,
            isCollect: action.code === state.foodInfo.code ? action.status : state.foodInfo.isCollect
          },
          foodList: state.foodList.map(item => {
            if (item.code === action.code) {
              return {
                ...item,
                isCollect: action.status
              }
            }
            return item
          }),
          tabData: state.tabData.map((item, index) => {
            if (index === state.current) {
              return {
                ...item,
                data: item.data.map(d => {
                  if (d.code === action.code) {
                    return {
                      ...d,
                      isCollect: action.status
                    }
                  }
                  return d
                })
              }
            }
            return item
          })
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
    default:
      return state
  }
}
