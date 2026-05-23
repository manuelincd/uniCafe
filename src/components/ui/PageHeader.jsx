import { ChevronLeft } from 'lucide-react'

export default function PageHeader({ title, subtitle, onBack, rightAction }) {
  return (
    <div className="flex items-center px-4 pt-5 pb-3 gap-3 bg-white">
      {/* Botón back o espaciador */}
      <div className="w-10 flex-shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl
                       active:bg-gray-100 transition-colors -ml-2"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
        )}
      </div>

      {/* Título centrado */}
      <div className="flex-1 text-center min-w-0">
        <h1 className="text-xl font-bold text-gray-900 leading-tight truncate">{title}</h1>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Acción derecha o espaciador */}
      <div className="w-10 flex-shrink-0 flex justify-end">
        {rightAction ?? null}
      </div>
    </div>
  )
}
