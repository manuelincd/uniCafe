import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardList, XCircle, CheckCircle, Clock, Package, RotateCcw } from 'lucide-react'
import useOrderStore from '@/stores/useOrderStore'
import useCartStore from '@/stores/useCartStore'
import { getProducto } from '@/data/menu'
import PageHeader from '@/components/ui/PageHeader'

const ESTADO = {
  pendiente: { label: 'En preparación', Icono: Clock,        color: 'bg-yellow-100 text-yellow-700' },
  listo:     { label: '¡Listo!',        Icono: CheckCircle,  color: 'bg-green-100 text-green-700'   },
  entregado: { label: 'Entregado',      Icono: Package,      color: 'bg-blue-100 text-blue-700'     },
  cancelado: { label: 'Cancelado',      Icono: XCircle,      color: 'bg-red-100 text-red-700'       },
}

function PedidoCard({ pedido, esActivo, onCancelar, onRepetir }) {
  const [confirmando, setConfirmando] = useState(false)
  const conf  = ESTADO[pedido.estado] ?? ESTADO.pendiente
  const Icono = conf.Icono
  const fecha = new Date(pedido.fechaCreacion)
  const esHoy = fecha.toDateString() === new Date().toDateString()

  const fechaStr = esHoy
    ? `Hoy · ${fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
    : fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="bg-white rounded-2xl shadow-card p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-gray-900 text-sm">{pedido.id}</p>
          <p className="text-gray-400 text-xs mt-0.5">
            {fechaStr} · Recolección {pedido.slot}
          </p>
        </div>
        <span className={`badge flex items-center gap-1 flex-shrink-0 ${conf.color}`}>
          <Icono size={12} />
          {conf.label}
        </span>
      </div>

      {/* Items resumidos */}
      <div className="space-y-0.5">
        {pedido.items.slice(0, 3).map((item) => (
          <p key={item.uid} className="text-sm text-gray-700">
            <span className="font-semibold">{item.cantidad}×</span> {item.nombre}
            {item.personalizaciones?.length > 0 && (
              <span className="text-gray-400 text-xs">
                {' '}({item.personalizaciones.map((p) => p.label).join(', ')})
              </span>
            )}
          </p>
        ))}
        {pedido.items.length > 3 && (
          <p className="text-xs text-gray-400">+{pedido.items.length - 3} artículo(s) más</p>
        )}
      </div>

      {/* Footer: precio + acciones */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
        <div className="flex items-baseline gap-2">
          <span className="font-extrabold text-primary tabular-nums">${pedido.total}</span>
          {pedido.puntosGanados > 0 && (
            <span className="text-xs text-accent font-semibold">+{pedido.puntosGanados} pts</span>
          )}
        </div>

        {esActivo ? (
          confirmando ? (
            <div className="flex items-center gap-2">
              <p className="text-xs text-red-500 font-semibold">¿Seguro?</p>
              <button
                onClick={() => { onCancelar(pedido.id); setConfirmando(false) }}
                className="text-xs text-white bg-red-500 px-3 py-1 rounded-lg font-bold"
              >
                Sí, cancelar
              </button>
              <button
                onClick={() => setConfirmando(false)}
                className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg font-bold"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmando(true)}
              className="flex items-center gap-1 text-xs text-red-400 font-semibold"
            >
              <XCircle size={14} /> Cancelar pedido
            </button>
          )
        ) : (
          <button
            onClick={() => onRepetir(pedido)}
            className="flex items-center gap-1.5 text-xs text-primary font-bold
                       bg-primary-light px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
          >
            <RotateCcw size={13} /> Repetir compra
          </button>
        )}
      </div>
    </motion.div>
  )
}

function EmptyState({ icono, titulo, texto }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
        {icono}
      </div>
      <h3 className="font-bold text-gray-700 text-lg">{titulo}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{texto}</p>
      <button onClick={() => navigate('/menu/buenos-dias')} className="btn-primary mt-2">
        Ver el menú
      </button>
    </div>
  )
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { pedidos, cancelarPedido } = useOrderStore()
  const { agregarItem, limpiarCarrito } = useCartStore()
  const [tabActivo, setTabActivo] = useState('activos')

  const activos   = pedidos.filter((p) => p.estado === 'pendiente' || p.estado === 'listo')
  const historial = pedidos.filter((p) => p.estado === 'entregado' || p.estado === 'cancelado')

  const ordenar = (arr) =>
    [...arr].sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))

  const handleRepetir = (pedido) => {
    limpiarCarrito()
    pedido.items.forEach((item) => {
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
      className="min-h-screen flex flex-col"
    >
      <PageHeader title="Mis Pedidos" />

      {/* ── Tabs ──────────────────────────────────── */}
      <div className="flex gap-1 mx-4 mb-3 bg-gray-100 rounded-xl p-1">
        {[
          { key: 'activos',   label: 'Activos',   count: activos.length   },
          { key: 'historial', label: 'Historial', count: historial.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTabActivo(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                        text-sm font-semibold transition-all ${
                          tabActivo === key
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500'
                        }`}
          >
            {label}
            {count > 0 && (
              <span
                className={`text-[11px] font-extrabold min-w-[18px] h-[18px] px-1
                             rounded-full flex items-center justify-center ${
                               tabActivo === key
                                 ? 'bg-primary text-white'
                                 : 'bg-gray-200 text-gray-500'
                             }`}
              >
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Contenido ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">

        {/* Banner de nuevas insignias (viene de ConfirmPage) */}
        <AnimatePresence>
          {state?.nuevasInsignias?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-accent-light border border-accent/30 rounded-2xl p-4 space-y-2"
            >
              <p className="font-extrabold text-accent text-sm">
                🎉 ¡Nuevas insignias desbloqueadas!
              </p>
              {state.nuevasInsignias.map((ins) => (
                <div key={ins.id} className="flex items-center gap-2.5">
                  <span className="text-xl select-none">{ins.icono}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{ins.nombre}</p>
                    <p className="text-gray-500 text-xs">{ins.descripcion}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {tabActivo === 'activos' ? (
          activos.length > 0 ? (
            <AnimatePresence>
              {ordenar(activos).map((p) => (
                <PedidoCard
                  key={p.id}
                  pedido={p}
                  esActivo
                  onCancelar={cancelarPedido}
                  onRepetir={handleRepetir}
                />
              ))}
            </AnimatePresence>
          ) : (
            <EmptyState
              icono={<Clock size={40} className="text-primary/30" />}
              titulo="Sin pedidos activos"
              texto="Cuando hagas un pedido aparecerá aquí mientras está en preparación"
            />
          )
        ) : historial.length > 0 ? (
          <AnimatePresence>
            {ordenar(historial).map((p) => (
              <PedidoCard
                key={p.id}
                pedido={p}
                esActivo={false}
                onCancelar={cancelarPedido}
                onRepetir={handleRepetir}
              />
            ))}
          </AnimatePresence>
        ) : (
          <EmptyState
            icono={<ClipboardList size={40} className="text-gray-300" />}
            titulo="Sin historial aún"
            texto="Aquí aparecerán tus pedidos completados y cancelados"
          />
        )}
      </div>
    </motion.div>
  )
}
