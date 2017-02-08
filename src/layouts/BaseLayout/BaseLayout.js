import React from 'react'
import './BaseLayout.scss'
import '../../styles/core.scss'

export const BaseLayout = ({ children }) => (
  <div className='core-layout__viewport'>
    {children}
  </div>
)

BaseLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default BaseLayout
