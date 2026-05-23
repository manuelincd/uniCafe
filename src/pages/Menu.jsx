import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Plus, ShoppingCart } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import useCartStore from '@/stores/useCartStore'
import { CATEGORIAS, getProductosPorCategoria } from '@/data/menu'

export default function Menu() {
  const { categoria } = useParams()
  const navigate = useNavigate()
  const registrarCategoriaVista = useUserStore((s) => s.registrarCategoriaVista)
  const agregarItem = useCartStore((s) => s.agregarItem)
  const totalItems = useCartStore((s) => s.items.reduce((acc, i) => acc + i.cantidad, 0))

  const cat = CATEGORIAS.find((c) => c.id === categoria)
  const productos = getProductosPorCategoria(categoria)

  // Registrar visita a la categoría (efecto lazy, sin usarEffect para simplificar scaffolding)
  if (cat) registrarCategoriaVista(categoria)

  if (!cat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Categoría no encontrada</p>
        <button onClick={() => navigate('/')} className="btn-primary">Ir al inicio</button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur z-30 px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <div className="text-center">
            <p className="text-xl">{cat.emoji}</p>
            <h1 className="text-base font-bold text-gray-900 leading-tight">{cat.nombre}</h1>
          </div>
          <button
            onClick={() => navigate('/carrito')}
            className="relative p-2 -mr-2"
          >
            <ShoppingCart size={24} className="text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-accent text-white text-[10px]
                               font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Tabs de categorías */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIAS.map((c) => (
            <Link
              key={c.id}
              to={`/menu/${c.id}`}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                c.id === categoria
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.nombre}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Productos */}
      <div className="px-4 py-4 space-y-3">
        {productos.map((prod) => (
          <div key={prod.id} className="card flex gap-4">
            {/* Info */}
            <div className="flex-1">
              <Link
                to={`/producto/${prod.id}`}
                className="font-semibold text-gray-900 hover:text-primary transition-colors"
              >
                {prod.nombre}
              </Link>
              <p className="text-gray-400 text-sm mt-0.5 leading-snug line-clamp-2">
                {prod.descripcion}
              </p>
              <p className="mt-2 text-primary font-bold text-lg">
                ${prod.precio}
              </p>
            </div>

            {/* Acción */}
            <div className="flex flex-col items-end justify-between">
              <Link
                to={`/producto/${prod.id}`}
                className="text-xs text-gray-400 underline underline-offset-2"
              >
                Personalizar
              </Link>
              <button
                onClick={() => agregarItem(prod)}
                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center
                           active:scale-90 transition-transform shadow-md"
              >
                <Plus size={20} className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
