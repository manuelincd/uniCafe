import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

if (import.meta.env.DEV) {
  Promise.all([
    import('./stores/useOrderStore.js'),
    import('./stores/useUserStore.js'),
    import('./stores/useCartStore.js'),
  ]).then(([order, user, cart]) => {
    window.__stores = {
      order: order.default,
      user:  user.default,
      cart:  cart.default,
    }
    console.info('🛠 __stores disponible en consola')
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
