import { useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useCartStore from '@/stores/useCartStore'

export default function CartFAB() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const items = useCartStore((s) => s.items)
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)

  // Oculto en /carrito y cuando el carrito está vacío
  const visible = pathname !== '/carrito' && totalItems > 0

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="cart-fab"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          onClick={() => navigate('/carrito')}
          className="fixed right-4 bottom-[84px] z-30 w-14 h-14 bg-accent rounded-full
                     shadow-lg flex items-center justify-center"
          aria-label="Ver carrito"
        >
          <ShoppingCart size={24} className="text-white" strokeWidth={2} />
          <span
            className="absolute -top-1 -right-1 bg-primary-dark text-white
                       text-[11px] font-extrabold min-w-[20px] h-5 rounded-full
                       flex items-center justify-center px-1 leading-none"
          >
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
