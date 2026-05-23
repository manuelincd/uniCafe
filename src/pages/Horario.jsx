import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Clock, Zap } from 'lucide-react'
import useOrderStore from '@/stores/useOrderStore'
import { generarSlots, colorPorEstado, etiquetaEstado } from '@/utils/schedule'

export default function Horario() {
  const navigate = useNavigate()
  const { slots: reservas } = useOrderStore()
  const [slotSeleccionado, setSlotSeleccionado] = useState(null)

  const slots = generarSlots(reservas)
  const disponibles = slots.filter((s) => s.estado !== 'pasado' && s.estado !== 'lleno')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Horario de recolección</h1>
          <p className="text-gray-400 text-xs mt-0.5">Elige cuándo pasas a recoger tu pedido</p>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex gap-3 px-4 py-2 overflow-x-auto scrollbar-hide">
        {[
          { estado: 'disponible', label: 'Disponible' },
          { estado: 'casi-lleno', label: 'Casi lleno' },
          { estado: 'lleno',      label: 'Sin lugares' },
        ].map(({ estado, label }) => {
          const c = colorPorEstado(estado)
          return (
            <span key={estado} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
              <span className={`w-2 h-2 rounded-full ${c.bg.replace('100', '500')}`} />
              {label}
            </span>
          )
        })}
      </div>

      {/* Slots */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 mt-3">
        <div className="grid grid-cols-2 gap-3">
          {slots.map((slot) => {
            const c = colorPorEstado(slot.estado)
            const bloqueado = slot.estado === 'pasado' || slot.estado === 'lleno'
            const activo = slotSeleccionado?.hora === slot.hora

            return (
              <button
                key={slot.hora}
                onClick={() => !bloqueado && setSlotSeleccionado(slot)}
                disabled={bloqueado}
                className={`rounded-xl border-2 p-4 text-left transition-all
                            ${bloqueado ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}
                            ${activo
                              ? 'border-primary bg-primary-light'
                              : `${c.border} ${c.bg}`
                            }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-lg font-bold ${activo ? 'text-primary' : c.text}`}>
                      {slot.label}
                    </p>
                    <p className={`text-xs font-medium mt-0.5 ${activo ? 'text-primary' : c.text}`}>
                      {etiquetaEstado(slot.estado)}
                    </p>
                  </div>
                  {slot.esAnticipado && !bloqueado && (
                    <Zap size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  )}
                </div>
                {!bloqueado && (
                  <p className="text-xs text-gray-400 mt-1">
                    {slot.disponibles} lugar{slot.disponibles !== 1 ? 'es' : ''}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer fijo */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                      bg-white border-t border-gray-100 px-4 py-4 pb-safe shadow-bottom">
        {slotSeleccionado?.esAnticipado && (
          <div className="flex items-center gap-2 bg-accent-light rounded-lg px-3 py-2 mb-3">
            <Zap size={14} className="text-accent" />
            <p className="text-accent text-sm font-medium">+5 puntos por pedido anticipado</p>
          </div>
        )}
        <button
          disabled={!slotSeleccionado}
          onClick={() => navigate('/confirmar', { state: { slot: slotSeleccionado } })}
          className="btn-primary w-full disabled:opacity-40"
        >
          {slotSeleccionado
            ? `Confirmar las ${slotSeleccionado.label}`
            : 'Elige un horario'}
        </button>
      </div>
    </motion.div>
  )
}
