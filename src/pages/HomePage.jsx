import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coffee, ChevronRight, Zap } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import useOrderStore from '@/stores/useOrderStore'
import useCartStore from '@/stores/useCartStore'
import { CATEGORIAS, getProducto } from '@/data/menu'
import PointsBanner from '@/components/ui/PointsBanner'

// Primeras 4 en grid 2×2; últimas 3 en grid 3 cols
const CATS_TOP    = CATEGORIAS.slice(0, 4)
const CATS_BOTTOM = CATEGORIAS.slice(4)

const containerVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.07 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } }
}

function saludo() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function HomePage() {
  const navigate = useNavigate()
  const { nombre } = useUserStore()
  const pedidos     = useOrderStore((s) => s.pedidos)
  const { agregarItem, limpiarCarrito } = useCartStore()

  const ultimoPedido = pedidos.find((p) => p.estado === 'entregado')

  const handleRepetir = () => {
    limpiarCarrito()
    ultimoPedido.items.forEach((item) => {
      const prod = getProducto(item.productoId)
      if (prod) agregarItem(prod, item.personalizaciones ?? [], item.cantidad)
    })
    navigate('/carrito')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 pt-5 pb-6 space-y-6"
    >
      {/* ── Header ─────────────────────────────────── */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <Coffee size={20} className="text-white" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">CaféUni</span>
        </div>

        {/* Avatar con iniciales → Perfil */}
        <button
          onClick={() => navigate('/perfil')}
          className="w-9 h-9 bg-primary rounded-full flex items-center justify-center
                     text-white font-bold text-sm active:scale-90 transition-transform shadow"
        >
          {nombre ? nombre[0].toUpperCase() : '?'}
        </button>
      </header>

      {/* ── Saludo ─────────────────────────────────── */}
      <div>
        <p className="text-gray-400 text-sm font-medium">{saludo()},</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-0.5">
          {nombre || 'Estudiante'} 👋
        </h1>
      </div>

      {/* ── Banner de puntos ───────────────────────── */}
      <PointsBanner />

      {/* ── Categorías ─────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">¿Qué se te antoja hoy?</h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {/* Grid 2×2 — primeras 4 categorías */}
          <div className="grid grid-cols-2 gap-3">
            {CATS_TOP.map((cat) => (
              <motion.button
                key={cat.id}
                variants={itemVariants}
                onClick={() => navigate(`/menu/${cat.id}`)}
                className="bg-white rounded-2xl shadow-card p-4 flex flex-col items-center
                           gap-2 active:scale-95 transition-transform text-center"
              >
                <span className="text-4xl select-none">{cat.emoji}</span>
                <span className="font-semibold text-gray-800 text-sm leading-tight">
                  {cat.nombre}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Grid 3 cols — últimas 3 categorías */}
          <div className="grid grid-cols-3 gap-3">
            {CATS_BOTTOM.map((cat) => (
              <motion.button
                key={cat.id}
                variants={itemVariants}
                onClick={() => navigate(`/menu/${cat.id}`)}
                className="bg-white rounded-2xl shadow-card p-3 flex flex-col items-center
                           gap-1.5 active:scale-95 transition-transform text-center"
              >
                <span className="text-3xl select-none">{cat.emoji}</span>
                <span className="font-semibold text-gray-700 text-xs leading-tight">
                  {cat.nombre}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Repetir último pedido ──────────────────── */}
      {ultimoPedido && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Repetir pedido</h2>
          <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">
                {ultimoPedido.items.slice(0, 2).map((i) => i.nombre).join(', ')}
                {ultimoPedido.items.length > 2 && ` +${ultimoPedido.items.length - 2} más`}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                ${ultimoPedido.total}
                {' · '}
                {ultimoPedido.items.reduce((a, i) => a + i.cantidad, 0)} artículos
              </p>
            </div>
            <button
              onClick={handleRepetir}
              className="bg-primary text-white text-sm font-bold px-4 py-2.5 rounded-xl
                         active:scale-95 transition-transform flex-shrink-0"
            >
              Repetir
            </button>
          </div>
        </section>
      )}

      {/* ── Banner CTA ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-primary rounded-2xl p-4 flex items-center gap-3 cursor-pointer
                   active:scale-[0.98] transition-transform"
        onClick={() => navigate('/menu/buenos-dias')}
      >
        <div className="p-2.5 bg-white/20 rounded-xl flex-shrink-0">
          <Zap size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Pide con anticipación</p>
          <p className="text-primary-light text-xs mt-0.5">
            30+ minutos antes = +5 puntos extra
          </p>
        </div>
        <ChevronRight size={18} className="text-white/50 flex-shrink-0" />
      </motion.div>
    </motion.div>
  )
}
