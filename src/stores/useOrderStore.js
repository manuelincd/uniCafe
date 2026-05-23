import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_POR_SLOT = 5

const useOrderStore = create(
  persist(
    (set, get) => ({
      pedidos: [],
      // slots: { "08:00": { reservados: 2 }, ... }
      slots: {},

      crearPedido: ({ items, notaCocina, slot, puntosGanados, total, nombreUsuario }) => {
        const id = `PED-${Date.now()}`
        const nuevoPedido = {
          id,
          items,
          notaCocina,
          slot,
          puntosGanados,
          total,
          nombreUsuario,
          estado: 'pendiente', // pendiente | listo | entregado | cancelado
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString()
        }

        const { slots } = get()
        const slotActual = slots[slot] ?? { reservados: 0 }

        set({
          pedidos: [nuevoPedido, ...get().pedidos],
          slots: {
            ...slots,
            [slot]: { reservados: slotActual.reservados + 1 }
          }
        })

        return id
      },

      cancelarPedido: (id) => {
        const { pedidos, slots } = get()
        const pedido = pedidos.find((p) => p.id === id)
        if (!pedido || pedido.estado === 'cancelado') return

        const slotActual = slots[pedido.slot] ?? { reservados: 0 }

        set({
          pedidos: pedidos.map((p) =>
            p.id === id
              ? { ...p, estado: 'cancelado', fechaActualizacion: new Date().toISOString() }
              : p
          ),
          slots: {
            ...slots,
            [pedido.slot]: {
              reservados: Math.max(0, slotActual.reservados - 1)
            }
          }
        })
      },

      marcarListo: (id) =>
        set({
          pedidos: get().pedidos.map((p) =>
            p.id === id
              ? { ...p, estado: 'listo', fechaActualizacion: new Date().toISOString() }
              : p
          )
        }),

      marcarEntregado: (id) =>
        set({
          pedidos: get().pedidos.map((p) =>
            p.id === id
              ? { ...p, estado: 'entregado', fechaActualizacion: new Date().toISOString() }
              : p
          )
        }),

      reservarSlot: (hora) => {
        const { slots } = get()
        const actual = slots[hora] ?? { reservados: 0 }
        if (actual.reservados >= MAX_POR_SLOT) return false
        set({ slots: { ...slots, [hora]: { reservados: actual.reservados + 1 } } })
        return true
      },

      liberarSlot: (hora) => {
        const { slots } = get()
        const actual = slots[hora] ?? { reservados: 1 }
        set({
          slots: {
            ...slots,
            [hora]: { reservados: Math.max(0, actual.reservados - 1) }
          }
        })
      },

      getReservadosEnSlot: (hora) => {
        const { slots } = get()
        return slots[hora]?.reservados ?? 0
      },

      getPedidosDelDia: () => {
        const hoy = new Date().toDateString()
        return get().pedidos.filter(
          (p) => new Date(p.fechaCreacion).toDateString() === hoy
        )
      }
    }),
    {
      name: 'cafeuni_orders',
      version: 1
    }
  )
)

export default useOrderStore
