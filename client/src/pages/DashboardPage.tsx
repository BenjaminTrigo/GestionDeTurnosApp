import { useAuth } from '../hooks/useAuth'
import CrearServicio from '../components/CrearServicio'
import ReservarTurno from '../components/ReservarTurno'
import { Button } from '../components/ui/button'

export const DashboardPage = () => {
  const { user, logout, hasPermission } = useAuth()

  if (!user) {
    return <div>Por favor, inicia sesión.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Bienvenido, {user.nombre}</p>
            {user.role === 'admin' && (
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Administrador
              </span>
            )}
          </div>
          <Button variant="destructive" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {hasPermission('create_service') && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Servicios</h2>
            <CrearServicio />
          </section>
        )}

        {hasPermission('reserve_appointment') && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reservar un Turno</h2>
            <ReservarTurno />
          </section>
        )}
      </main>
    </div>
  )
}
