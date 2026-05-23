import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardList, ChevronRight, XCircle, CheckCircle, Clock, Package } from 'lucide-react'
import useOrderStore from '@/stores/useOrderStore'

const ESTADO_CONFIG = {
  pendiente:  { label: 'Pendiente',  icono: <Clock size={16} />,         color: 'bg-yellow-100 text-yellow-700' },
  listo:      { label: '¡Listo!',   icono: <CheckCircle size={16} />,   color: 'bg-green-100 text-green-700'  },
  entregado:  { label: 'Entregado', icono: <Package size={16} />,       color: 'bg-blue-100 text-blue-700'    },
  cancelado:  { label: 'Cancelado', icono: <XCircle size={16} />,       color: 'bg-red-100 text-red-700'      },
}

export default function Pedidos() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { pedidos, cancelarPedido } = useOrderStore()

  const ordenados = [...pedidos].sort(
    (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
  )

  if (pedidos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen gap-4 px-6"
      >
        <ClipboardList size={64} className="text-gray-200" />
        <h2 className="text-xl font-bold text-gray-700">Sin pedidos aún</h2>
        <p className="text-gray-400 text-center">Cuando hagas tu primer pedido aparecerá aquí</p>
        <button onClick={() => navigate('/menu/buenos-dias')} className="btn-primary">
          Ir al menú
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 pt-5 pb-4 space-y-4"
    >
      <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>

      {/* Insignias nuevas (si vienen de /confirmar) */}
      <AnimatePresence>
        {state?.nuevasInsignias?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-accent-light border border-accent rounded-2xl p-4 space-y-2"
          >
            <p className="font-bold text-accent">🎉 ¡Nuevas insignias desbloqueadas!</p>
            {state.nuevasInsignias.map((ins) => (
              <div key={ins.id} className="flex items-center gap-2">
                <span className="text-xl">{ins.icono}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{ins.nombre}</p>
                  <p className="text-gray-500 text-xs">{ins.descripcion}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {ordenados.map((pedido) => {
        const conf = ESTADO_CONFIG[pedido.estado] ?? ESTADO_CONFIG.pendiente
        const fecha = new Date(pedido.fechaCreacion)
        const esHoy = fecha.toDateString() === new Date().toDateString()

        return (
          <div key={pedido.id} className="card space-y-3">
            {/* Header del pedido */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-gray-900 text-sm">{pedido.id}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {esHoy ? 'Hoy' : fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                  {' · '}Recolección {pedido.slot}
                </p>
              </div>
              <span className={`badge ${conf.color} flex items-center gap-1`}>
                {conf.icono}
                {conf.label}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-1">
              {pedido.items.slice(0, 3).map((item) => (
                <p key={item.uid} className="text-sm text-gray-600">
                  {item.cantidad}× {item.nombre}
                </p>
              ))}
              {pedido.items.length > 3 && (
                <p className="text-xs text-gray-400">+{pedido.items.length - 3} más</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t pt-2">
              <div>
                <span className="text-primary font-bold">${pedido.total}</span>
                {pedido.puntosGanados > 0 && (
                  <span className="ml-2 text-xs text-accent font-medium">
                    +{pedido.puntosGanados} pts
                  </span>
                )}
              </div>
              {pedido.estado === 'pendiente' && (
                <button
                  onClick={() => cancelarPedido(pedido.id)}
                  className="text-red-500 text-xs font-semibold flex items-center gap-1"
                >
                  <XCircle size={14} /> Cancelar
                </button>
              )}
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}
