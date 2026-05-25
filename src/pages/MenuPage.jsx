import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Search, X } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import { CATEGORIAS, PRODUCTOS, getProductosPorCategoria } from '@/data/menu'
import ProductCard from '@/components/ui/ProductCard'
import PageHeader from '@/components/ui/PageHeader'

const TAB_TODOS = { id: 'todos', nombre: 'Todos', emoji: '🍴' }
const TABS = [TAB_TODOS, ...CATEGORIAS]

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
  const [query, setQuery] = useState('')

  const esTodos = categoria === 'todos'
  const cat = CATEGORIAS.find((c) => c.id === categoria)

  let productos = esTodos ? PRODUCTOS : cat ? getProductosPorCategoria(categoria) : []

  if (query.trim()) {
    const q = query.toLowerCase()
    productos = productos.filter(
      (p) => p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q)
    )
  }

  useEffect(() => {
    if (cat) registrarCategoriaVista(categoria)
  }, [categoria])

  const handleSearch = (value) => {
    setQuery(value)
    if (value && !esTodos) navigate('/menu/todos', { replace: true })
  }

  if (!esTodos && !cat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
        <p className="text-gray-500">Categoría no encontrada</p>
        <button onClick={() => navigate('/')} className="btn-primary">Ir al inicio</button>
      </div>
    )
  }

  const headerTitle    = esTodos ? 'Menú' : `${cat.emoji} ${cat.nombre}`
  const headerSubtitle = esTodos ? 'Todos los platillos' : cat.descripcion

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.22 }}
      className="min-h-screen pb-6"
    >
      <PageHeader
        title={headerTitle}
        subtitle={headerSubtitle}
        onBack={() => navigate(-1)}
      />

      {/* ── Buscador ───────────────────────────────── */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2.5">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar platillo..."
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200
                       placeholder-gray-400 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="flex-shrink-0">
              <X size={15} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs de categorías ─────────────────────── */}
      <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide py-2
                      border-b border-gray-100 dark:border-gray-800">
        {TABS.map((c) => (
          <Link
            key={c.id}
            to={`/menu/${c.id}`}
            replace
            onClick={() => {
              setQuery('')
              if (c.id === categoria) window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full
                        text-sm font-semibold transition-all whitespace-nowrap
                        ${c.id === categoria
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 active:bg-gray-200'
                        }`}
          >
            <span className="text-base">{c.emoji}</span>
            <span>{c.nombre}</span>
          </Link>
        ))}
      </div>

      {/* ── Banner de puntos anticipados ───────────── */}
      <div className="px-4 pt-3">
        <div className="bg-primary-dark rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Zap size={15} className="text-accent flex-shrink-0" />
          <p className="text-white text-xs font-semibold">
            Pide con 30 min de anticipación y gana +5 puntos extra
          </p>
        </div>
      </div>

      {/* ── Grid de productos ──────────────────────── */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-4">
        {productos.length > 0 ? (
          productos.map((prod, i) => (
            <motion.div
              key={prod.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="show"
            >
              <ProductCard producto={prod} />
            </motion.div>
          ))
        ) : (
          <p className="col-span-2 text-center py-12 text-gray-400 text-sm">
            No se encontraron platillos
          </p>
        )}
      </div>
    </motion.div>
  )
}
