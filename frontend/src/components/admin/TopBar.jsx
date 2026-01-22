import { Search, Bell, ChevronDown } from 'lucide-react';

const TopBar = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm p-4 border-b border-gray-200/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar en INFOPAN..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-3 hover:bg-green-50 rounded-xl transition-all duration-200 group">
            <Bell size={22} className="text-gray-600 group-hover:text-green-600 transition-colors" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 p-2 pr-4 hover:bg-green-50 rounded-xl cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-green-200">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-800">Administrador</p>
              <p className="text-xs text-gray-500">admin@infopan.com</p>
            </div>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;