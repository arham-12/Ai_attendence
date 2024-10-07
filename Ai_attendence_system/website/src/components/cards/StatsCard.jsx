const StatsCard = ({ title, value }) => {
    return (
      <div className="bg-white shadow-lg rounded-lg p-5 flex flex-col justify-between">
        <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
        <p className="text-2xl font-bold text-blue-600">{value}</p>
      </div>
    );
  };
  
  export default StatsCard;
  