import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, CheckCircle, Zap, Star, Clock } from 'lucide-react'
import useCartStore from '@/stores/useCartStore'
import useOrderStore from '@/stores/useOrderStore'
import useUserStore from '@/stores/useUserStore'
import { calcularPuntosPedido, verificarInsignias } from '@/utils/points'

export default function Confirmar() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const slot = state?.slot

  const { items, notaCocina, limpiarCarrito, totalPrecio } = useCartStore()
  const total = useCartStore((s) => s.totalPrecio())
  const crearPedido = useOrderStore((s) => s.crearPedido)
  const userStore = useUserStore()
  const { nombre, agregarPuntos, registrarPedido, agregarInsignia } = userStore

  const esPrimerPedidoDia = !userStore.ultimoPedidoFecha ||
    new Date(userStore.ultimoPedidoFecha).toDateString() !== new Date().toDateString()

  const { puntosBase, bonusAnticipado, bonusPrimerDia, total: puntosTotal } =
    calcularPuntosPedido(items, slot?.esAnticipado, esPrimerPedidoDia)

  const handleConfirmar = () => {
    const nuevasInsignias = verificarInsignias(
      { ...userStore, puntos: userStore.puntos + puntosTotal },
      { slot: slot?.hora, esAnticipado: slot?.esAnticipado }
    )

    const pedidoId = crearPedido({
      items,
      notaCocina,
      slot: slot?.hora,
      puntosGanados: puntosTotal,
      total,
      nombreUsuario: nombre
    })

    agregarPuntos(puntosTotal)
    registrarPedido({ esAnticipado: slot?.esAnticipado })
    nuevasInsignias.forEach((ins) => agregarInsignia(ins))
    limpiarCarrito()

    navigate('/pedidos', { state: { nuevoPedidoId: pedidoId, nuevasInsignias } })
  }

  if (!slot || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
        <p className="text-gray-500">No hay datos para confirmar</p>
        <button onClick={() => navigate('/carrito')} className="btn-primary">Ir al carrito</button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Confirmar pedido</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-4">
        {/* Resumen del slot */}
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-primary-light rounded-xl">
            <Clock size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400">Horario de recolección</p>
            <p className="font-bold text-gray-900 text-lg">{slot.label}</p>
            {slot.esAnticipado && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                <Zap size={12} /> Pedido anticipado
              </span>
            )}
          </div>
        </div>

        {/* Artículos */}
        <div className="card space-y-3">
          <h2 className="font-bold text-gray-900">Tu orden</h2>
          {items.map((item) => (
            <div key={item.uid} className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {item.cantidad}× {item.nombre}
                </p>
                {item.personalizaciones?.length > 0 && (
                  <p className="text-xs text-gray-400">
                    {item.personalizaciones.map((p) => p.label).join(' · ')}
                  </p>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                ${(item.precio + item.precioPersonalizaciones) * item.cantidad}
              </p>
            </div>
          ))}
          {notaCocina && (
            <p className="text-xs text-gray-400 border-t pt-2 italic">
              Nota: {notaCocina}
            </p>
          )}
          <div className="border-t pt-2 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-primary text-lg">${total}</span>
          </div>
        </div>

        {/* Desglose de puntos */}
        <div className="card space-y-2">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Star size={18} className="text-accent" /> Puntos a ganar
          </h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Base (${total} × 0.1)</span>
              <span className="font-semibold">+{puntosBase} pts</span>
            </div>
            {bonusAnticipado > 0 && (
              <div className="flex justify-between text-accent">
                <span className="flex items-center gap-1"><Zap size={12} /> Bonus anticipado</span>
                <span className="font-semibold">+{bonusAnticipado} pts</span>
              </div>
            )}
            {bonusPrimerDia > 0 && (
              <div className="flex justify-between text-primary">
                <span>Primer pedido del día</span>
                <span className="font-semibold">+{bonusPrimerDia} pts</span>
              </div>
            )}
            <div className="border-t pt-1.5 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">+{puntosTotal} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer fijo */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                      bg-white border-t border-gray-100 px-4 py-4 pb-safe shadow-bottom">
        <button onClick={handleConfirmar} className="btn-primary w-full flex items-center justify-center gap-2">
          <CheckCircle size={20} /> Confirmar pedido
        </button>
      </div>
    </motion.div>
  )
}
