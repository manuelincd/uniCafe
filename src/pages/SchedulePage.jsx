import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import useOrderStore from '@/stores/useOrderStore'
import { generarSlots } from '@/utils/schedule'
import PageHeader from '@/components/ui/PageHeader'

const DIAS_ANTICIPACION = 2

function getDias() {
  return Array.from({ length: DIAS_ANTICIPACION + 1 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    d.setHours(0, 0, 0, 0)
    return d
  })
}

function esFinDeSemana(date) {
  const dia = date.getDay()
  return dia === 0 || dia === 6
}

function proximoDiaHabil(desde) {
  const d = new Date(desde)
  do { d.setDate(d.getDate() + 1) } while (esFinDeSemana(d))
  return d
}

function etiquetaDia(i) {
  if (i === 0) return 'Hoy'
  if (i === 1) return 'Mañana'
  return 'Pasado mañana'
}

function fechaLarga(date) {
  const f = date.toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
  return f.charAt(0).toUpperCase() + f.slice(1)
}

function nombreDia(date) {
  const f = date.toLocaleDateString('es-MX', { weekday: 'long' })
  return f.charAt(0).toUpperCase() + f.slice(1)
}

function SlotCard({ slot, seleccionado, onSelect }) {
  const pasado = slot.estado === 'pasado'
  const activo = seleccionado?.hora === slot.hora

  return (
    <button
      onClick={() => !pasado && onSelect(slot)}
      disabled={pasado}
      className={`relative rounded-xl border-2 p-2.5 text-center transition-all select-none
                  ${pasado
                    ? 'opacity-35 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'active:scale-95'
                  }
                  ${activo
                    ? 'border-primary bg-primary shadow-md'
                    : !pasado
                      ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                      : ''
                  }`}
    >
      <p className={`text-sm font-extrabold leading-tight
                     ${activo ? 'text-white' : pasado ? 'text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
        {slot.label}
      </p>
      {slot.esAnticipado && (
        <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px]
                         font-extrabold px-1 py-0.5 rounded-full leading-none">
          +5
        </span>
      )}
    </button>
  )
}

function DiaSinClases({ diaActual, onIrALunes }) {
  const siguiente = proximoDiaHabil(diaActual)
  const esSabado  = diaActual.getDay() === 6

  return (
    <motion.div
      key="dia-sin-clases"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center gap-5"
    >
      <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center">
        <span className="text-5xl select-none">{esSabado ? '☕' : '😴'}</span>
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">
          {esSabado ? '¡Fin de semana!' : 'Día de descanso'}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          La cafetería no opera los fines de semana.{'\n'}
          Nos vemos el <span className="font-semibold text-primary">{nombreDia(siguiente)}</span>.
        </p>
      </div>

      {onIrALunes && (
        <button
          onClick={onIrALunes}
          className="btn-primary"
        >
          Ver horarios del {nombreDia(siguiente)}
        </button>
      )}
    </motion.div>
  )
}

export default function SchedulePage() {
  const navigate = useNavigate()
  const { slots: reservas } = useOrderStore()

  const dias = getDias()
  const [diaIdx,           setDiaIdx]           = useState(0)
  const [slotSeleccionado, setSlotSeleccionado] = useState(null)

  const diaActual   = dias[diaIdx]
  const esFinde     = esFinDeSemana(diaActual)

  // Índice del primer día hábil disponible en la lista
  const idxHabil = dias.findIndex((d) => !esFinDeSemana(d))

  function cambiarDia(idx) {
    setDiaIdx(idx)
    setSlotSeleccionado(null)
  }

  const todos  = esFinde ? [] : generarSlots(reservas, diaActual)
  const manana = todos.filter((s) => parseInt(s.hora.split(':')[0], 10) < 15)
  const tarde  = todos.filter((s) => parseInt(s.hora.split(':')[0], 10) >= 15)

  // Hay algún día hábil en la lista al que saltar
  const siguienteHabilIdx = dias.findIndex((d, i) => i > diaIdx && !esFinDeSemana(d))

  return (
    <>
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

      <div className={`flex-1 overflow-y-auto px-4 space-y-5 transition-all ${slotSeleccionado ? 'pb-52' : 'pb-24'}`}>

        {/* ── Selector de día ─────────────────────── */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => cambiarDia(diaIdx - 1)}
            disabled={diaIdx === 0}
            className="w-9 h-9 flex items-center justify-center rounded-xl
                       border border-gray-200 dark:border-gray-700
                       disabled:opacity-30 active:bg-gray-100 dark:active:bg-gray-700
                       transition-colors flex-shrink-0"
          >
            <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
          </button>

          <div className="flex-1 rounded-xl border px-4 py-2.5 text-center
                          bg-white dark:bg-gray-800
                          border-gray-100 dark:border-gray-700">
            <p className={`text-xs font-semibold ${esFinde ? 'text-gray-400' : 'text-primary'}`}>
              {etiquetaDia(diaIdx)}
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight mt-0.5">
              {fechaLarga(diaActual)}
            </p>
          </div>

          <button
            onClick={() => cambiarDia(diaIdx + 1)}
            disabled={diaIdx === dias.length - 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl
                       border border-gray-200 dark:border-gray-700
                       disabled:opacity-30 active:bg-gray-100 dark:active:bg-gray-700
                       transition-colors flex-shrink-0"
          >
            <ChevronRight size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* ── Contenido según el día ───────────────── */}
        <AnimatePresence mode="wait">
          {esFinde ? (
            <DiaSinClases
              key={`finde-${diaIdx}`}
              diaActual={diaActual}
              onIrALunes={siguienteHabilIdx !== -1 ? () => cambiarDia(siguienteHabilIdx) : null}
            />
          ) : (
            <motion.div
              key={`slots-${diaIdx}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="space-y-5"
            >
              {/* Banner anticipación (solo hoy) */}
              {diaIdx === 0 && (
                <div className="flex items-center gap-3 bg-accent-light rounded-xl px-4 py-3">
                  <Zap size={18} className="text-accent flex-shrink-0" />
                  <p className="text-accent text-sm font-bold">
                    +5 pts si pides con 30 min de anticipación
                  </p>
                </div>
              )}

              {/* Mañana */}
              <section>
                <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-3">🌤️ Mañana</h2>
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

              {/* Tarde */}
              {tarde.length > 0 && (
                <section>
                  <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-3">🌇 Tarde</h2>
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

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>

      {/* ── Panel fijo sobre el BottomNav ────────── */}
      {/* Fuera del motion.div para que fixed se posicione respecto al viewport */}
      <AnimatePresence>
        {slotSeleccionado && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-20 inset-x-0 mx-auto w-full max-w-md
                       bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800
                       px-4 py-3 z-30 space-y-2"
            style={{ boxShadow: '0 -2px 12px rgba(0,0,0,0.08)' }}
          >
            <div className="flex items-center gap-3 bg-primary-light dark:bg-primary/20 rounded-xl px-4 py-2.5">
              <Clock size={16} className="text-primary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-primary text-xs font-semibold">Horario seleccionado</p>
                <p className="text-primary-dark dark:text-primary font-extrabold">
                  {etiquetaDia(diaIdx)} · {slotSeleccionado.label}
                </p>
              </div>
              {slotSeleccionado.esAnticipado && (
                <span className="bg-accent text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                  +5 pts
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/confirmar', {
                state: { slot: slotSeleccionado, fecha: diaActual.toISOString() }
              })}
              className="btn-primary w-full"
            >
              Confirmar {etiquetaDia(diaIdx).toLowerCase()} a las {slotSeleccionado.label}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
