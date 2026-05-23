import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Minus, Plus, Check, ChevronLeft } from 'lucide-react'
import useCartStore from '@/stores/useCartStore'
import { getProducto, getCategoria } from '@/data/menu'

const DISP_CONFIG = {
  disponible: { label: 'Disponible',   color: 'bg-green-100 text-green-700'   },
  poco:       { label: 'Pocas piezas', color: 'bg-yellow-100 text-yellow-700' },
  agotado:    { label: 'Agotado',      color: 'bg-red-100 text-red-700'       },
}

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const agregarItem = useCartStore((s) => s.agregarItem)

  const producto  = getProducto(id)
  const categoria = producto ? getCategoria(producto.categoriaId) : null

  const [cantidad,         setCantidad]        = useState(1)
  const [personalizaciones, setPersonalizaciones] = useState([])
  const [favorito,          setFavorito]          = useState(false)
  const [agregado,          setAgregado]          = useState(false)

  if (!producto || !categoria) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Producto no encontrado</p>
        <button onClick={() => navigate(-1)} className="btn-primary">Volver</button>
      </div>
    )
  }

  const disp   = DISP_CONFIG[producto.disponibilidad] ?? DISP_CONFIG.disponible
  const agotado = producto.disponibilidad === 'agotado'

  const togglePersonalizacion = (p) =>
    setPersonalizaciones((prev) =>
      prev.find((x) => x.id === p.id)
        ? prev.filter((x) => x.id !== p.id)
        : [...prev, p]
    )

  const extraCosto     = personalizaciones.reduce((acc, p) => acc + (p.costo ?? 0), 0)
  const precioUnitario = producto.precio + extraCosto
  const precioTotal    = precioUnitario * cantidad

  const handleAgregar = () => {
    if (agotado) return
    agregarItem(producto, personalizaciones, cantidad)
    setAgregado(true)
    setTimeout(() => navigate(-1), 700)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen flex flex-col"
    >
      {/* ── Header flotante ────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl
                     bg-white/80 backdrop-blur active:bg-gray-100 transition-colors shadow"
        >
          <ChevronLeft size={22} className="text-gray-700" />
        </button>
        <button
          onClick={() => setFavorito(!favorito)}
          className="w-10 h-10 flex items-center justify-center rounded-xl
                     bg-white/80 backdrop-blur active:bg-gray-100 transition-colors shadow"
        >
          <Heart
            size={22}
            className={favorito ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* ── Contenido scrolleable ──────────────────── */}
      <div className="flex-1 overflow-y-auto pb-36 px-4 space-y-5">
        {/* Imagen placeholder 4:3 */}
        <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <div className="w-full h-full bg-primary-light flex items-center justify-center">
            <span className="text-[88px] select-none">{categoria.emoji}</span>
          </div>
        </div>

        {/* Nombre + disponibilidad */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight flex-1">
              {producto.nombre}
            </h1>
            <span className={`badge flex-shrink-0 mt-1 ${disp.color}`}>
              {disp.label}
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">{producto.descripcion}</p>
          <p className="text-3xl font-extrabold text-primary pt-1">${producto.precio}</p>
        </div>

        {/* ── Personalizaciones ──────────────────────── */}
        {producto.personalizaciones.length > 0 && (
          <section>
            <h2 className="font-bold text-gray-800 text-base mb-3">Personaliza tu orden</h2>
            <div className="space-y-2">
              {producto.personalizaciones.map((p) => {
                const sel = !!personalizaciones.find((x) => x.id === p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePersonalizacion(p)}
                    className={`w-full flex items-center justify-between px-4 py-3.5
                                rounded-xl border-2 transition-all active:scale-[0.99]
                                ${sel
                                  ? 'border-primary bg-primary-light'
                                  : 'border-gray-100 bg-white'
                                }`}
                  >
                    <span
                      className={`font-semibold text-sm ${
                        sel ? 'text-primary' : 'text-gray-700'
                      }`}
                    >
                      {p.label}
                    </span>

                    <div className="flex items-center gap-2.5">
                      {p.costo > 0 && (
                        <span
                          className={`text-sm font-bold ${
                            sel ? 'text-primary' : 'text-accent'
                          }`}
                        >
                          +${p.costo}
                        </span>
                      )}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center
                                    justify-center transition-colors
                                    ${sel
                                      ? 'bg-primary border-primary'
                                      : 'border-gray-300'
                                    }`}
                      >
                        {sel && (
                          <Check size={11} className="text-white" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {/* ── Footer sticky ──────────────────────────── */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                   bg-white border-t border-gray-100 px-4 pt-3 pb-safe shadow-bottom"
      >
        {/* Selector de cantidad */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-700 text-sm">Cantidad</span>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-1.5">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center
                         justify-center active:scale-90 transition-transform"
            >
              <Minus size={13} className="text-gray-600" />
            </button>
            <span className="text-lg font-bold w-6 text-center tabular-nums">
              {cantidad}
            </span>
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="w-7 h-7 rounded-full bg-primary flex items-center
                         justify-center active:scale-90 transition-transform"
            >
              <Plus size={13} className="text-white" />
            </button>
          </div>
        </div>

        {/* Botón naranja */}
        <button
          onClick={handleAgregar}
          disabled={agotado || agregado}
          className={`w-full flex items-center justify-between px-5 py-4 rounded-xl
                      font-bold text-base transition-all text-white
                      ${agregado
                        ? 'bg-green-500'
                        : agotado
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-accent active:scale-[0.98]'
                      }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {agregado ? (
              <motion.span
                key="ok"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mx-auto"
              >
                <Check size={20} strokeWidth={3} />
                ¡Agregado al carrito!
              </motion.span>
            ) : agotado ? (
              <motion.span key="agotado" className="mx-auto">
                Producto agotado
              </motion.span>
            ) : (
              <motion.span
                key="agregar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between w-full"
              >
                <span>Agregar al carrito</span>
                <span className="tabular-nums">${precioTotal}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  )
}
