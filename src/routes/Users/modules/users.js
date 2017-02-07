import axios from 'axios'
import { fromJS } from 'immutable'

export const GET_USERS = 'GET_USERS'

export const getUsers = () => {
  return (dispatch, getState) => {
    axios.get('/api/users')
    .then((response) => {
      dispatch({
        type    : GET_USERS,
        payload : response.data
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }
}

const USERS_ACTION_HANDLERS = {
  [GET_USERS] : (state, action) => {
    return fromJS(action.payload)
  }
}

const initialState = []

export default function usersReducer (state = initialState, action) {
  const handler = USERS_ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
