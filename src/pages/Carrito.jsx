import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'
import useCartStore from '@/stores/useCartStore'

export default function Carrito() {
  const navigate = useNavigate()
  const { items, notaCocina, quitarItem, actualizarCantidad, setNotaCocina } = useCartStore()
  const totalPrecio = useCartStore((s) => s.totalPrecio())

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen gap-4 px-6"
      >
        <ShoppingCart size={64} className="text-gray-200" />
        <h2 className="text-xl font-bold text-gray-700">Carrito vacío</h2>
        <p className="text-gray-400 text-center">Agrega algo del menú para empezar tu pedido</p>
        <button onClick={() => navigate('/menu/buenos-dias')} className="btn-primary">
          Ver el menú
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex-1">Tu carrito</h1>
        <span className="text-gray-400 text-sm">{items.reduce((a, i) => a + i.cantidad, 0)} artículo(s)</span>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 pb-56 space-y-3">
        {items.map((item) => (
          <div key={item.uid} className="card space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.nombre}</p>
                {item.personalizaciones?.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.personalizaciones.map((p) => p.label).join(' · ')}
                  </p>
                )}
              </div>
              <button
                onClick={() => quitarItem(item.uid)}
                className="p-1.5 text-red-400 active:scale-90 transition-transform"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => actualizarCantidad(item.uid, item.cantidad - 1)}
                  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center"
                >
                  <Minus size={14} className="text-gray-500" />
                </button>
                <span className="font-bold w-4 text-center">{item.cantidad}</span>
                <button
                  onClick={() => actualizarCantidad(item.uid, item.cantidad + 1)}
                  className="w-7 h-7 rounded-full bg-primary flex items-center justify-center"
                >
                  <Plus size={14} className="text-white" />
                </button>
              </div>
              <span className="font-bold text-primary">
                ${(item.precio + item.precioPersonalizaciones) * item.cantidad}
              </span>
            </div>
          </div>
        ))}

        {/* Nota para cocina */}
        <div className="card">
          <p className="text-sm font-semibold text-gray-700 mb-2">Nota para la cocina (opcional)</p>
          <textarea
            value={notaCocina}
            onChange={(e) => setNotaCocina(e.target.value)}
            placeholder="Ej: Sin chile a todo, por favor"
            rows={3}
            maxLength={150}
            className="w-full text-sm text-gray-700 placeholder-gray-300 resize-none
                       outline-none border border-gray-100 rounded-lg p-2 focus:border-primary"
          />
        </div>
      </div>

      {/* Footer fijo */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                      bg-white border-t border-gray-100 px-4 py-4 pb-safe shadow-bottom">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-2xl font-bold text-primary">${totalPrecio}</span>
        </div>
        <button
          onClick={() => navigate('/horario')}
          className="btn-primary w-full"
        >
          Elegir horario de recolección →
        </button>
      </div>
    </motion.div>
  )
}
