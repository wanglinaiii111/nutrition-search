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
  SET_FOOD_COOD,
  GET_FOOD_ALL_LIST,
  SET_SELECTED_FOOD,
  DELETE_SELECTED_FOOD,
  SET_SELECTED_ELEMENT,
  DELETE_SELECTED_ELEMENT,
  SET_TABLE_DATA
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

export const setSelectedFoodAction = (data) => {
  return {
    type: SET_SELECTED_FOOD,
    data
  }
}

export const deleteSelectedFoodAction = (code) => {
  return {
    type: DELETE_SELECTED_FOOD,
    code
  }
}

export const setSelectedEleAction = (data) => {
  return {
    type: SET_SELECTED_ELEMENT,
    data
  }
}

export const deleteSelectedEleAction = (code) => {
  return {
    type: DELETE_SELECTED_ELEMENT,
    code
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
    const list = []
    const newData = [obj, ...data];
    const res = newData.map((item, index) => {
      arr[index] = {
        condition: {},
        data: []
      };
      list[index] = [];
      return {
        ...item,
        title: item.name
      }
    })
    batch(() => {
      dispatch(setTabDataAction(null, arr));
      dispatch(setFoodAllListAction(null, list))
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

export const setFoodAllListAction = (index, data) => {
  return {
    type: GET_FOOD_ALL_LIST,
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
  return (dispatch) => {
    const res = data.map(item => {
      return {
        ...item,
        title: item.name
      }
    })
    dispatch({
      type: GET_ELEMENT_CLASS,
      data: res
    })
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

export const setTableData = (data) => {
  return {
    type: SET_TABLE_DATA,
    data
  }
}