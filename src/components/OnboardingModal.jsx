import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coffee, Star, Clock, ChevronRight } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'

export default function OnboardingModal({ onClose }) {
  const [paso, setPaso] = useState(0)
  const [nombreInput, setNombreInput] = useState('')
  const [error, setError] = useState('')
  const setNombre = useUserStore((s) => s.setNombre)

  const confirmar = () => {
    const valor = nombreInput.trim()
    if (!valor) {
      setError('Escribe tu nombre para continuar')
      return
    }
    if (valor.length < 2) {
      setError('Mínimo 2 caracteres')
      return
    }
    setNombre(valor)
    onClose()
  }

  const pasos = [
    {
      icono: <Coffee size={48} className="text-primary" />,
      titulo: '¡Bienvenido a CaféUni!',
      texto: 'Pide en la cafetería sin hacer fila. Elige tu hora, personaliza tu orden y pasa a recoger cuando esté listo.'
    },
    {
      icono: <Clock size={48} className="text-primary" />,
      titulo: 'Pick-up express',
      texto: 'Solo pick-up en cafetería. Haz tu pedido con anticipación, gana puntos extra y pasa a recogerlo sin esperar.'
    },
    {
      icono: <Star size={48} className="text-accent" />,
      titulo: 'Acumula puntos',
      texto: 'Cada peso gastado suma puntos. Desbloquea insignias, sube de nivel y conviértete en Leyenda de la cafetería.'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="w-full max-w-md bg-white rounded-t-3xl px-6 pt-8 pb-safe"
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

        {paso < pasos.length ? (
          <>
            {/* Paso informativo */}
            <div className="flex flex-col items-center text-center gap-4 min-h-48">
              <div className="p-4 bg-primary-light rounded-2xl">
                {pasos[paso].icono}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{pasos[paso].titulo}</h2>
              <p className="text-gray-500 leading-relaxed">{pasos[paso].texto}</p>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 my-6">
              {pasos.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === paso ? 'w-6 bg-primary' : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setPaso(paso + 1)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {paso < pasos.length - 1 ? 'Siguiente' : '¡Comenzar!'}
              <ChevronRight size={18} />
            </button>
          </>
        ) : (
          <>
            {/* Paso nombre */}
            <div className="flex flex-col items-center text-center gap-4 min-h-48">
              <div className="text-5xl">☕</div>
              <h2 className="text-2xl font-bold text-gray-900">¿Cómo te llamas?</h2>
              <p className="text-gray-500">Con tu nombre personalizamos tu experiencia</p>
            </div>

            <div className="mt-4 mb-6">
              <input
                type="text"
                value={nombreInput}
                onChange={(e) => {
                  setNombreInput(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && confirmar()}
                placeholder="Tu nombre o apodo"
                maxLength={30}
                autoFocus
                className={`w-full border-2 rounded-xl px-4 py-3 text-lg font-medium
                           outline-none transition-colors
                           ${error
                             ? 'border-red-400 focus:border-red-500'
                             : 'border-gray-200 focus:border-primary'
                           }`}
              />
              {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
            </div>

            <button onClick={confirmar} className="btn-primary w-full">
              Entrar a la cafetería
            </button>
          </>
        )}

        <div className="h-4" />
      </motion.div>
    </motion.div>
  )
}
