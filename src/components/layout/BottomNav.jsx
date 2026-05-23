import { NavLink, useLocation } from 'react-router-dom'
import { Home, UtensilsCrossed, ShoppingCart, ClipboardList, User } from 'lucide-react'
import useCartStore from '@/stores/useCartStore'

const NAV_ITEMS = [
  { to: '/',          label: 'Inicio',   Icon: Home },
  { to: '/menu/buenos-dias', label: 'Menú', Icon: UtensilsCrossed },
  { to: '/carrito',   label: 'Carrito',  Icon: ShoppingCart, badge: true },
  { to: '/pedidos',   label: 'Pedidos',  Icon: ClipboardList },
  { to: '/perfil',    label: 'Perfil',   Icon: User },
]

export default function BottomNav() {
  const location = useLocation()
  const totalItems = useCartStore((s) => s.items.reduce((acc, i) => acc + i.cantidad, 0))

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                    bg-white border-t border-gray-100 shadow-bottom pb-safe z-40">
      <ul className="flex justify-around items-center h-16">
        {NAV_ITEMS.map(({ to, label, Icon, badge }) => {
          const activo =
            to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to)

          return (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                className="flex flex-col items-center gap-0.5 py-2 relative"
              >
                <span className="relative">
                  <Icon
                    size={22}
                    className={activo ? 'text-primary' : 'text-gray-400'}
                    strokeWidth={activo ? 2.5 : 1.8}
                  />
                  {badge && totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-white
                                     text-[10px] font-bold w-4 h-4 rounded-full
                                     flex items-center justify-center leading-none">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    activo ? 'text-primary' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
                {activo && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2
                                   w-6 h-0.5 bg-primary rounded-full" />
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
