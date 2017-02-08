import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'

export const Header = () => (
  <div>
    <h1>Battleship</h1>
    <IndexLink to='/' activeClassName='route--active'>
      Home
    </IndexLink>
    {' · '}
    <Link to='/board' activeClassName='route--active'>
      Board
    </Link>
    {' · '}
    <Link to='/users' activeClassName='route--active'>
      Users
    </Link>
  </div>
)

export default Header
