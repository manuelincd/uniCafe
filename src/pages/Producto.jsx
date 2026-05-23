import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Plus, Minus, ShoppingCart, Check } from 'lucide-react'
import useCartStore from '@/stores/useCartStore'
import { getProducto, getCategoria } from '@/data/menu'

export default function Producto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const agregarItem = useCartStore((s) => s.agregarItem)

  const producto = getProducto(id)
  const categoria = producto ? getCategoria(producto.categoriaId) : null

  const [cantidad, setCantidad] = useState(1)
  const [personalizacionesSeleccionadas, setPersonalizaciones] = useState([])
  const [agregado, setAgregado] = useState(false)

  if (!producto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Producto no encontrado</p>
        <button onClick={() => navigate(-1)} className="btn-primary">Volver</button>
      </div>
    )
  }

  const togglePersonalizacion = (p) => {
    setPersonalizaciones((prev) =>
      prev.find((x) => x.id === p.id)
        ? prev.filter((x) => x.id !== p.id)
        : [...prev, p]
    )
  }

  const extraCosto = personalizacionesSeleccionadas.reduce((acc, p) => acc + (p.costo ?? 0), 0)
  const totalUnitario = producto.precio + extraCosto
  const totalFinal = totalUnitario * cantidad

  const handleAgregar = () => {
    agregarItem(producto, personalizacionesSeleccionadas, cantidad)
    setAgregado(true)
    setTimeout(() => navigate(-1), 800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <button onClick={() => navigate('/carrito')} className="p-2 -mr-2">
          <ShoppingCart size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-6">
        {/* Categoría + nombre */}
        <div>
          <span className="text-2xl">{categoria?.emoji}</span>
          <span className="ml-2 text-sm text-gray-400 font-medium">{categoria?.nombre}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{producto.nombre}</h1>
          <p className="text-gray-500 mt-1 leading-relaxed">{producto.descripcion}</p>
          <p className="text-3xl font-bold text-primary mt-3">${producto.precio}</p>
        </div>

        {/* Personalizaciones */}
        {producto.personalizaciones.length > 0 && (
          <section>
            <h2 className="font-bold text-gray-800 mb-3">Personaliza tu orden</h2>
            <div className="space-y-2">
              {producto.personalizaciones.map((p) => {
                const seleccionada = personalizacionesSeleccionadas.find((x) => x.id === p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePersonalizacion(p)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2
                                transition-all ${
                                  seleccionada
                                    ? 'border-primary bg-primary-light'
                                    : 'border-gray-100 bg-white'
                                }`}
                  >
                    <span className={`font-medium text-sm ${seleccionada ? 'text-primary' : 'text-gray-700'}`}>
                      {p.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {p.costo > 0 && (
                        <span className={`text-sm font-semibold ${seleccionada ? 'text-primary' : 'text-accent'}`}>
                          +${p.costo}
                        </span>
                      )}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        seleccionada ? 'bg-primary border-primary' : 'border-gray-300'
                      }`}>
                        {seleccionada && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {/* Footer fijo */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                      bg-white border-t border-gray-100 px-4 py-4 pb-safe shadow-bottom">
        {/* Selector de cantidad */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-gray-700">Cantidad</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center"
            >
              <Minus size={16} className="text-gray-600" />
            </button>
            <span className="text-lg font-bold w-6 text-center">{cantidad}</span>
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Botón agregar */}
        <button
          onClick={handleAgregar}
          disabled={agregado}
          className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-semibold
                      transition-all text-white ${agregado ? 'bg-green-500' : 'bg-primary active:scale-95'}`}
        >
          <AnimatePresence mode="wait">
            {agregado ? (
              <motion.span
                key="listo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mx-auto"
              >
                <Check size={18} /> ¡Agregado al carrito!
              </motion.span>
            ) : (
              <motion.span key="agregar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Agregar al carrito
              </motion.span>
            )}
          </AnimatePresence>
          {!agregado && (
            <span className="font-bold">${totalFinal}</span>
          )}
        </button>
      </div>
    </motion.div>
  )
}
