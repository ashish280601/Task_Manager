import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import App from './App.jsx';
import './index.css';
import store from '../store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer />
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </StrictMode>,
)
