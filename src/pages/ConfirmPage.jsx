import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Clock, Zap, Star, CheckCircle2 } from 'lucide-react'
import useCartStore from '@/stores/useCartStore'
import useOrderStore from '@/stores/useOrderStore'
import useUserStore from '@/stores/useUserStore'
import { calcularPuntosPedido, verificarInsignias } from '@/utils/points'
import PageHeader from '@/components/ui/PageHeader'

export default function ConfirmPage() {
  const navigate   = useNavigate()
  const { state }  = useLocation()
  const slot       = state?.slot
  const [exito, setExito] = useState(null) // { pedidoId, puntosTotal, nuevasInsignias }

  const { items, notaCocina, limpiarCarrito } = useCartStore()
  const subtotal    = useCartStore((s) => s.totalPrecio())
  const crearPedido = useOrderStore((s) => s.crearPedido)
  const userStore   = useUserStore()
  const { nombre, agregarPuntos, registrarPedido, agregarInsignia } = userStore

  const esPrimerPedidoDia =
    !userStore.ultimoPedidoFecha ||
    new Date(userStore.ultimoPedidoFecha).toDateString() !== new Date().toDateString()

  const { puntosBase, bonusMonto, bonusAnticipado, bonusPrimerDia, total: puntosTotal } =
    calcularPuntosPedido(items, slot?.esAnticipado, esPrimerPedidoDia)

  if (!exito && (!slot || items.length === 0)) {
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
    const nuevasInsignias = verificarInsignias(
      { ...userStore, puntos: userStore.puntos + puntosTotal },
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

    setExito({ pedidoId, puntosTotal, nuevasInsignias })
    setTimeout(() => {
      limpiarCarrito()
      navigate('/pedidos', { state: { nuevoPedidoId: pedidoId, nuevasInsignias } })
    }, 2200)
  }

  return (
    <>
    <AnimatePresence>
      {exito && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center
                     bg-primary px-8 text-center"
        >
          {/* Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle2 size={52} className="text-white" strokeWidth={1.8} />
          </motion.div>

          {/* Textos */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <h1 className="text-2xl font-extrabold text-white">¡Pedido realizado!</h1>
            <p className="text-white/80 text-sm">
              Tu orden está siendo enviada a cocina
            </p>
          </motion.div>

          {/* Detalles */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white/15 rounded-2xl px-6 py-4 space-y-2 w-full max-w-xs"
          >
            <div className="flex items-center justify-center gap-2 text-white">
              <Clock size={16} />
              <span className="font-bold text-sm">Recolección a las {slot.label}</span>
            </div>
            {exito.puntosTotal > 0 && (
              <div className="flex items-center justify-center gap-2 text-white">
                <Star size={16} />
                <span className="font-bold text-sm">+{exito.puntosTotal} puntos ganados</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

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

      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4">

        {/* ── Horario ───────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-4 flex items-center gap-4">
          <div className="p-3 bg-primary-light rounded-xl flex-shrink-0">
            <Clock size={22} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Recolección en cafetería
            </p>
            <p className="font-extrabold text-gray-900 dark:text-white text-xl leading-tight">
              {slot.label}
            </p>
          </div>
          {slot.esAnticipado && (
            <span className="flex items-center gap-1 bg-accent-light text-accent
                             text-xs font-extrabold px-2.5 py-1.5 rounded-xl flex-shrink-0">
              <Zap size={12} /> +5 pts
            </span>
          )}
        </div>

        {/* ── Resumen de items ──────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-4 space-y-3">
          <h2 className="font-bold text-gray-900 dark:text-white">Tu orden</h2>
          <div className="space-y-2.5 divide-y divide-gray-50 dark:divide-gray-700">
            {items.map((item) => (
              <div key={item.uid} className="flex items-start justify-between gap-3 pt-2 first:pt-0">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    <span className="text-primary font-extrabold">{item.cantidad}×</span>{' '}
                    {item.nombre}
                  </p>
                  {item.personalizaciones?.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                      {item.personalizaciones.map((p) => p.label).join(' · ')}
                    </p>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 flex-shrink-0 tabular-nums">
                  ${(item.precio + item.precioPersonalizaciones) * item.cantidad}
                </p>
              </div>
            ))}
          </div>
          {notaCocina && (
            <div className="border-t border-gray-100 dark:border-gray-700 pt-2.5">
              <p className="text-xs text-gray-400 italic">📝 {notaCocina}</p>
            </div>
          )}
        </div>

        {/* ── Totales ───────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-4 space-y-3">
          <h2 className="font-bold text-gray-900 dark:text-white">Resumen</h2>

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Subtotal ({items.reduce((a, i) => a + i.cantidad, 0)} artículos)</span>
            <span className="font-semibold tabular-nums">${subtotal}</span>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between">
            <span className="font-extrabold text-gray-900 dark:text-white text-base">
              Total a pagar
            </span>
            <span className="font-extrabold text-primary text-xl tabular-nums">${subtotal}</span>
          </div>

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
              {bonusMonto > 0 && (
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 size={11} />
                  +{bonusMonto} pts por tu consumo (1 pt c/$10)
                </p>
              )}
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

        {/* ── Botón confirmar ───────────────────────── */}
        <div className="space-y-2">
          <button
            onClick={handleConfirmar}
            className="w-full flex items-center justify-center gap-2 bg-accent text-white
                       font-extrabold text-base py-4 rounded-xl active:scale-[0.98] transition-transform"
          >
            <ChefHat size={22} />
            CONFIRMAR Y ENVIAR A COCINA
          </button>
          <p className="text-center text-xs text-gray-400">
            No podrás modificar tu pedido después de enviarlo
          </p>
        </div>
      </div>
    </motion.div>
    </>
  )
}
