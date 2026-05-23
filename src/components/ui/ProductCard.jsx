import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { getCategoria } from '@/data/menu'
import useCartStore from '@/stores/useCartStore'

const DISP_CONFIG = {
  disponible: { label: 'Disponible',    color: 'bg-green-100 text-green-700'  },
  poco:       { label: 'Pocas piezas',  color: 'bg-yellow-100 text-yellow-700' },
  agotado:    { label: 'Agotado',       color: 'bg-red-100 text-red-700'       },
}

export default function ProductCard({ producto, onAdd }) {
  const navigate = useNavigate()
  const agregarItem = useCartStore((s) => s.agregarItem)

  const categoria = getCategoria(producto.categoriaId)
  const disp = DISP_CONFIG[producto.disponibilidad] ?? DISP_CONFIG.disponible
  const agotado = producto.disponibilidad === 'agotado'

  const handleAdd = (e) => {
    e.stopPropagation()
    if (agotado) return
    onAdd ? onAdd(producto) : agregarItem(producto)
  }

  return (
    <div
      onClick={() => navigate(`/producto/${producto.id}`)}
      className="bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer
                 active:scale-[0.97] transition-transform"
    >
      {/* Imagen placeholder verde con emoji de categoría */}
      <div
        className="bg-primary-light flex items-center justify-center"
        style={{ aspectRatio: '4/3' }}
      >
        <span className="text-5xl select-none">{categoria?.emoji ?? '🍽️'}</span>
      </div>

      {/* Contenido */}
      <div className="p-3 space-y-1.5">
        {/* Badge disponibilidad */}
        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${disp.color}`}>
          {disp.label}
        </span>

        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">
          {producto.nombre}
        </h3>

        <p className="text-gray-400 text-xs leading-snug line-clamp-2">
          {producto.descripcion}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="font-extrabold text-primary text-base">${producto.precio}</span>
          <button
            onClick={handleAdd}
            disabled={agotado}
            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center
                       active:scale-90 transition-transform shadow-md
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} className="text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
