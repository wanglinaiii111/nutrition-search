import {
  batch
} from 'react-redux';
import {
  GET_CLASS,
  GET_LIST,
  GET_ELEMENT_CLASS,
  GET_ELEMENT,
  GET_FOOD_INFO,
  SET_ELEMENT_CLASS_STATUS,
  SET_TAB_DATA,
  SET_CURRENT,
  SET_FOOD_COOD
} from '../constants'

export const setCurrentAction = (current) => {
  return {
    type: SET_CURRENT,
    current
  }
}

export const setFoodCodeAction = (code, status) => {
  return {
    type: SET_FOOD_COOD,
    code,
    status
  }
}

export const getClassAction = (data) => {
  return (dispatch) => {
    const arr = [];
    const obj = {
      code: "",
      color: "#4470ed",
      name: "全部",
    }
    const newData = [obj, ...data];
    const res = newData.map((item, index) => {
      arr[index] = {
        condition: {},
        data: []
      };
      return {
        ...item,
        title: item.name
      }
    })
    batch(() => {
      dispatch(setTabDataAction(null, arr));
      dispatch({
        type: GET_CLASS,
        data: res
      })
    })
  }
}

export const getListAction = (data) => {
  return {
    type: GET_LIST,
    data
  }
}

export const setTabDataAction = (index, data) => {
  return {
    type: SET_TAB_DATA,
    index,
    data
  }
}

export const getMoreListAction = (data) => {
  return (dispatch, getState) => {
    const oldList = getState().food.foodList;
    const res = [...oldList, ...data]
    dispatch(getListAction(res))
  }
}

export const getElementClassAction = (data) => {
  return {
    type: GET_ELEMENT_CLASS,
    data
  }
}

export const setEleClassStatusAction = (index, status) => {
  return {
    type: SET_ELEMENT_CLASS_STATUS,
    index,
    status
  }
}

export const getElementAction = (data) => {
  return {
    type: GET_ELEMENT,
    data
  }
}

export const getFoodInfoAction = (data) => {
  return {
    type: GET_FOOD_INFO,
    data
  }
}
