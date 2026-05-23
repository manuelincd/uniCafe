import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Check, X, Flame, Star, Trophy } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import { calcularNivel, TODAS_LAS_INSIGNIAS } from '@/utils/points'

export default function Perfil() {
  const store = useUserStore()
  const {
    nombre, puntos, rachaActual, totalPedidos,
    pedidosAnticipados, insignias, setNombre
  } = store

  const [editando, setEditando] = useState(false)
  const [nombreTemp, setNombreTemp] = useState(nombre)

  const infoNivel = calcularNivel(puntos)

  const guardarNombre = () => {
    const val = nombreTemp.trim()
    if (val.length >= 2) {
      setNombre(val)
      setEditando(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 pt-5 pb-4 space-y-6"
    >
      {/* Avatar + nombre */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-3xl font-bold text-primary select-none">
          {nombre ? nombre[0].toUpperCase() : '?'}
        </div>
        <div className="flex-1">
          {editando ? (
            <div className="flex items-center gap-2">
              <input
                value={nombreTemp}
                onChange={(e) => setNombreTemp(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && guardarNombre()}
                maxLength={30}
                autoFocus
                className="flex-1 border-b-2 border-primary text-lg font-bold text-gray-900 outline-none bg-transparent"
              />
              <button onClick={guardarNombre} className="text-primary">
                <Check size={20} />
              </button>
              <button onClick={() => { setEditando(false); setNombreTemp(nombre) }} className="text-gray-400">
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{nombre}</h1>
              <button onClick={() => setEditando(true)} className="text-gray-400">
                <Edit2 size={16} />
              </button>
            </div>
          )}
          <p className="text-gray-400 text-sm">{infoNivel.icono} {infoNivel.nombre}</p>
        </div>
      </div>

      {/* Card de nivel */}
      <div className="bg-primary rounded-2xl p-5 text-white">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-primary-light text-sm">Puntos totales</p>
            <p className="text-4xl font-bold">{puntos}</p>
          </div>
          <div className="text-4xl">{infoNivel.icono}</div>
        </div>
        {infoNivel.siguiente && (
          <>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${infoNivel.progreso}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-primary-light">
              <span>{infoNivel.nombre}</span>
              <span>{infoNivel.puntajeProximo} pts → {infoNivel.siguiente}</span>
            </div>
          </>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icono: <Star size={20} />,  valor: totalPedidos,       label: 'Pedidos' },
          { icono: <Flame size={20} />, valor: rachaActual,        label: 'Racha' },
          { icono: <Trophy size={20} />,valor: insignias.length,   label: 'Insignias' },
        ].map(({ icono, valor, label }) => (
          <div key={label} className="card text-center space-y-1">
            <div className="text-primary flex justify-center">{icono}</div>
            <p className="text-2xl font-bold text-gray-900">{valor}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Insignias */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Insignias</h2>
        <div className="grid grid-cols-3 gap-3">
          {TODAS_LAS_INSIGNIAS.map((ins) => {
            const desbloqueada = insignias.find((i) => i.id === ins.id)
            return (
              <div
                key={ins.id}
                className={`card flex flex-col items-center text-center gap-1.5 py-4
                            transition-opacity ${desbloqueada ? '' : 'opacity-30 grayscale'}`}
              >
                <span className="text-3xl">{ins.icono}</span>
                <p className="text-xs font-semibold text-gray-800 leading-tight">{ins.nombre}</p>
                {desbloqueada && (
                  <p className="text-[10px] text-gray-400">
                    {new Date(desbloqueada.fechaObtenida).toLocaleDateString('es-MX', {
                      day: 'numeric', month: 'short'
                    })}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Datos extra */}
      <div className="card text-sm space-y-2 text-gray-600">
        <p>🎯 Pedidos anticipados: <span className="font-bold text-gray-900">{pedidosAnticipados}</span></p>
        <p>📅 Racha actual: <span className="font-bold text-gray-900">{rachaActual} día{rachaActual !== 1 ? 's' : ''}</span></p>
      </div>
    </motion.div>
  )
}
