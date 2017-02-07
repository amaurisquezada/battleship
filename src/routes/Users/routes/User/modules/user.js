
// ------------------------------------
// Constants
// ------------------------------------
import axios from 'axios'
import { Map, fromJS } from 'immutable'
export const CHANGE_FIRST_NAME = 'CHANGE_FIRST_NAME'
export const CHANGE_LAST_NAME = 'CHANGE_LAST_NAME'
export const CHANGE_AGE = 'CHANGE_AGE'
export const CHANGE_CITY = 'CHANGE_CITY'
export const GET_USER = 'GET_USER'

// ------------------------------------
// Actions
// ------------------------------------

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const changeFname = (id, fname) => {
  console.log('ACTION', id)
  return (dispatch, getState) => {
    axios.patch('/api/users/' + id, { fname })
    .then((response) => {
      dispatch({
        type    : CHANGE_FIRST_NAME,
        payload : response.data
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }
}

export const getUser = (id) => {
  return (dispatch, getState) => {
    axios.get('/api/users/' + id)
    .then((response) => {
      dispatch({
        type    : GET_USER,
        payload : response.data
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }
}

export const changeLname = (id, lname) => {
  return (dispatch, getState) => {
    axios.patch('/api/users/' + id, { lname })
    .then((response) => {
      dispatch({
        type    : CHANGE_LAST_NAME,
        payload : response.data
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }
}

export const changeAge = (id, age) => {
  return (dispatch, getState) => {
    axios.patch('/api/users/' + id, { age })
    .then((response) => {
      dispatch({
        type    : CHANGE_AGE,
        payload : response.data
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }
}

export const changeCity = (id, city) => {
  return (dispatch, getState) => {
    axios.patch('/api/users/' + id, { city })
    .then((response) => {
      dispatch({
        type    : CHANGE_CITY,
        payload : response.data
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }
}

export const actions = {
  changeFname,
  changeLname,
  changeAge,
  changeCity,
  getUser
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CHANGE_FIRST_NAME]    : (state, action) => {
    state = state.set('fname', action.payload.fname)
    return state
  },

  [CHANGE_LAST_NAME] : (state, action) => {
    state = state.set('lname', action.payload.lname)
    return state
  },

  [CHANGE_AGE] : (state, action) => {
    state = state.set('age', action.payload.age)
    return state
  },

  [CHANGE_CITY] : (state, action) => {
    state = state.set('city', action.payload.city)
    return state
  },

  [GET_USER] : (state, action) => {
    state = state.merge(fromJS(action.payload))
    return state
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = Map({})

export default function userReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
