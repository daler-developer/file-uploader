import { StrictMode } from 'react'
import { render } from 'react-dom'
import App from './components/App'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from 'redux/store'


render(
  <StrictMode>
    <Router basename="/image-gallery">
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </StrictMode>,
  document.getElementById('root')
)
