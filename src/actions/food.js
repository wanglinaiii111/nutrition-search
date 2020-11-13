import {
  GET_CLASS,
  GET_LIST,
  GET_ELEMENT_CLASS,
  GET_ELEMENT,
  SET_TAB_FRESH_STATUS
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
  return (dispatch) => {
    const res = data.map(item => {
      return {
        ...item,
        isFresh: true
      }
    })
    dispatch({
      type: GET_LIST,
      data: res
    })
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

export const getElementAction = (data) => {
  return {
    type: GET_ELEMENT,
    data
  }
}

export const setTabFreshStatus = (status) => {
  return {
    type: SET_TAB_FRESH_STATUS,
    status
  }
}
