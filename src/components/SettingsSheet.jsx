import { motion, useDragControls } from 'framer-motion'
import { Moon, Sun, Type, X } from 'lucide-react'
import useSettingsStore from '@/stores/useSettingsStore'

const TAMANOS = [
  { key: 'normal',      label: 'Normal',      desc: 'Tamaño predeterminado' },
  { key: 'grande',      label: 'Grande',       desc: 'Más cómodo de leer'   },
  { key: 'extragrande', label: 'Extra grande', desc: 'Mayor accesibilidad'  },
]

export default function SettingsSheet({ onClose }) {
  const { modoOscuro, tamanoTexto, setModoOscuro, setTamanoTexto } = useSettingsStore()
  const dragControls = useDragControls()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
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
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl px-6 pt-5 pb-10"
      >
        {/* Handle — área de arrastre */}
        <div
          className="cursor-grab active:cursor-grabbing mb-5"
          style={{ touchAction: 'none' }}
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto" />
        </div>

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Configuración</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl
                       active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* ── Modo oscuro ────────────────────────────── */}
        <section className="mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {modoOscuro
                ? <Moon size={20} className="text-primary" />
                : <Sun size={20} className="text-accent" />
              }
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  Modo oscuro
                </p>
                <p className="text-gray-400 text-xs">
                  {modoOscuro ? 'Activado' : 'Desactivado'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setModoOscuro(!modoOscuro)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300
                          ${modoOscuro ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`}
              aria-label="Activar modo oscuro"
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md
                             transition-all duration-300
                             ${modoOscuro ? 'left-[26px]' : 'left-0.5'}`}
              />
            </button>
          </div>
        </section>

        <div className="h-px bg-gray-100 dark:bg-gray-700 mb-5" />

        {/* ── Tamaño de texto ────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Type size={18} className="text-primary" />
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              Tamaño de texto
            </p>
          </div>
          <div className="space-y-2">
            {TAMANOS.map(({ key, label, desc }) => {
              const activo = tamanoTexto === key
              return (
                <button
                  key={key}
                  onClick={() => setTamanoTexto(key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl
                              border-2 transition-all active:scale-[0.99]
                              ${activo
                                ? 'border-primary bg-primary-light dark:bg-primary/20'
                                : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'
                              }`}
                >
                  <div className="text-left">
                    <p className={`text-sm font-semibold
                                   ${activo ? 'text-primary' : 'text-gray-700 dark:text-gray-200'}`}>
                      {label}
                    </p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>

                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                   flex-shrink-0 transition-colors
                                   ${activo ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                    {activo && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      </motion.div>
    </motion.div>
  )
}
