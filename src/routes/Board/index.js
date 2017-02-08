import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'board',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Board = require('./containers/BoardContainer').default
      const reducer = require('./modules/board').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'board', reducer })

      /*  Return getComponent   */
      cb(null, Board)

    /* Webpack named bundle   */
    }, 'board')
  }
})
