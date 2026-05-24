import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useSettingsStore = create(
  persist(
    (set) => ({
      modoOscuro:  false,
      tamanoTexto: 'normal', // 'normal' | 'grande' | 'extragrande'
      setModoOscuro:  (val) => set({ modoOscuro: val }),
      setTamanoTexto: (val) => set({ tamanoTexto: val }),
    }),
    { name: 'cafeuni_settings' }
  )
)

export default useSettingsStore
