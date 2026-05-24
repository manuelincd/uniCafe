import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Debe mantenerse sincronizado con NIVELES en utils/points.js
const NIVELES = [
  { min: 0,    nombre: 'Casual',       icono: '☕' },
  { min: 500,  nombre: 'Habitual',     icono: '🌟' },
  { min: 2000, nombre: 'Cafetero VIP', icono: '👑' },
]

const useUserStore = create(
  persist(
    (set, get) => ({
      // Identidad
      nombre: '',
      email: '',

      // Gamificación
      puntos:           0,
      nivel:            0,
      insignias:        [],
      rachaActual:      0,
      ultimoPedidoFecha: null,

      // Analítica local
      categoriasVistas:   [],
      totalPedidos:       0,
      pedidosAnticipados: 0,

      // ── Acciones ────────────────────────────────────
      setNombre: (nombre) => set({ nombre }),
      setEmail:  (email)  => set({ email }),

      agregarPuntos: (cantidad) => {
        const nuevos = get().puntos + cantidad
        const nuevoNivel = NIVELES.reduce(
          (acc, n, i) => (nuevos >= n.min ? i : acc),
          0
        )
        set({ puntos: nuevos, nivel: nuevoNivel })
      },

      quitarPuntos: (cantidad) => {
        const nuevos = Math.max(0, get().puntos - cantidad)
        const nuevoNivel = NIVELES.reduce(
          (acc, n, i) => (nuevos >= n.min ? i : acc),
          0
        )
        set({ puntos: nuevos, nivel: nuevoNivel })
      },

      registrarPedido: ({ esAnticipado = false } = {}) => {
        const hoy = new Date().toDateString()
        const { ultimoPedidoFecha, rachaActual, totalPedidos, pedidosAnticipados } = get()

        const ayer = new Date()
        ayer.setDate(ayer.getDate() - 1)

        const nuevaRacha =
          ultimoPedidoFecha === ayer.toDateString()
            ? rachaActual + 1
            : ultimoPedidoFecha === hoy
            ? rachaActual
            : 1

        set({
          ultimoPedidoFecha: hoy,
          rachaActual:       nuevaRacha,
          totalPedidos:      totalPedidos + 1,
          pedidosAnticipados: pedidosAnticipados + (esAnticipado ? 1 : 0),
        })
      },

      registrarCategoriaVista: (categoriaId) => {
        const { categoriasVistas } = get()
        if (!categoriasVistas.includes(categoriaId)) {
          set({ categoriasVistas: [...categoriasVistas, categoriaId] })
        }
      },

      agregarInsignia: (insignia) => {
        const { insignias } = get()
        if (!insignias.find((i) => i.id === insignia.id)) {
          set({
            insignias: [
              ...insignias,
              { ...insignia, fechaObtenida: new Date().toISOString() }
            ]
          })
        }
      },

      resetearPerfil: () =>
        set({
          nombre: '', email: '', puntos: 0, nivel: 0, insignias: [],
          rachaActual: 0, ultimoPedidoFecha: null,
          categoriasVistas: [], totalPedidos: 0, pedidosAnticipados: 0,
        }),
    }),
    { name: 'cafeuni_user', version: 1 }
  )
)

export default useUserStore
