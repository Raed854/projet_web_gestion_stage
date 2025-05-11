import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StageDetail = () => {
  const { id } = useParams();
  const [stage, setStage] = useState(null);

  useEffect(() => {
    const fetchStageDetails = async () => {
      const token = localStorage.getItem('jwt'); // Retrieve JWT from localStorage

      try {
        const response = await fetch(`http://localhost:5000/stages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Add JWT in the Authorization header
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stage details');
        }

        const data = await response.json();
        setStage(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStageDetails();
  }, [id]);

  if (!stage) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{stage.intitule}</h1>
      <p><strong>Type:</strong> {stage.typeStage}</p>
      <p><strong>Dates:</strong> {new Date(stage.dateDebut).toLocaleDateString()} - {new Date(stage.dateFin).toLocaleDateString()}</p>
      <p><strong>Description:</strong> {stage.description}</p>
      <p><strong>Status:</strong> {stage.statut ? 'Active' : 'Inactive'}</p>
    </div>
  );
};

export default StageDetail;
