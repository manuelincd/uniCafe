// Horario de la cafetería
const APERTURA_HORA  = 7
const APERTURA_MIN   = 30
const CIERRE_HORA    = 18
const CIERRE_MIN     = 0
const INTERVALO_MIN  = 15
export const MAX_POR_SLOT   = 5   // referencia para calcular carga en estado de pedido
const MIN_ANTICIPADO = 30  // minutos requeridos para bonus

/**
 * Genera todos los slots para una fecha dada.
 * @param {object} reservas - { "08:00": { reservados: N }, ... }
 * @param {Date}   fecha    - día para el que generar slots (default: hoy)
 * estado: 'pasado' | 'disponible'
 */
export function generarSlots(reservas = {}, fecha = new Date()) {
  const slots  = []
  const ahora  = new Date()
  const esHoy  = fecha.toDateString() === ahora.toDateString()

  let cursor = new Date(fecha)
  cursor.setHours(APERTURA_HORA, APERTURA_MIN, 0, 0)

  const cierre = new Date(fecha)
  cierre.setHours(CIERRE_HORA, CIERRE_MIN, 0, 0)

  while (cursor <= cierre) {
    const hh = String(cursor.getHours()).padStart(2, '0')
    const mm = String(cursor.getMinutes()).padStart(2, '0')
    const hora = `${hh}:${mm}`

    const pedidosActuales = reservas[hora]?.reservados ?? 0
    const yaPaso = esHoy && cursor <= ahora

    slots.push({
      hora,
      label:          formatearHora(cursor),
      estado:         yaPaso ? 'pasado' : 'disponible',
      pedidosActuales,
      esAnticipado:   !yaPaso && esHoy && esAnticipado(hora),
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
 * Nivel de carga del slot — usado en el estado del pedido, no en la selección.
 * 0–3 pedidos = 'normal' · 4 = 'alta' · 5+ = 'muy-alta'
 */
export function nivelCargaSlot(pedidos) {
  if (pedidos >= MAX_POR_SLOT)     return 'muy-alta'
  if (pedidos >= MAX_POR_SLOT - 1) return 'alta'
  return 'normal'
}

function formatearHora(date) {
  return date.toLocaleTimeString('es-MX', {
    hour:   'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function proximoSlotDisponible(reservas = {}) {
  return generarSlots(reservas).find((s) => s.estado !== 'pasado') ?? null
}
