import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import useUserStore from '@/stores/useUserStore'

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

export default function App() {
  const { nombre } = useUserStore()
  const [mostrarOnboarding, setMostrarOnboarding] = useState(!nombre)

  useEffect(() => {
    if (!nombre) setMostrarOnboarding(true)
  }, [nombre])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">

        {/* Modal de primer acceso */}
        <AnimatePresence>
          {mostrarOnboarding && (
            <OnboardingModal onClose={() => setMostrarOnboarding(false)} />
          )}
        </AnimatePresence>

        {/* Contenido principal — pb-16 para que no quede bajo el BottomNav */}
        <main className="flex-1 pb-16">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Rutas principales */}
              <Route path="/"                element={<HomePage />}    />
              <Route path="/menu/:categoria" element={<MenuPage />}    />
              <Route path="/producto/:id"    element={<ProductPage />} />
              <Route path="/carrito"         element={<CartPage />}    />

              {/* Flujo de pedido */}
              <Route path="/horario"   element={<SchedulePage />} />
              <Route path="/confirmar" element={<ConfirmPage />}  />
              <Route path="/pedidos"   element={<HistoryPage />}  />
              <Route path="/perfil"    element={<ProfilePage />}  />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Overlays persistentes — ocultos durante onboarding */}
        {!mostrarOnboarding && (
          <>
            <BottomNav />
            <CartFAB />  {/* Se auto-oculta en /carrito y cuando el carrito está vacío */}
          </>
        )}
      </div>
    </BrowserRouter>
  )
}
