import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, Plus, Minus, Check } from 'lucide-react'
import useCartStore from '@/stores/useCartStore'
import useUserStore from '@/stores/useUserStore'
import { calcularPuntosPedido } from '@/utils/points'
import { getProducto, getCategoria } from '@/data/menu'
import PageHeader from '@/components/ui/PageHeader'

const UMBRAL_GRATUIDAD        = 200
const DESCUENTO_PUNTOS        = 10
const PUNTOS_MIN_DESCUENTO    = 100

function emojiDeItem(productoId) {
  const prod = getProducto(productoId)
  return getCategoria(prod?.categoriaId)?.emoji ?? '🍽️'
}

export default function CartPage() {
  const navigate = useNavigate()
  const {
    items, notaCocina,
    quitarItem, actualizarCantidad,
    setNotaCocina, limpiarCarrito
  } = useCartStore()
  const subtotal = useCartStore((s) => s.totalPrecio())
  const { puntos } = useUserStore()

  const [aplicarDescuento, setAplicarDescuento] = useState(false)

  const puedeDescuento = puntos >= PUNTOS_MIN_DESCUENTO
  const descuento      = aplicarDescuento && puedeDescuento ? DESCUENTO_PUNTOS : 0
  const total          = Math.max(0, subtotal - descuento)

  const { total: puntosAGanar } = calcularPuntosPedido(items, false, false)

  // Banner de progreso hacia $200
  const faltante = Math.max(0, UMBRAL_GRATUIDAD - subtotal)
  const progreso  = Math.min(100, Math.round((subtotal / UMBRAL_GRATUIDAD) * 100))

  /* ── Estado vacío ─────────────────────────────── */
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen gap-5 px-6"
      >
        <div className="w-28 h-28 bg-primary-light rounded-full flex items-center justify-center">
          <ShoppingCart size={52} className="text-primary" strokeWidth={1.5} />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-gray-800">Tu carrito está vacío</h2>
          <p className="text-gray-400 text-sm">Agrega algo del menú para empezar</p>
        </div>
        <button
          onClick={() => navigate('/menu/buenos-dias')}
          className="btn-primary"
        >
          Ver el menú
        </button>
      </motion.div>
    )
  }

  /* ── Carrito con items ───────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <PageHeader
        title="Mi Carrito"
        onBack={() => navigate(-1)}
        rightAction={
          <button
            onClick={limpiarCarrito}
            className="w-10 h-10 flex items-center justify-center rounded-xl
                       text-red-400 active:bg-red-50 transition-colors"
            aria-label="Vaciar carrito"
          >
            <Trash2 size={20} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 pb-56 space-y-4">

        {/* ── Banner de progreso ─────────────────── */}
        {faltante > 0 ? (
          <div className="bg-accent-light rounded-2xl p-4 space-y-2">
            <p className="text-accent font-semibold text-sm">
              ¡Estás a{' '}
              <span className="font-extrabold">${faltante}</span>
              {' '}de recolección gratuita!
            </p>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
            <p className="text-green-700 font-semibold text-sm">
              ✓ ¡Recolección sin costo desbloqueada!
            </p>
          </div>
        )}

        {/* ── Lista de items ─────────────────────── */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.uid}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginTop: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-card p-4"
              >
                <div className="flex gap-3">
                  {/* Miniatura */}
                  <div className="w-16 h-16 rounded-xl bg-primary-light flex items-center
                                  justify-center flex-shrink-0">
                    <span className="text-2xl select-none">{emojiDeItem(item.productoId)}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Nombre + papelera */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
                        {item.nombre}
                      </h3>
                      <button
                        onClick={() => quitarItem(item.uid)}
                        className="text-gray-300 active:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Personalizaciones */}
                    {item.personalizaciones?.length > 0 && (
                      <p className="text-gray-400 text-xs mt-0.5 leading-snug">
                        {item.personalizaciones.map((p) => p.label).join(' · ')}
                      </p>
                    )}

                    {/* Controles cantidad + precio */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => actualizarCantidad(item.uid, item.cantidad - 1)}
                          className="w-6 h-6 rounded-full border border-gray-200 flex items-center
                                     justify-center active:bg-gray-100 transition-colors"
                        >
                          <Minus size={12} className="text-gray-500" />
                        </button>
                        <span className="font-bold text-sm w-4 text-center tabular-nums">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => actualizarCantidad(item.uid, item.cantidad + 1)}
                          className="w-6 h-6 rounded-full bg-primary flex items-center
                                     justify-center active:scale-90 transition-transform"
                        >
                          <Plus size={12} className="text-white" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-extrabold text-primary text-sm tabular-nums">
                          ${(item.precio + item.precioPersonalizaciones) * item.cantidad}
                        </p>
                        {item.cantidad > 1 && (
                          <p className="text-gray-400 text-[10px] tabular-nums">
                            ${item.precio + item.precioPersonalizaciones} c/u
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Link modificar */}
                    <Link
                      to={`/producto/${item.productoId}`}
                      className="text-xs text-primary font-semibold mt-1 inline-block"
                    >
                      Modificar
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Nota para cocina ──────────────────── */}
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="font-bold text-gray-800 text-sm mb-2">
            Nota para la cocina
            <span className="font-normal text-gray-400 ml-1">(opcional)</span>
          </p>
          <textarea
            value={notaCocina}
            onChange={(e) => setNotaCocina(e.target.value)}
            placeholder="Ej: Sin chile a todo, por favor"
            rows={3}
            maxLength={150}
            className="w-full text-sm text-gray-700 placeholder-gray-300 resize-none
                       outline-none border border-gray-100 rounded-xl p-3
                       focus:border-primary transition-colors"
          />
          <p className="text-right text-[10px] text-gray-300 mt-1">
            {notaCocina.length}/150
          </p>
        </div>

        {/* ── Resumen del pedido ────────────────── */}
        <div className="bg-white rounded-2xl shadow-card p-4 space-y-3">
          <h2 className="font-bold text-gray-900">Resumen</h2>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold tabular-nums">${subtotal}</span>
          </div>

          {/* Toggle descuento por puntos */}
          {puedeDescuento && (
            <button
              onClick={() => setAplicarDescuento(!aplicarDescuento)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl
                          border-2 transition-all
                          ${aplicarDescuento
                            ? 'border-primary bg-primary-light'
                            : 'border-gray-100'
                          }`}
            >
              <div className="text-left">
                <p className={`text-sm font-semibold ${aplicarDescuento ? 'text-primary' : 'text-gray-700'}`}>
                  Descuento por puntos
                </p>
                <p className="text-xs text-gray-400">
                  Tienes {puntos} pts — aplica -${DESCUENTO_PUNTOS}
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                            transition-colors flex-shrink-0
                            ${aplicarDescuento ? 'bg-primary border-primary' : 'border-gray-300'}`}
              >
                {aplicarDescuento && (
                  <Check size={11} className="text-white" strokeWidth={3} />
                )}
              </div>
            </button>
          )}

          {descuento > 0 && (
            <div className="flex justify-between text-sm text-primary">
              <span>Descuento aplicado</span>
              <span className="font-bold tabular-nums">-${descuento}</span>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="font-extrabold text-gray-900">Total</span>
            <span className="font-extrabold text-primary text-lg tabular-nums">${total}</span>
          </div>

          {/* Chip puntos a ganar */}
          <div className="flex items-center gap-2 bg-accent-light rounded-xl px-3 py-2.5">
            <span className="text-lg select-none">⭐</span>
            <p className="text-accent font-bold text-sm">
              Ganarás {puntosAGanar} pts con este pedido
            </p>
          </div>
        </div>
      </div>

      {/* ── Botón sticky ─────────────────────────── */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                   bg-white border-t border-gray-100 px-4 py-4 pb-safe shadow-bottom"
      >
        <button
          onClick={() => navigate('/horario')}
          className="w-full flex items-center justify-between px-5 py-4 rounded-xl
                     bg-accent text-white font-extrabold text-base active:scale-[0.98]
                     transition-transform"
        >
          <span>Seleccionar horario</span>
          <span>→</span>
        </button>
      </div>
    </motion.div>
  )
}
