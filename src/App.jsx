import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import useUserStore    from '@/stores/useUserStore'
import useSettingsStore from '@/stores/useSettingsStore'

// ── Páginas principales ───────────────────────────────────────
import HomePage    from '@/pages/HomePage'
import MenuPage    from '@/pages/MenuPage'
import ProductPage from '@/pages/ProductPage'
import CartPage    from '@/pages/CartPage'

// ── Flujo de pedido ───────────────────────────────────────────
import SchedulePage from '@/pages/SchedulePage'
import ConfirmPage  from '@/pages/ConfirmPage'
import HistoryPage  from '@/pages/HistoryPage'
import ProfilePage  from '@/pages/ProfilePage'

// ── Componentes globales ──────────────────────────────────────
import BottomNav       from '@/components/ui/BottomNav'
import CartFAB         from '@/components/ui/CartFAB'
import OnboardingModal from '@/components/OnboardingModal'
import ScrollToTop     from '@/components/ScrollToTop'

export default function App() {
  const { nombre } = useUserStore()
  const { modoOscuro, tamanoTexto } = useSettingsStore()
  const [mostrarOnboarding, setMostrarOnboarding] = useState(!nombre)

  useEffect(() => {
    if (!nombre) setMostrarOnboarding(true)
  }, [nombre])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', modoOscuro)
  }, [modoOscuro])

  useEffect(() => {
    const sizes = { normal: '100%', grande: '112%', extragrande: '125%' }
    document.documentElement.style.fontSize = sizes[tamanoTexto] ?? '100%'
  }, [tamanoTexto])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-background dark:bg-gray-900 flex flex-col max-w-md mx-auto relative">
        {/* Modal de primer acceso */}
        <AnimatePresence>
          {mostrarOnboarding && (
            <OnboardingModal onClose={() => setMostrarOnboarding(false)} />
          )}
        </AnimatePresence>

        {/* Contenido principal */}
        <main className="flex-1 pb-16 overflow-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/"                element={<HomePage />}    />
              <Route path="/menu/:categoria" element={<MenuPage />}    />
              <Route path="/producto/:id"    element={<ProductPage />} />
              <Route path="/carrito"         element={<CartPage />}    />
              <Route path="/horario"         element={<SchedulePage />} />
              <Route path="/confirmar"       element={<ConfirmPage />}  />
              <Route path="/pedidos"         element={<HistoryPage />}  />
              <Route path="/perfil"          element={<ProfilePage />}  />
              <Route path="*"               element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Overlays persistentes — ocultos durante onboarding */}
        {!mostrarOnboarding && (
          <>
            <BottomNav />
            <CartFAB />
          </>
        )}
      </div>
    </BrowserRouter>
  )
}
