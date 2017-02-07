import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'

export class User extends React.Component {

  constructor (props) {
    super(props)
    this.idChange = this.idChange.bind(this)
    this.fnameChange = this.fnameChange.bind(this)
    this.lnameChange = this.lnameChange.bind(this)
    this.ageChange = this.ageChange.bind(this)
    this.cityChange = this.cityChange.bind(this)
    this.id = this.props.user.isEmpty() ? props.routeParams.id : props.user.get('id')
    this.state = {
      fname: '',
      lname: '',
      age: '',
      city: ''
    }
  }

  idChange (e) {
    this.setState({ id:e.target.value })
  }

  fnameChange (e) {
    this.setState({ fname:e.target.value })
  }

  lnameChange (e) {
    this.setState({ lname:e.target.value })
  }

  ageChange (e) {
    this.setState({ age:e.target.value })
  }

  cityChange (e) {
    this.setState({ city:e.target.value })
  }

  componentWillMount () {
    if (this.props.user.isEmpty()) {
      this.props.getUser(this.id)
    }
  }

  render () {
    const props = this.props

    return (
      <div style={{ margin: '0 auto' }}>
        <h4>First Name: {props.user.get('fname')}</h4>
        <input ref='fname' onChange={this.fnameChange} />
        <button className='btn btn-default' onClick={() => {
          props.changeFname(this.id, this.state.fname)
          this.refs.fname.value = ''
        }}>
            Change First Name
          </button>
        <h4>Last Name: {props.user.get('lname')}</h4>
        <input ref='lname' onChange={this.lnameChange} />
        <button className='btn btn-default' onClick={() => {
          props.changeLname(this.id, this.state.lname)
          this.refs.lname.value = ''
        }}>
            Change Last Name
          </button>
        <h4>Age: {props.user.get('age')}</h4>
        <input ref='age' onChange={this.ageChange} />
        <button className='btn btn-default' onClick={() => {
          props.changeAge(this.id, this.state.age)
          this.refs.age.value = ''
        }}>
            Change Age
          </button>
        <h4>City: {props.user.get('city')}</h4>
        <input ref='city' onChange={this.cityChange} />
        <button className='btn btn-default' onClick={() => {
          props.changeCity(this.id, this.state.city)
          this.refs.city.value = ''
        }}>
            Change City
          </button>
      </div>
    )
  }
}

User.propTypes = {
  user     : ImmutablePropTypes.map.isRequired,
  changeFname : React.PropTypes.func.isRequired,
  changeLname : React.PropTypes.func.isRequired,
  changeAge   : React.PropTypes.func.isRequired,
  changeCity  : React.PropTypes.func.isRequired
}

export default User

// import React from 'react'
// import ImmutablePropTypes from 'react-immutable-proptypes';

// export const User = (props) => {

//   console.log(props)

//     let userId, fname, lname, age, city;

//     const id = props.user.get("id"),
//           setUserId = node => userId = node,
//           setFname = node => fname = node,
//           setLname = node => lname = node,
//           setAge = node => age = node,
//           setCity = node => city = node

//     return (
//         <div style={{ margin: '0 auto' }}>
//           <h2>Get User</h2>
//           <input ref={setUserId}>
//           </input>
//           <button className='btn btn-default' onClick={() => {
//             props.getUser(id.value)
//             userId.value = ''
//           }}>
//            Get User
//           </button>
//           <h4>First Name: {props.user.get("fname")}</h4>
//           <input ref={setFname}>
//           </input>
//           <button className='btn btn-default' onClick={() => {
//             console.log("STATE IDDD", id)
//             props.changeFname(id, fname.value)
//             fname.value = ''
//           }}>
//             Change First Name
//           </button>
//           <h4>Last Name: {props.user.get("lname")}</h4>
//           <input ref={setLname}>
//           </input>
//           <button className='btn btn-default' onClick={() => {
//             props.changeLname(id, lname.value)
//             lname.value = ''
//           }}>
//             Change Last Name
//           </button>
//           <h4>Age: {props.user.get("age")}</h4>
//           <input ref={setAge}>
//           </input>
//           <button className='btn btn-default' onClick={() => {
//             props.changeAge(id, age.value)
//             age.value = ''
//           }}>
//             Change Age
//           </button>
//           <h4>City: {props.user.get("city")}</h4>
//           <input ref={setCity}>
//           </input>
//           <button className='btn btn-default' onClick={() => {
//             props.changeCity(id, city.value)
//             city.value = ''
//           }}>
//             Change City
//           </button>
//         </div>
//     )
// }

