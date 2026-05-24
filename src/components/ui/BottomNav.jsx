import { NavLink, useLocation } from 'react-router-dom'
import { Home, BookOpen, ClipboardList, User } from 'lucide-react'
import useOrderStore from '@/stores/useOrderStore'

const TABS = [
  { to: '/',               label: 'Inicio',      Icon: Home                       },
  { to: '/menu/buenos-dias', label: 'Menú',      Icon: BookOpen                   },
  { to: '/pedidos',        label: 'Mis Pedidos', Icon: ClipboardList, badge: true },
  { to: '/perfil',         label: 'Perfil',      Icon: User                       },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const pedidos = useOrderStore((s) => s.pedidos)
  const activos = pedidos.filter(
    (p) => p.estado === 'pendiente' || p.estado === 'listo'
  ).length

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800
                 shadow-bottom pb-safe z-40"
    >
      <ul className="flex justify-around items-center h-16">
        {TABS.map(({ to, label, Icon, badge }) => {
          const activo =
            to === '/'
              ? pathname === '/'
              : pathname.startsWith(to.split('/')[1] === 'menu' ? '/menu' : to)

          return (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                className="flex flex-col items-center gap-0.5 py-2 relative select-none"
              >
                <span className="relative">
                  <Icon
                    size={22}
                    className={activo ? 'text-primary' : 'text-gray-400'}
                    strokeWidth={activo ? 2.5 : 1.8}
                  />
                  {badge && activos > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 bg-accent text-white
                                 text-[10px] font-bold min-w-[16px] h-4 rounded-full
                                 flex items-center justify-center leading-none px-0.5"
                    >
                      {activos > 9 ? '9+' : activos}
                    </span>
                  )}
                </span>

                <span
                  className={`text-[10px] font-medium leading-none ${
                    activo ? 'text-primary' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>

                {activo && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2
                               w-6 h-0.5 bg-primary rounded-full"
                  />
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
