// ── Sistema de puntos ──────────────────────────────────────────
const PUNTOS_BASE_PEDIDO = 10   // fijos por completar cualquier pedido
const PUNTOS_POR_PESO    = 1    // pts adicionales por cada $10 gastados
const PESOS_POR_PUNTO    = 10
const BONUS_ANTICIPADO   = 5
const BONUS_PRIMER_DIA   = 3

// ── Niveles ────────────────────────────────────────────────────
const NIVELES = [
  { nivel: 0, nombre: 'Casual',       icono: '☕', min: 0,    max: 499          },
  { nivel: 1, nombre: 'Habitual',     icono: '🌟', min: 500,  max: 1999         },
  { nivel: 2, nombre: 'Cafetero VIP', icono: '👑', min: 2000, max: Infinity      },
]

// ── Catálogo de insignias ──────────────────────────────────────
export const TODAS_LAS_INSIGNIAS = [
  // ── 5 mostradas en ProfilePage ──
  {
    id: 'primer-pedido',
    nombre: 'Primer Pedido',
    icono: '🎉',
    descripcion: '¡Realizaste tu primer pedido en CaféUni!'
  },
  {
    id: 'primer-anticipado',
    nombre: 'Pedido Anticipado',
    icono: '⏰',
    descripcion: 'Pediste con 30 o más minutos de anticipación'
  },
  {
    id: 'gourmet',
    nombre: 'Explorador de Menú',
    icono: '🗺️',
    descripcion: 'Pediste en 5 o más categorías diferentes'
  },
  {
    id: 'racha-3',
    nombre: 'Racha 3 Días',
    icono: '🔥',
    descripcion: '3 días seguidos haciendo pedidos'
  },
  {
    id: 'cliente-vip',
    nombre: 'Cafetero VIP',
    icono: '👑',
    descripcion: 'Alcanzaste el nivel Cafetero VIP (2,000+ pts)'
  },
  // ── Insignias adicionales ──
  { id: 'madrugador',    nombre: 'Madrugador',      icono: '🌅', descripcion: 'Pedido antes de las 8 AM' },
  { id: 'fiel-cafetero', nombre: 'Fiel Cafetero',   icono: '🏅', descripcion: '10 pedidos completados' },
  { id: 'racha-7',       nombre: 'Semana Perfecta', icono: '🗓️', descripcion: '7 días seguidos haciendo pedidos' },
  { id: 'explorador',    nombre: 'Catador Total',   icono: '🏆', descripcion: 'Visitaste todas las categorías del menú' },
  { id: 'cien-puntos',   nombre: 'Centenario',      icono: '💯', descripcion: 'Acumulaste 100 puntos o más' },
]

/**
 * Calcula puntos por pedido completado (híbrido: fijos + por monto).
 * @param {Array}   items             - Items del carrito
 * @param {boolean} esAnticipado      - Slot elegido 30+ min en el futuro
 * @param {boolean} esPrimerPedidoDia - Primer pedido del día del usuario
 * @returns {{ puntosBase, bonusMonto, bonusAnticipado, bonusPrimerDia, total }}
 */
export function calcularPuntosPedido(items = [], esAnticipado = false, esPrimerPedidoDia = false) {
  const subtotal = items.reduce(
    (acc, i) => acc + (i.precio + (i.precioPersonalizaciones ?? 0)) * i.cantidad, 0
  )
  const puntosBase      = PUNTOS_BASE_PEDIDO
  const bonusMonto      = Math.floor(subtotal / PESOS_POR_PUNTO) * PUNTOS_POR_PESO
  const bonusAnticipado = esAnticipado      ? BONUS_ANTICIPADO : 0
  const bonusPrimerDia  = esPrimerPedidoDia ? BONUS_PRIMER_DIA : 0
  const total           = puntosBase + bonusMonto + bonusAnticipado + bonusPrimerDia

  return { puntosBase, bonusMonto, bonusAnticipado, bonusPrimerDia, total }
}

/**
 * Retorna información del nivel actual según los puntos acumulados.
 * @param {number} puntos
 * @returns {{ nivel, nombre, icono, min, max, siguiente, puntajeProximo, progreso }}
 */
export function calcularNivel(puntos) {
  const nivelActual = [...NIVELES].reverse().find((n) => puntos >= n.min) ?? NIVELES[0]
  const indice      = NIVELES.findIndex((n) => n.nivel === nivelActual.nivel)
  const siguiente   = indice < NIVELES.length - 1 ? NIVELES[indice + 1] : null
  const puntajeProximo = siguiente?.min ?? null
  const progreso = siguiente
    ? Math.min(100, Math.round(((puntos - nivelActual.min) / (siguiente.min - nivelActual.min)) * 100))
    : 100

  return { ...nivelActual, siguiente: siguiente?.nombre ?? null, puntajeProximo, progreso }
}

/**
 * Revisa qué insignias nuevas merece el usuario tras un nuevo pedido.
 * @param {object} userState   - Estado actual del store (puntos ya incluyen los nuevos)
 * @param {object} nuevoPedido - { slot, esAnticipado }
 * @returns {Array} Insignias nuevas desbloqueadas
 */
export function verificarInsignias(userState, nuevoPedido) {
  const {
    insignias         = [],
    totalPedidos      = 0,
    rachaActual       = 0,
    categoriasVistas  = [],
    puntos            = 0,
  } = userState

  const yaDesbloqueada = (id) => insignias.some((i) => i.id === id)
  const nuevas = []

  const otorgar = (id) => {
    if (!yaDesbloqueada(id)) {
      const def = TODAS_LAS_INSIGNIAS.find((i) => i.id === id)
      if (def) nuevas.push(def)
    }
  }

  if (totalPedidos === 0)                  otorgar('primer-pedido')
  if (nuevoPedido?.esAnticipado)           otorgar('primer-anticipado')
  if (totalPedidos + 1 >= 10)             otorgar('fiel-cafetero')
  if (rachaActual + 1 >= 3)               otorgar('racha-3')
  if (rachaActual + 1 >= 7)               otorgar('racha-7')
  if (categoriasVistas.length >= 5)       otorgar('gourmet')
  if (categoriasVistas.length >= 7)       otorgar('explorador')
  if (puntos >= 100)                       otorgar('cien-puntos')
  if (puntos >= 2000)                      otorgar('cliente-vip')

  const hora = nuevoPedido?.slot ? parseInt(nuevoPedido.slot.split(':')[0], 10) : null
  if (hora !== null && hora < 8)           otorgar('madrugador')

  return nuevas
}
