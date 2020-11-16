import {
  GET_CLASS,
  GET_LIST,
  GET_ELEMENT_CLASS,
  GET_ELEMENT,
  GET_FOOD_INFO,
  SET_ELEMENT_CLASS_STATUS
} from '../constants'

export const getClassAction = (data) => {
  return (dispatch) => {
    const res = data.map(item => {
      return {
        ...item,
        title: item.name
      }
    })
    dispatch({
      type: GET_CLASS,
      data: res
    })
  }
}

export const getListAction = (data) => {
  return {
    type: GET_LIST,
    data: data
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
