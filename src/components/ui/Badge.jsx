import { Lock } from 'lucide-react'

export default function Badge({ insignia, desbloqueada = false, fechaObtenida = null }) {
  return (
    <div
      className={`flex flex-col items-center text-center gap-2 p-3 rounded-2xl
                  transition-all duration-300
                  ${desbloqueada
                    ? 'bg-white dark:bg-gray-800 shadow-card'
                    : 'bg-gray-50 dark:bg-gray-800 opacity-40 grayscale'
                  }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center
                    ${desbloqueada ? 'bg-accent-light' : 'bg-gray-100 dark:bg-gray-700'}`}
      >
        {desbloqueada
          ? <span className="text-2xl select-none">{insignia.icono}</span>
          : <Lock size={18} className="text-gray-300" />
        }
      </div>

      <div className="space-y-0.5">
        <p className={`text-xs font-bold leading-tight
                       ${desbloqueada ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
          {insignia.nombre}
        </p>
        <p className="text-[10px] text-gray-400 leading-snug line-clamp-2">
          {insignia.descripcion}
        </p>
        {desbloqueada && fechaObtenida && (
          <p className="text-[10px] text-primary font-semibold">
            {new Date(fechaObtenida).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'short'
            })}
          </p>
        )}
      </div>
    </div>
  )
}
