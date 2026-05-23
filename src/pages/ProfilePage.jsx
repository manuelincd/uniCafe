import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Edit2, Check, X } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import useOrderStore from '@/stores/useOrderStore'
import { calcularNivel, TODAS_LAS_INSIGNIAS } from '@/utils/points'
import Badge from '@/components/ui/Badge'
import PageHeader from '@/components/ui/PageHeader'

// Insignias que se muestran en el perfil (en orden)
const INSIGNIAS_PERFIL_IDS = [
  'primer-pedido',
  'primer-anticipado',
  'gourmet',
  'racha-3',
  'cliente-vip',
]

// Timeline de niveles
const TIMELINE = [
  { nombre: 'Casual',       icono: '☕', min: 0    },
  { nombre: 'Habitual',     icono: '🌟', min: 500  },
  { nombre: 'Cafetero VIP', icono: '👑', min: 2000 },
]

export default function ProfilePage() {
  const store = useUserStore()
  const {
    nombre, puntos, rachaActual,
    totalPedidos, pedidosAnticipados, insignias,
    setNombre
  } = store

  const pedidos = useOrderStore((s) => s.pedidos)

  const [editando,   setEditando]   = useState(false)
  const [nombreTemp, setNombreTemp] = useState(nombre)

  const infoNivel = calcularNivel(puntos)

  // Producto más pedido
  const conteos = {}
  pedidos.forEach((p) =>
    p.items?.forEach((i) => {
      conteos[i.nombre] = (conteos[i.nombre] ?? 0) + i.cantidad
    })
  )
  const productoFavorito =
    Object.entries(conteos).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const guardarNombre = () => {
    const val = nombreTemp.trim()
    if (val.length >= 2) {
      setNombre(val)
      setEditando(false)
    }
  }

  const insigniasPerfil = INSIGNIAS_PERFIL_IDS.map((id) => {
    const def         = TODAS_LAS_INSIGNIAS.find((i) => i.id === id)
    const desbloqueada = insignias.find((i) => i.id === id)
    return { def, desbloqueada }
  }).filter((x) => x.def)

  // Progreso del nivel actual en la timeline
  const nivelIdx = TIMELINE.findIndex((t) => t.nombre === infoNivel.nombre)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-8"
    >
      <PageHeader
        title="Perfil"
        rightAction={
          <button className="w-10 h-10 flex items-center justify-center rounded-xl
                             active:bg-gray-100 transition-colors">
            <Settings size={20} className="text-gray-500" />
          </button>
        }
      />

      <div className="px-4 space-y-5">

        {/* ── Card de usuario ──────────────────────── */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-16 h-16 bg-primary rounded-full flex items-center justify-center
                         text-white text-2xl font-extrabold select-none flex-shrink-0"
            >
              {nombre ? nombre[0].toUpperCase() : '?'}
            </div>

            <div className="flex-1 min-w-0">
              {editando ? (
                <div className="flex items-center gap-2">
                  <input
                    value={nombreTemp}
                    onChange={(e) => setNombreTemp(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && guardarNombre()}
                    maxLength={30}
                    autoFocus
                    className="flex-1 border-b-2 border-primary font-bold text-lg
                               text-gray-900 outline-none bg-transparent"
                  />
                  <button onClick={guardarNombre}>
                    <Check size={20} className="text-primary" />
                  </button>
                  <button onClick={() => { setEditando(false); setNombreTemp(nombre) }}>
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <h2 className="font-extrabold text-xl text-gray-900 truncate">{nombre}</h2>
                  <button onClick={() => setEditando(true)}>
                    <Edit2 size={15} className="text-gray-400" />
                  </button>
                </div>
              )}

              <p className="text-gray-400 text-sm mt-0.5 truncate">
                {nombre
                  ? `${nombre.toLowerCase().replace(/\s+/g, '.')}@uni.edu.mx`
                  : 'usuario@uni.edu.mx'}
              </p>

              {/* Badge de nivel */}
              <span
                className="inline-flex items-center gap-1 mt-2 bg-primary-light text-primary
                           text-xs font-extrabold px-3 py-1 rounded-full"
              >
                {infoNivel.icono} {infoNivel.nombre}
              </span>
            </div>
          </div>
        </div>

        {/* ── Puntos + barra de progreso ───────────── */}
        <div className="bg-primary-dark rounded-2xl p-5 text-white">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-extrabold tabular-nums">{puntos}</span>
            <span className="text-primary-light text-sm font-medium">puntos</span>
          </div>

          {infoNivel.siguiente ? (
            <>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${infoNivel.progreso}%` }}
                />
              </div>
              <p className="text-primary-light text-xs font-medium">
                Te faltan{' '}
                <span className="text-white font-extrabold">
                  {infoNivel.puntajeProximo - puntos} pts
                </span>
                {' '}para llegar a{' '}
                <span className="text-white font-extrabold">{infoNivel.siguiente}</span>
              </p>
            </>
          ) : (
            <p className="text-primary-light text-sm font-medium">
              ¡Máximo nivel alcanzado! Eres un Cafetero VIP 👑
            </p>
          )}
        </div>

        {/* ── Insignias ────────────────────────────── */}
        <section>
          <h2 className="font-bold text-gray-900 text-lg mb-3">Mis insignias</h2>
          <div className="grid grid-cols-3 gap-3">
            {insigniasPerfil.map(({ def, desbloqueada }) => (
              <Badge
                key={def.id}
                insignia={def}
                desbloqueada={!!desbloqueada}
                fechaObtenida={desbloqueada?.fechaObtenida}
              />
            ))}
          </div>
        </section>

        {/* ── Estadísticas ─────────────────────────── */}
        <section>
          <h2 className="font-bold text-gray-900 text-lg mb-3">Estadísticas</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '🛒', valor: totalPedidos,       label: 'Pedidos totales'     },
              { emoji: '⚡', valor: pedidosAnticipados,  label: 'Pedidos anticipados' },
              { emoji: '⭐', valor: puntos,              label: 'Puntos acumulados'   },
              { emoji: '❤️', valor: productoFavorito,   label: 'Producto favorito', small: true },
            ].map(({ emoji, valor, label, small }) => (
              <div key={label} className="bg-white rounded-2xl shadow-card p-4">
                <p className="text-2xl mb-1 select-none">{emoji}</p>
                <p className={`font-extrabold text-gray-900 leading-tight ${small ? 'text-sm' : 'text-2xl'}`}>
                  {valor}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Timeline de niveles ──────────────────── */}
        <section>
          <h2 className="font-bold text-gray-900 text-lg mb-4">Camino al siguiente nivel</h2>
          <div className="relative px-4">
            {/* Línea base */}
            <div className="absolute top-6 left-10 right-10 h-1.5 bg-gray-100 rounded-full" />
            {/* Línea de progreso */}
            <div
              className="absolute top-6 left-10 h-1.5 bg-primary rounded-full transition-all duration-700"
              style={{
                width: `calc(${Math.min(100, (nivelIdx / (TIMELINE.length - 1)) * 100)}% - 0px)`,
                right: 'auto',
              }}
            />

            <div className="relative flex justify-between">
              {TIMELINE.map((nv, i) => {
                const alcanzado = puntos >= nv.min
                return (
                  <div key={nv.nombre} className="flex flex-col items-center gap-2 w-16">
                    {/* Nodo */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center
                                  text-2xl border-4 transition-all duration-300 z-10
                                  ${alcanzado
                                    ? 'bg-primary border-primary shadow-md'
                                    : 'bg-white border-gray-200'
                                  }`}
                    >
                      {nv.icono}
                    </div>
                    {/* Etiqueta */}
                    <div className="text-center">
                      <p
                        className={`text-[11px] font-extrabold leading-tight ${
                          alcanzado ? 'text-primary' : 'text-gray-400'
                        }`}
                      >
                        {nv.nombre}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {nv.min === 0 ? 'Inicio' : `${nv.min} pts`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  )
}
