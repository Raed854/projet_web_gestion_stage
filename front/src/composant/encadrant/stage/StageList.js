import { useEffect, useState } from 'react';

const StageList = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStages = async () => {
      const token = localStorage.getItem('jwt');
      setLoading(true);

      try {
        const response = await fetch('http://localhost:5000/stages', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stages');
        }

        const data = await response.json();
        setStages(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Failed to load stages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, []);

  // Function to determine status badge color
  const getStatusBadgeClasses = (statut) => {
    return statut
      ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
      : "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-gray-600">Loading stages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-700">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const renderStageCard = (stage) => (
    <div 
      key={stage.id}
      className="group block bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
      onClick={() => window.location.href = `/encadrant/stages/${stage.id}`}
    >
      <div className="border-b border-gray-100 bg-gray-50 p-4">
        <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
          {stage.intitule}
        </h2>
        <span className="inline-block mt-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
          {stage.typeStage}
        </span>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Period:</span>
            <div className="mt-1">
              {formatDate(stage.dateDebut)} - {formatDate(stage.dateFin)}
            </div>
          </div>
          <span className={getStatusBadgeClasses(stage.statut)}>
            {stage.statut ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <p className="text-gray-700 line-clamp-2 mb-3 text-sm">
          {stage.description}
        </p>
        
        <div className="flex justify-end mt-2">
          <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800">
            View details
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Available Internships</h1>
      
      {stages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No internships available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map(stage => renderStageCard(stage))}
        </div>
      )}
    </div>
  );
};

export default StageList;