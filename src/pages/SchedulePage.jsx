import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Zap } from 'lucide-react'
import useOrderStore from '@/stores/useOrderStore'
import { generarSlots, colorPorEstado, etiquetaEstado } from '@/utils/schedule'
import PageHeader from '@/components/ui/PageHeader'

// ── Sub-componente de slot (fuera del padre para evitar re-mounts) ──
function SlotCard({ slot, seleccionado, onSelect }) {
  const bloqueado = slot.estado === 'pasado' || slot.estado === 'lleno'
  const activo    = seleccionado?.hora === slot.hora
  const c         = colorPorEstado(slot.estado)

  return (
    <button
      onClick={() => !bloqueado && onSelect(slot)}
      disabled={bloqueado}
      className={`relative rounded-xl border-2 p-2.5 text-center transition-all select-none
                  ${bloqueado ? 'opacity-35 cursor-not-allowed' : 'active:scale-95'}
                  ${activo
                    ? 'border-primary bg-primary text-white shadow-md'
                    : `${c.border} ${c.bg}`
                  }`}
    >
      <p className={`text-sm font-extrabold leading-tight ${activo ? 'text-white' : c.text}`}>
        {slot.label}
      </p>
      <p className={`text-[10px] font-medium mt-0.5 ${activo ? 'text-white/80' : c.text}`}>
        {etiquetaEstado(slot.estado)}
      </p>
      {slot.esAnticipado && !bloqueado && (
        <span
          className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px]
                     font-extrabold px-1 py-0.5 rounded-full leading-none"
        >
          +5
        </span>
      )}
    </button>
  )
}

export default function SchedulePage() {
  const navigate = useNavigate()
  const { slots: reservas } = useOrderStore()
  const [slotSeleccionado, setSlotSeleccionado] = useState(null)

  const todos = generarSlots(reservas)

  // Mañana: 7:30–14:45 · Tarde: 15:00–18:00
  const manana = todos.filter((s) => parseInt(s.hora.split(':')[0], 10) < 15)
  const tarde  = todos.filter((s) => parseInt(s.hora.split(':')[0], 10) >= 15)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      <PageHeader
        title="¿Cuándo recoges tu pedido?"
        subtitle="Elige el horario que mejor te convenga"
        onBack={() => navigate(-1)}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-44 space-y-5">

        {/* Banner anticipación */}
        <div className="flex items-center gap-3 bg-accent-light rounded-xl px-4 py-3">
          <Zap size={18} className="text-accent flex-shrink-0" />
          <p className="text-accent text-sm font-bold">
            +5 pts si pides con 30 min de anticipación
          </p>
        </div>

        {/* Leyenda de colores */}
        <div className="flex gap-2 flex-wrap">
          {[
            { estado: 'disponible', label: 'Disponible' },
            { estado: 'casi-lleno', label: 'Casi lleno' },
            { estado: 'lleno',      label: 'Lleno'      },
          ].map(({ estado, label }) => {
            const c = colorPorEstado(estado)
            return (
              <span
                key={estado}
                className={`flex items-center gap-1.5 text-xs font-semibold
                             px-3 py-1.5 rounded-full ${c.bg} ${c.text}`}
              >
                <span className={`w-2 h-2 rounded-full border ${c.border}`} />
                {label}
              </span>
            )
          })}
        </div>

        {/* Sección Mañana */}
        <section>
          <h2 className="font-bold text-gray-800 mb-3">🌤️ Mañana</h2>
          <div className="grid grid-cols-4 gap-2">
            {manana.map((slot) => (
              <SlotCard
                key={slot.hora}
                slot={slot}
                seleccionado={slotSeleccionado}
                onSelect={setSlotSeleccionado}
              />
            ))}
          </div>
        </section>

        {/* Sección Tarde */}
        {tarde.length > 0 && (
          <section>
            <h2 className="font-bold text-gray-800 mb-3">🌇 Tarde</h2>
            <div className="grid grid-cols-4 gap-2">
              {tarde.map((slot) => (
                <SlotCard
                  key={slot.hora}
                  slot={slot}
                  seleccionado={slotSeleccionado}
                  onSelect={setSlotSeleccionado}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer con panel de confirmación */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                   bg-white border-t border-gray-100 px-4 pt-3 pb-safe shadow-bottom space-y-3"
      >
        {/* Panel de slot seleccionado */}
        {slotSeleccionado && (
          <div className="flex items-center gap-3 bg-primary-light rounded-xl px-4 py-3">
            <Clock size={18} className="text-primary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-primary text-xs font-semibold">Horario seleccionado</p>
              <p className="text-primary-dark font-extrabold text-base">
                {slotSeleccionado.label}
              </p>
            </div>
            {slotSeleccionado.esAnticipado && (
              <span className="bg-accent text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                +5 pts
              </span>
            )}
          </div>
        )}

        <button
          disabled={!slotSeleccionado}
          onClick={() =>
            navigate('/confirmar', { state: { slot: slotSeleccionado } })
          }
          className="btn-primary w-full disabled:opacity-40"
        >
          {slotSeleccionado
            ? `Confirmar las ${slotSeleccionado.label}`
            : 'Elige un horario para continuar'}
        </button>
      </div>
    </motion.div>
  )
}
