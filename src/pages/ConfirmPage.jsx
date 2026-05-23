import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChefHat, Clock, Zap, Star, CheckCircle2 } from 'lucide-react'
import useCartStore from '@/stores/useCartStore'
import useOrderStore from '@/stores/useOrderStore'
import useUserStore from '@/stores/useUserStore'
import { calcularPuntosPedido, verificarInsignias } from '@/utils/points'
import PageHeader from '@/components/ui/PageHeader'

export default function ConfirmPage() {
  const navigate    = useNavigate()
  const { state }   = useLocation()
  const slot        = state?.slot

  const { items, notaCocina, limpiarCarrito } = useCartStore()
  const subtotal    = useCartStore((s) => s.totalPrecio())
  const crearPedido = useOrderStore((s) => s.crearPedido)
  const userStore   = useUserStore()
  const { nombre, agregarPuntos, registrarPedido, agregarInsignia } = userStore

  const esPrimerPedidoDia =
    !userStore.ultimoPedidoFecha ||
    new Date(userStore.ultimoPedidoFecha).toDateString() !== new Date().toDateString()

  const { puntosBase, bonusAnticipado, bonusPrimerDia, total: puntosTotal } =
    calcularPuntosPedido(items, slot?.esAnticipado, esPrimerPedidoDia)

  if (!slot || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
        <p className="text-gray-500">No hay datos para confirmar</p>
        <button onClick={() => navigate('/carrito')} className="btn-primary">
          Ir al carrito
        </button>
      </div>
    )
  }

  const handleConfirmar = () => {
    // Calcular insignias con los puntos ya sumados
    const nuevasInsignias = verificarInsignias(
      {
        ...userStore,
        puntos: userStore.puntos + puntosTotal,
      },
      { slot: slot.hora, esAnticipado: slot.esAnticipado }
    )

    const pedidoId = crearPedido({
      items,
      notaCocina,
      slot:          slot.hora,
      puntosGanados: puntosTotal,
      total:         subtotal,
      nombreUsuario: nombre,
    })

    agregarPuntos(puntosTotal)
    registrarPedido({ esAnticipado: slot.esAnticipado })
    nuevasInsignias.forEach((ins) => agregarInsignia(ins))
    limpiarCarrito()

    navigate('/pedidos', {
      state: { nuevoPedidoId: pedidoId, nuevasInsignias },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      <PageHeader
        title="Confirmación de pedido"
        subtitle="Revisa los detalles antes de enviar a cocina"
        onBack={() => navigate(-1)}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-44 space-y-4">

        {/* ── Horario de recolección ─────────────────── */}
        <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4">
          <div className="p-3 bg-primary-light rounded-xl flex-shrink-0">
            <Clock size={22} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Recolección en cafetería
            </p>
            <p className="font-extrabold text-gray-900 text-xl leading-tight">{slot.label}</p>
          </div>
          {slot.esAnticipado && (
            <span className="flex items-center gap-1 bg-accent-light text-accent
                             text-xs font-extrabold px-2.5 py-1.5 rounded-xl flex-shrink-0">
              <Zap size={12} /> +5 pts
            </span>
          )}
        </div>

        {/* ── Resumen de items ──────────────────────── */}
        <div className="bg-white rounded-2xl shadow-card p-4 space-y-3">
          <h2 className="font-bold text-gray-900">Tu orden</h2>
          <div className="space-y-2.5 divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item.uid} className="flex items-start justify-between gap-3 pt-2 first:pt-0">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    <span className="text-primary font-extrabold">{item.cantidad}×</span>{' '}
                    {item.nombre}
                  </p>
                  {item.personalizaciones?.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                      {item.personalizaciones.map((p) => p.label).join(' · ')}
                    </p>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-800 flex-shrink-0 tabular-nums">
                  ${(item.precio + item.precioPersonalizaciones) * item.cantidad}
                </p>
              </div>
            ))}
          </div>
          {notaCocina && (
            <div className="border-t border-gray-100 pt-2.5">
              <p className="text-xs text-gray-400 italic">📝 {notaCocina}</p>
            </div>
          )}
        </div>

        {/* ── Desglose de totales ───────────────────── */}
        <div className="bg-white rounded-2xl shadow-card p-4 space-y-3">
          <h2 className="font-bold text-gray-900">Resumen</h2>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal ({items.reduce((a, i) => a + i.cantidad, 0)} artículos)</span>
            <span className="font-semibold tabular-nums">${subtotal}</span>
          </div>

          <div className="border-t border-gray-100 pt-2 flex justify-between">
            <span className="font-extrabold text-gray-900 text-base">Total a pagar</span>
            <span className="font-extrabold text-primary text-xl tabular-nums">${subtotal}</span>
          </div>

          {/* Chip de puntos a ganar */}
          <div className="bg-accent-light rounded-xl px-4 py-3 space-y-1.5">
            <p className="text-accent font-extrabold text-sm flex items-center gap-1.5">
              <Star size={15} />
              Ganarás {puntosTotal} pts con este pedido
            </p>
            <div className="space-y-0.5 text-xs text-accent/80 pl-1">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 size={11} />
                {puntosBase} pts por completar el pedido
              </p>
              {bonusAnticipado > 0 && (
                <p className="flex items-center gap-1.5">
                  <Zap size={11} />
                  +{bonusAnticipado} pts por pedido anticipado
                </p>
              )}
              {bonusPrimerDia > 0 && (
                <p className="flex items-center gap-1.5">
                  <span className="text-[11px]">🌅</span>
                  +{bonusPrimerDia} pts por primer pedido del día
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer sticky ─────────────────────────── */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                   bg-white border-t border-gray-100 px-4 pt-3 pb-safe shadow-bottom space-y-2"
      >
        <button
          onClick={handleConfirmar}
          className="w-full flex items-center justify-center gap-2 bg-accent text-white
                     font-extrabold text-base py-4 rounded-xl active:scale-[0.98] transition-transform"
        >
          <ChefHat size={22} />
          CONFIRMAR Y ENVIAR A COCINA
        </button>
        <p className="text-center text-xs text-gray-400 pb-1">
          No podrás modificar tu pedido después de enviarlo
        </p>
      </div>
    </motion.div>
  )
}
