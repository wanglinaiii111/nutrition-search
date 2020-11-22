import {
  SET_USERID,
} from '../constants'

const INITIAL_STATE = {
  userId: "",
}

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USERID:
      return {
        ...state,
        userId: action.userId
      }
      break;
    default:
      return state
  }
}
