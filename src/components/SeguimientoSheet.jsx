import { motion, useDragControls } from 'framer-motion'
import { X, CheckCircle2, ChefHat, Package, XCircle, AlertTriangle } from 'lucide-react'
import useOrderStore from '@/stores/useOrderStore'
import { nivelCargaSlot } from '@/utils/schedule'

// ── Pasos del proceso ──────────────────────────────────────────
const PASOS = [
  { label: 'Pedido confirmado',   Icono: CheckCircle2, desc: 'Tu orden fue recibida en cocina'    },
  { label: 'En preparación',       Icono: ChefHat,      desc: 'Estamos preparando tu pedido'       },
  { label: 'Listo para recoger',   Icono: Package,      desc: 'Pasa por tu pedido a la ventanilla' },
  { label: 'Entregado',            Icono: CheckCircle2, desc: '¡Que lo disfrutes!'                 },
]

function pasoActivo(estado) {
  if (estado === 'pendiente') return 1
  if (estado === 'listo')     return 2
  if (estado === 'entregado') return 3
  return 0
}

// ── Fila individual del stepper ────────────────────────────────
function StepRow({ index, activo, label, Icono, desc, esUltimo }) {
  const hecho  = index < activo
  const actual = index === activo

  return (
    <div className="flex gap-3">
      {/* Icono + línea vertical */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                         transition-colors
                         ${actual
                           ? 'bg-primary text-white shadow-md ring-4 ring-primary/20'
                           : hecho
                             ? 'bg-primary/15 text-primary'
                             : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600'
                         }`}>
          <Icono size={16} strokeWidth={2.5} />
        </div>
        {!esUltimo && (
          <div className={`w-0.5 flex-1 my-1.5 rounded-full min-h-[16px]
                           ${hecho ? 'bg-primary/30' : 'bg-gray-100 dark:bg-gray-800'}`} />
        )}
      </div>

      {/* Texto */}
      <div className={`flex-1 ${esUltimo ? 'pb-0' : 'pb-4'}`}>
        <p className={`text-sm font-bold leading-tight
                       ${actual  ? 'text-primary'
                       : hecho   ? 'text-gray-600 dark:text-gray-300'
                       :           'text-gray-300 dark:text-gray-600'}`}>
          {label}
        </p>
        {(actual || hecho) && (
          <p className="text-xs mt-0.5 text-gray-400">{desc}</p>
        )}
      </div>
    </div>
  )
}

// ── Stepper para pedido cancelado ──────────────────────────────
function StepperCancelado() {
  return (
    <div className="space-y-0">
      {/* Confirmado */}
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center
                          bg-primary/15 text-primary flex-shrink-0">
            <CheckCircle2 size={16} strokeWidth={2.5} />
          </div>
          <div className="w-0.5 flex-1 my-1.5 rounded-full min-h-[16px] bg-red-200 dark:bg-red-900/40" />
        </div>
        <div className="pb-4 flex-1">
          <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Pedido confirmado</p>
          <p className="text-xs mt-0.5 text-gray-400">Tu orden fue recibida</p>
        </div>
      </div>
      {/* Cancelado */}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center
                        bg-red-100 dark:bg-red-900/30 text-red-500 flex-shrink-0">
          <XCircle size={16} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-red-500">Pedido cancelado</p>
          <p className="text-xs mt-0.5 text-gray-400">El pedido fue cancelado</p>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────
export default function SeguimientoSheet({ pedido, onClose }) {
  const reservados    = useOrderStore((s) => s.getReservadosEnSlot(pedido.slot))
  const carga         = nivelCargaSlot(reservados)
  const cancelado     = pedido.estado === 'cancelado'
  const activo        = pasoActivo(pedido.estado)
  const dragControls  = useDragControls()

  const fecha   = new Date(pedido.fechaCreacion)
  const esHoy   = fecha.toDateString() === new Date().toDateString()
  const fechaStr = esHoy
    ? `Hoy · ${fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
    : fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Sheet */}
      <motion.div
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0 }}
        dragElastic={{ top: 0, bottom: 0.4 }}
        onDragEnd={(_, { offset, velocity }) => {
          if (offset.y > 80 || velocity.y > 500) onClose()
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 32 }}
        className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-md
                   bg-white dark:bg-gray-900 rounded-t-3xl z-50
                   max-h-[88vh] flex flex-col"
      >
        {/* Handle — área de arrastre */}
        <div
          className="flex justify-center pt-3 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-1 pb-3 flex-shrink-0">
          <div>
            <p className="font-extrabold text-gray-900 dark:text-white">Seguimiento</p>
            <p className="text-gray-400 text-xs mt-0.5">
              {pedido.id} · {fechaStr} · Recolección {pedido.slot}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl
                       active:bg-gray-100 dark:active:bg-gray-800 transition-colors -mt-0.5"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto px-5 pb-10 space-y-4 flex-1">

          {/* Stepper */}
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
            {cancelado ? (
              <StepperCancelado />
            ) : (
              PASOS.map((paso, i) => (
                <StepRow
                  key={paso.label}
                  index={i}
                  activo={activo}
                  label={paso.label}
                  Icono={paso.Icono}
                  desc={paso.desc}
                  esUltimo={i === PASOS.length - 1}
                />
              ))
            )}
          </div>

          {/* Aviso de carga alta */}
          {pedido.estado === 'pendiente' && carga !== 'normal' && (
            <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/20
                            border border-yellow-200 dark:border-yellow-700 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-700 dark:text-yellow-400 text-xs font-semibold leading-relaxed">
                {carga === 'muy-alta'
                  ? 'Este horario está muy cargado. Tu pedido podría tardar un poco más de lo normal.'
                  : 'Este horario tiene bastante demanda. Puede haber un pequeño retraso.'}
              </p>
            </div>
          )}

          {/* Resumen de items */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl
                          border border-gray-100 dark:border-gray-700 p-4 space-y-3">
            <p className="font-bold text-gray-800 dark:text-white text-sm">Tu orden</p>

            <div className="space-y-2.5">
              {pedido.items.map((item) => (
                <div key={item.uid} className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-primary">{item.cantidad}×</span>{' '}
                      {item.nombre}
                    </p>
                    {item.personalizaciones?.length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.personalizaciones.map((p) => p.label).join(' · ')}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300
                                tabular-nums flex-shrink-0">
                    ${(item.precio + (item.precioPersonalizaciones ?? 0)) * item.cantidad}
                  </p>
                </div>
              ))}
            </div>

            {pedido.notaCocina && (
              <p className="text-xs text-gray-400 italic border-t border-gray-100
                            dark:border-gray-700 pt-2.5">
                📝 {pedido.notaCocina}
              </p>
            )}

            <div className="border-t border-gray-100 dark:border-gray-700 pt-2.5
                            flex items-center justify-between">
              <span className="font-extrabold text-gray-900 dark:text-white">Total</span>
              <div className="text-right">
                <p className="font-extrabold text-primary tabular-nums">${pedido.total}</p>
                {pedido.puntosGanados > 0 && (
                  cancelado ? (
                    <p className="text-xs text-gray-400 font-semibold line-through">
                      +{pedido.puntosGanados} pts descontados
                    </p>
                  ) : (
                    <p className="text-xs text-accent font-semibold">
                      +{pedido.puntosGanados} pts ganados
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