// User.propTypes = {
//   user     : ImmutablePropTypes.map.isRequired,
//   changeFname : React.PropTypes.func.isRequired,
//   changeLname : React.PropTypes.func.isRequired,
//   changeAge   : React.PropTypes.func.isRequired,
//   changeCity  : React.PropTypes.func.isRequired
// }

// export default User

/*

import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes';

export class User extends React.Component {

  constructor(props){
    super(props)
    this.idChange = this.idChange.bind(this)
    this.fnameChange = this.fnameChange.bind(this)
    this.lnameChange = this.lnameChange.bind(this)
    this.ageChange = this.ageChange.bind(this)
    this.cityChange = this.cityChange.bind(this)
    this.state = {
      id: props.user.get('id'),
      fname: '',
      lname: '',
      age: '',
      city: ''
    }
  }

  idChange(e){
    this.setState({id:e.target.value})
  }

  fnameChange(e){
    this.setState({fname:e.target.value})
  }

  lnameChange(e){
    this.setState({lname:e.target.value})
  }

  ageChange(e){
    this.setState({age:e.target.value})
  }

  cityChange(e){
    this.setState({city:e.target.value})
  }

  componentWillMount(){
    if(this.props.user.isEmpty()){
      this.props.getUser(this.props.routeParams.id)
    }
  }

  render(){
    let props = this.props
    let userId, fname, lname, age, city;

    const id = props.user.get("id"),
          setUserId = node => userId = node,
          setFname = node => fname = node,
          setLname = node => lname = node,
          setAge = node => age = node,
          setCity = node => city = node

    return (
        <div style={{ margin: '0 auto' }}>
          <h2>Get User</h2>
          <input ref="id" onChange={this.idChange}>
          </input>
          <button className='btn btn-default' onClick={() => {
            props.getUser(this.state.id)
            this.refs.id.value = ''
          }}>
           Get User
          </button>
          <h4>First Name: {props.user.get("fname")}</h4>
          <input ref="fname" onChange={this.fnameChange}>
          </input>
          <button className='btn btn-default' onClick={() => {
            props.changeFname(this.state.id, this.state.fname)
            this.refs.fname.value = ''
          }}>
            Change First Name
          </button>
          <h4>Last Name: {props.user.get("lname")}</h4>
          <input ref="lname" onChange={this.lnameChange}>
          </input>
          <button className='btn btn-default' onClick={() => {
            props.changeLname(this.state.id, this.state.lname)
            this.refs.lname.value = ''
          }}>
            Change Last Name
          </button>
          <h4>Age: {props.user.get("age")}</h4>
          <input ref="age" onChange={this.ageChange}>
          </input>
          <button className='btn btn-default' onClick={() => {
            props.changeAge(this.state.id, this.state.age)
            this.refs.age.value = ''
          }}>
            Change Age
          </button>
          <h4>City: {props.user.get("city")}</h4>
          <input ref="city" onChange={this.cityChange}>
          </input>
          <button className='btn btn-default' onClick={() => {
            props.changeCity(this.state.id, this.state.city)
            this.refs.city.value = ''
          }}>
            Change City
          </button>
        </div>
    )
  }
}

User.propTypes = {
  user     : ImmutablePropTypes.map.isRequired,
  changeFname : React.PropTypes.func.isRequired,
  changeLname : React.PropTypes.func.isRequired,
  changeAge   : React.PropTypes.func.isRequired,
  changeCity  : React.PropTypes.func.isRequired
}

export default User

*/
