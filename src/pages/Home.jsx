import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Star, Clock } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import { CATEGORIAS } from '@/data/menu'
import { calcularNivel } from '@/utils/points'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -10 }
}

export default function Home() {
  const navigate = useNavigate()
  const { nombre, puntos, nivel } = useUserStore()
  const infoNivel = calcularNivel(puntos)

  const saludo = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 19) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.3 }}
      className="px-4 pt-6 pb-4 space-y-6"
    >
      {/* Header */}
      <header className="space-y-1">
        <p className="text-gray-500 text-sm font-medium">{saludo()},</p>
        <h1 className="text-2xl font-bold text-gray-900">{nombre || 'Estudiante'} 👋</h1>
      </header>

      {/* Card de puntos */}
      <div className="bg-primary rounded-2xl p-5 text-white shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-primary-light text-sm font-medium">Mis puntos</p>
            <p className="text-4xl font-bold">{puntos}</p>
          </div>
          <div className="text-4xl">{infoNivel.icono}</div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-primary-light text-xs">Nivel {infoNivel.nombre}</span>
          {infoNivel.siguiente && (
            <>
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${infoNivel.progreso}%` }}
                />
              </div>
              <span className="text-primary-light text-xs">{infoNivel.puntajeProximo} → {infoNivel.siguiente}</span>
            </>
          )}
        </div>
      </div>

      {/* Acceso rápido */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/pedidos')}
          className="card flex items-center gap-3 text-left active:scale-95 transition-transform"
        >
          <span className="text-2xl">📋</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Mis pedidos</p>
            <p className="text-gray-400 text-xs">Historial</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/carrito')}
          className="card flex items-center gap-3 text-left active:scale-95 transition-transform"
        >
          <span className="text-2xl">🛒</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Carrito</p>
            <p className="text-gray-400 text-xs">Ver orden</p>
          </div>
        </button>
      </div>

      {/* Categorías */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">¿Qué se te antoja?</h2>
        <div className="space-y-2">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/menu/${cat.id}`)}
              className="card w-full flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <span className="text-3xl w-10 text-center">{cat.emoji}</span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800">{cat.nombre}</p>
                <p className="text-gray-400 text-xs">{cat.descripcion}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* Footer hint */}
      <div className="flex items-center gap-2 bg-accent-light rounded-xl px-4 py-3">
        <Clock size={16} className="text-accent flex-shrink-0" />
        <p className="text-accent text-sm font-medium">
          Pide con 30+ min de anticipación y gana puntos extra
        </p>
      </div>
    </motion.div>
  )
}
