import {
  SET_USERID,
} from '../constants'

export const setUserIdAction = (userId) => {
  return {
    type: SET_USERID,
    userId
  }
}
