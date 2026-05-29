import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import useCartStore from '@/stores/useCartStore'
import { getProducto, getCategoria } from '@/data/menu'
import PageHeader from '@/components/ui/PageHeader'

const DISP_CONFIG = {
  disponible: { label: 'Disponible',   color: 'bg-green-100 text-green-700'   },
  poco:       { label: 'Pocas piezas', color: 'bg-yellow-100 text-yellow-700' },
  agotado:    { label: 'Agotado',      color: 'bg-red-100 text-red-700'       },
}

function FavoritoCard({ producto }) {
  const navigate      = useNavigate()
  const toggleFavorito = useUserStore((s) => s.toggleFavorito)
  const agregarItem   = useCartStore((s) => s.agregarItem)
  const [imgError, setImgError] = useState(false)

  const categoria = getCategoria(producto.categoriaId)
  const disp      = DISP_CONFIG[producto.disponibilidad] ?? DISP_CONFIG.disponible
  const agotado   = producto.disponibilidad === 'agotado'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-card flex items-center gap-3 p-3"
    >
      {/* Imagen */}
      <button
        onClick={() => navigate(`/producto/${producto.id}`)}
        className="w-16 h-16 rounded-xl overflow-hidden bg-primary-light flex items-center
                   justify-center flex-shrink-0 active:scale-95 transition-transform"
      >
        {producto.imagen && !imgError ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-2xl select-none">{categoria?.emoji ?? '🍽️'}</span>
        )}
      </button>

      {/* Info */}
      <button
        onClick={() => navigate(`/producto/${producto.id}`)}
        className="flex-1 min-w-0 text-left space-y-0.5"
      >
        <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">
          {producto.nombre}
        </p>
        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${disp.color}`}>
          {disp.label}
        </span>
        <p className="text-primary font-extrabold text-sm">${producto.precio}</p>
      </button>

      {/* Acciones */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => toggleFavorito(producto.id)}
          className="w-9 h-9 flex items-center justify-center rounded-full
                     active:scale-90 transition-transform"
          aria-label="Quitar de favoritos"
        >
          <Heart size={18} className="fill-red-500 text-red-500" />
        </button>
        <button
          onClick={() => !agotado && agregarItem(producto)}
          disabled={agotado}
          className="w-9 h-9 bg-accent rounded-full flex items-center justify-center
                     active:scale-90 transition-transform shadow-md
                     disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Agregar al carrito"
        >
          <ShoppingCart size={15} className="text-white" />
        </button>
      </div>
    </motion.div>
  )
}

export default function FavoritosPage() {
  const navigate  = useNavigate()
  const favoritos = useUserStore((s) => s.favoritos)

  const productos = favoritos.map((id) => getProducto(id)).filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <PageHeader
        title="Mis favoritos"
        subtitle={
          productos.length > 0
            ? `${productos.length} producto${productos.length !== 1 ? 's' : ''} guardado${productos.length !== 1 ? 's' : ''}`
            : undefined
        }
        onBack={() => navigate(-1)}
      />

      <div className="px-4 pb-8">
        {productos.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-4 text-center px-6">
            <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Heart size={40} className="text-red-200 dark:text-red-800" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h2 className="font-bold text-gray-800 dark:text-white text-lg">
                Sin favoritos aún
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Toca el <Heart size={12} className="inline" /> en cualquier producto
                para guardarlo aquí y pedirlo rápidamente.
              </p>
            </div>
            <button
              onClick={() => navigate('/menu/buenos-dias')}
              className="btn-primary mt-2"
            >
              Explorar el menú
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {productos.map((producto) => (
              <FavoritoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
