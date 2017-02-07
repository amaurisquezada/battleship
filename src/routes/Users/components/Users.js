import React from 'react'
import { Link } from 'react-router'

export default class Users extends React.Component {

  componentWillMount () {
    this.props.getUsers()
  }

  onIdClick (id, e) {
    this.props.getUser(id)
  }

  render () {
    const allUsers = this.props.users.map((user) => {
      let id = user.get('id')
      let boundIdClick = this.onIdClick.bind(this, id)
      return (
        <li key={id} onClick={boundIdClick}>
          <Link to={`users/${id}`}>
            {`${user.get('fname')} ${user.get('lname')}, ${user.get('age')} - ${user.get('city')}`}
          </Link>
        </li>
      )
    })
    return (<ul>{allUsers}</ul>)
  }
}
