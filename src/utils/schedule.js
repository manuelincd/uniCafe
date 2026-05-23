// Horario de la cafetería
const APERTURA_HORA  = 7
const APERTURA_MIN   = 30
const CIERRE_HORA    = 18
const CIERRE_MIN     = 0
const INTERVALO_MIN  = 15
const MAX_POR_SLOT   = 5   // capacidad máxima por slot
const MIN_ANTICIPADO = 30  // minutos requeridos para bonus

/**
 * Genera todos los slots del día con su estado base.
 * @param {object} reservas - { "08:00": { reservados: N }, ... }
 * @returns {Array<{ hora, label, estado, pedidosActuales, disponibles, esAnticipado }>}
 */
export function generarSlots(reservas = {}) {
  const slots = []
  const ahora = new Date()

  let cursor = new Date()
  cursor.setHours(APERTURA_HORA, APERTURA_MIN, 0, 0)

  const cierre = new Date()
  cierre.setHours(CIERRE_HORA, CIERRE_MIN, 0, 0)

  while (cursor <= cierre) {
    const hh = String(cursor.getHours()).padStart(2, '0')
    const mm = String(cursor.getMinutes()).padStart(2, '0')
    const hora = `${hh}:${mm}`

    const pedidosActuales = reservas[hora]?.reservados ?? 0
    const yaPaso = cursor <= ahora

    const estado = yaPaso ? 'pasado' : getEstadoSlot(pedidosActuales)

    slots.push({
      hora,
      label:          formatearHora(cursor),
      estado,
      pedidosActuales,
      disponibles:    yaPaso ? 0 : Math.max(0, MAX_POR_SLOT - pedidosActuales),
      esAnticipado:   !yaPaso && esAnticipado(hora),
    })

    cursor = new Date(cursor.getTime() + INTERVALO_MIN * 60 * 1000)
  }

  return slots
}

/**
 * Devuelve true si el slot está 30+ min en el futuro (bonus de puntos).
 * @param {string} horaSlot - "HH:MM"
 */
export function esAnticipado(horaSlot) {
  const ahora = new Date()
  const [hh, mm] = horaSlot.split(':').map(Number)
  const slot = new Date()
  slot.setHours(hh, mm, 0, 0)
  return (slot - ahora) / (1000 * 60) >= MIN_ANTICIPADO
}

/**
 * 0–3 pedidos = disponible · 4 = casi-lleno · 5 = lleno
 * @param {number} pedidos
 * @returns {'disponible' | 'casi-lleno' | 'lleno'}
 */
export function getEstadoSlot(pedidos) {
  if (pedidos >= MAX_POR_SLOT)     return 'lleno'
  if (pedidos >= MAX_POR_SLOT - 1) return 'casi-lleno'
  return 'disponible'
}

/** Clases Tailwind por estado de slot */
export function colorPorEstado(estado) {
  switch (estado) {
    case 'disponible': return { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300'  }
    case 'casi-lleno': return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' }
    case 'lleno':      return { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300'    }
    case 'pasado':     return { bg: 'bg-gray-100',   text: 'text-gray-400',   border: 'border-gray-200'   }
    default:           return { bg: 'bg-gray-100',   text: 'text-gray-400',   border: 'border-gray-200'   }
  }
}

/** Texto legible para cada estado */
export function etiquetaEstado(estado) {
  switch (estado) {
    case 'disponible': return 'Disponible'
    case 'casi-lleno': return 'Casi lleno'
    case 'lleno':      return 'Sin lugares'
    case 'pasado':     return 'Pasado'
    default:           return estado
  }
}

function formatearHora(date) {
  return date.toLocaleTimeString('es-MX', {
    hour:   'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function proximoSlotDisponible(reservas = {}) {
  return generarSlots(reservas).find((s) => s.estado === 'disponible') ?? null
}
