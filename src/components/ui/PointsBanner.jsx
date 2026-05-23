import useUserStore from '@/stores/useUserStore'
import { calcularNivel } from '@/utils/points'

export default function PointsBanner({ className = '' }) {
  const { puntos } = useUserStore()
  const info = calcularNivel(puntos)

  return (
    <div className={`bg-primary-dark rounded-2xl p-5 text-white ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-primary-light text-xs font-semibold uppercase tracking-widest">
            Nivel {info.nombre}
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-4xl font-extrabold leading-none">{puntos}</span>
            <span className="text-primary-light text-sm font-medium">puntos</span>
          </div>
        </div>
        <span className="text-5xl select-none">{info.icono}</span>
      </div>

      {info.siguiente ? (
        <div className="space-y-1.5">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${info.progreso}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-primary-light">
            <span>{puntos} pts</span>
            <span>
              {info.puntajeProximo} pts → <span className="font-bold">{info.siguiente}</span>
            </span>
          </div>
        </div>
      ) : (
        <p className="text-primary-light text-sm font-medium">
          ¡Eres Leyenda de la cafetería! 👑
        </p>
      )}
    </div>
  )
}
