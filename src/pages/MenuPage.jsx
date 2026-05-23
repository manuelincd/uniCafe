import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import { CATEGORIAS, getProductosPorCategoria } from '@/data/menu'
import ProductCard from '@/components/ui/ProductCard'
import PageHeader from '@/components/ui/PageHeader'

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.055, type: 'spring', stiffness: 280, damping: 22 }
  })
}

export default function MenuPage() {
  const { categoria } = useParams()
  const navigate = useNavigate()
  const registrarCategoriaVista = useUserStore((s) => s.registrarCategoriaVista)

  const cat      = CATEGORIAS.find((c) => c.id === categoria)
  const productos = cat ? getProductosPorCategoria(categoria) : []

  useEffect(() => {
    if (cat) registrarCategoriaVista(categoria)
  }, [categoria])

  if (!cat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
        <p className="text-gray-500">Categoría no encontrada</p>
        <button onClick={() => navigate('/')} className="btn-primary">Ir al inicio</button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.22 }}
      className="min-h-screen pb-40"
    >
      {/* ── Header ─────────────────────────────────── */}
      <PageHeader
        title={`${cat.emoji} ${cat.nombre}`}
        subtitle={cat.descripcion}
        onBack={() => navigate(-1)}
      />

      {/* ── Tabs de categorías con scroll ──────────── */}
      <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide py-2 border-b border-gray-100">
        {CATEGORIAS.map((c) => (
          <Link
            key={c.id}
            to={`/menu/${c.id}`}
            replace
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full
                        text-sm font-semibold transition-all whitespace-nowrap
                        ${c.id === categoria
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                        }`}
          >
            <span className="text-base">{c.emoji}</span>
            <span>{c.nombre}</span>
          </Link>
        ))}
      </div>

      {/* ── Grid de productos 2 columnas ───────────── */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-4">
        {productos.map((prod, i) => (
          <motion.div
            key={prod.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="show"
          >
            <ProductCard producto={prod} />
          </motion.div>
        ))}
      </div>

      {/* ── Banner sticky inferior — puntos anticipados ─ */}
      <div
        className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-20
                   pointer-events-none"
      >
        <div
          className="bg-primary-dark/90 backdrop-blur-sm rounded-xl px-4 py-2.5
                     flex items-center gap-2 shadow-lg"
        >
          <Zap size={15} className="text-accent flex-shrink-0" />
          <p className="text-white text-xs font-semibold">
            Pide con 30 min de anticipación y gana +5 puntos extra
          </p>
        </div>
      </div>
    </motion.div>
  )
}
