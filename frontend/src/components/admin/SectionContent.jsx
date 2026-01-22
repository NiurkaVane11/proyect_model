import { Plus } from 'lucide-react';

const SectionContent = ({ sectionName }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black text-gray-900 capitalize">{sectionName}</h2>
        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
          <Plus size={20} />
          Nuevo
        </button>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
        <p className="text-gray-600 text-lg">Contenido de <strong>{sectionName}</strong> en desarrollo...</p>
      </div>
    </div>
  );
};

export default SectionContent;