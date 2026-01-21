import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Lock, Mail, AlertCircle } from 'lucide-react'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // USUARIOS TEMPORALES (solo para desarrollo)
  const USERS = {
    admin: {
      email: 'admin@infopan.com',
      password: 'admin123',
      role: 'administrador',
      name: 'Administrador'
    },
    gerente: {
      email: 'gerente@infopan.com',
      password: 'gerente123',
      role: 'gerente',
      name: 'Gerente'
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Buscar usuario
    const user = Object.values(USERS).find(
      u => u.email === email && u.password === password
    );

    if (user) {
      console.log('Login exitoso:', user);
      
      // Guardar datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify({
        email: user.email,
        role: user.role,
        name: user.name
      }));

      // Redirigir según el rol
      if (user.role === 'administrador') {
        navigate('/admin');
      } else if (user.role === 'gerente') {
        navigate('/gerente');
      }
    } else {
      setError('Correo o contraseña incorrectos');
      console.log('Login fallido:', { email, password });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Efectos de fondo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            <span className="text-green-600">INFO</span>
            <span className="text-gray-800">PAN</span>
          </h1>
          <Badge className="bg-green-600 text-white">Ecuador</Badge>
        </div>

        {/* Card de Login */}
        <Card className="border-2 border-gray-200 shadow-2xl">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 rounded-full">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-black">Acceso al Sistema</CardTitle>
            <CardDescription className="text-gray-600">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@infopan.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Botón Submit */}
              <Button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg rounded-lg transition-all duration-300 hover:shadow-lg mt-6"
              >
                Iniciar Sesión
              </Button>
            </form>

            {/* Credenciales temporales (SOLO PARA DESARROLLO) */}
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800 font-semibold mb-1">👨‍💼 Administrador:</p>
                <p className="text-xs text-blue-700">Email: admin@infopan.com</p>
                <p className="text-xs text-blue-700">Contraseña: admin123</p>
              </div>
              
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-800 font-semibold mb-1">👔 Gerente:</p>
                <p className="text-xs text-purple-700">Email: gerente@infopan.com</p>
                <p className="text-xs text-purple-700">Contraseña: gerente123</p>
              </div>
            </div>

            {/* Nota informativa */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                🔒 Acceso restringido solo para personal autorizado de INFOPAN Ecuador.
              </p>
            </div>

            {/* Link para volver */}
            <div className="text-center mt-6">
              <button 
                onClick={() => navigate('/')}
                className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
              >
                ← Volver al sitio público
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2026 INFOPAN Ecuador. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}

export default Login;