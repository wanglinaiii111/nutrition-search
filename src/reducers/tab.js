import {
  SET_PAGE
} from '../constants'

const INITIAL_STATE = {
  page: 'personal-center'
}

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_PAGE:
      return {
        ...state,
        page: action.page
      }

      default:
        return state
  }
}
