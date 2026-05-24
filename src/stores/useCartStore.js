import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      notaCocina: '',

      // Agrega un producto; si ya existe con las mismas personalizaciones, incrementa cantidad
      agregarItem: (producto, personalizaciones = [], cantidad = 1) => {
        const { items } = get()
        const llave = JSON.stringify({ id: producto.id, personalizaciones })
        const existente = items.find((i) => i._llave === llave)

        if (existente) {
          set({
            items: items.map((i) =>
              i._llave === llave ? { ...i, cantidad: i.cantidad + cantidad } : i
            )
          })
        } else {
          set({
            items: [
              ...items,
              {
                _llave: llave,
                uid: `${producto.id}_${Date.now()}`,
                productoId: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                personalizaciones,
                cantidad,
                precioPersonalizaciones: personalizaciones.reduce(
                  (acc, p) => acc + (p.costo ?? 0),
                  0
                )
              }
            ]
          })
        }
      },

      editarItem: (uid, personalizaciones, cantidad) => {
        set({
          items: get().items.map((i) => {
            if (i.uid !== uid) return i
            const llave = JSON.stringify({ id: i.productoId, personalizaciones })
            return {
              ...i,
              _llave: llave,
              personalizaciones,
              cantidad,
              precioPersonalizaciones: personalizaciones.reduce(
                (acc, p) => acc + (p.costo ?? 0), 0
              )
            }
          })
        })
      },

      quitarItem: (uid) => {
        set({ items: get().items.filter((i) => i.uid !== uid) })
      },

      actualizarCantidad: (uid, cantidad) => {
        if (cantidad <= 0) {
          set({ items: get().items.filter((i) => i.uid !== uid) })
        } else {
          set({
            items: get().items.map((i) =>
              i.uid === uid ? { ...i, cantidad } : i
            )
          })
        }
      },

      setNotaCocina: (nota) => set({ notaCocina: nota }),

      limpiarCarrito: () => set({ items: [], notaCocina: '' }),

      // Selectores derivados
      totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),

      totalPrecio: () =>
        get().items.reduce(
          (acc, i) => acc + (i.precio + i.precioPersonalizaciones) * i.cantidad,
          0
        )
    }),
    {
      name: 'cafeuni_cart',
      version: 1
    }
  )
)

export default useCartStore
