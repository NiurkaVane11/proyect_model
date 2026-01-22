const StatsCard = ({ title, value, trend, icon: Icon, gradient, trendIcon: TrendIcon }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200 hover:shadow-2xl`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <Icon size={28} />
        </div>
        <TrendIcon size={20} className="opacity-70" />
      </div>
      <p className="text-sm opacity-90 font-medium mb-1">{title}</p>
      <p className="text-4xl font-black mb-2">{value}</p>
      <p className="text-xs opacity-75">{trend}</p>
    </div>
  );
};

export default StatsCard;