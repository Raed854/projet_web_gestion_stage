import React, { useEffect, useState } from 'react';
import axios from 'axios';

// type: 'etudiants' or 'encadrants'
const UserSelector = ({ type, onSelect, label = 'Sélectionner un utilisateur' }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const route = type === 'etudiants' ? '/users/etudiants' : '/users/encadrants';
        const response = await axios.get(`http://localhost:5000${route}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [type]);

  const handleChange = (e) => {
    setSelectedId(e.target.value);
    if (onSelect) onSelect(e.target.value);
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <label>{label}</label>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <select value={selectedId} onChange={handleChange} style={{ marginLeft: 8 }}>
          <option value="">-- Choisir --</option>
          {users.map(u => (
            <option key={u.id || u._id} value={u.id || u._id}>
              {u.nom} {u.prenom ? u.prenom : ''}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default UserSelector;
