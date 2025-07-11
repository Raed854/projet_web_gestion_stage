import React, { useState, useEffect } from "react";
import "./Profile.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit, faSave, faTimes, faLock, faKey } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {  const [userProfile, setUserProfile] = useState({
    id: '',
    nom: '',
    prenom: '',
    email: '',
    classe: '',
    role: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUserProfile(userData);
      } else {
        toast.error("Erreur lors du chargement du profil");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    return nameRegex.test(name);
  };

  const validateUser = (user) => {
    if (!user.nom?.trim()) {
      toast.error("Le nom est requis");
      return false;
    }

    if (!user.prenom?.trim()) {
      toast.error("Le prénom est requis");
      return false;
    }

    if (!user.email?.trim()) {
      toast.error("L'email est requis");
      return false;
    }

    if (!validateName(user.nom)) {
      toast.error("Le nom ne doit contenir que des lettres");
      return false;
    }

    if (!validateName(user.prenom)) {
      toast.error("Le prénom ne doit contenir que des lettres");
      return false;
    }

    if (!validateEmail(user.email)) {
      toast.error("Veuillez fournir une adresse email valide");
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!validateUser(userProfile)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${userProfile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(userProfile),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserProfile(updatedData);
        setIsEditing(false);
        toast.success("Profil mis à jour avec succès");
      } else {
        toast.error("Échec de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    fetchUserProfile(); // Reset to original data
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSave = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Tous les champs de mot de passe sont requis");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${userProfile.id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (response.ok) {
        setShowPasswordChange(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        toast.success("Mot de passe modifié avec succès");
      } else {
        const errorData = await response.text();
        toast.error(errorData || "Échec de la modification du mot de passe");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Erreur lors de la modification du mot de passe");
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordChange(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Chargement du profil...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <h2>Mon Profil</h2>          <div className="profile-actions">
            {!isEditing ? (
              <div className="action-buttons">
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <FontAwesomeIcon icon={faEdit} /> Modifier
                </button>
                <button className="password-btn" onClick={() => setShowPasswordChange(true)}>
                  <FontAwesomeIcon icon={faLock} /> Changer mot de passe
                </button>
              </div>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  <FontAwesomeIcon icon={faSave} /> Sauvegarder
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  <FontAwesomeIcon icon={faTimes} /> Annuler
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-field">
            <label>Nom:</label>
            {isEditing ? (
              <input
                type="text"
                name="nom"
                value={userProfile.nom}
                onChange={handleInputChange}
                className="profile-input"
              />
            ) : (
              <span className="profile-value">{userProfile.nom}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Prénom:</label>
            {isEditing ? (
              <input
                type="text"
                name="prenom"
                value={userProfile.prenom}
                onChange={handleInputChange}
                className="profile-input"
              />
            ) : (
              <span className="profile-value">{userProfile.prenom}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={userProfile.email}
                onChange={handleInputChange}
                className="profile-input"
              />
            ) : (
              <span className="profile-value">{userProfile.email}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Classe:</label>
            {isEditing ? (
              <input
                type="text"
                name="classe"
                value={userProfile.classe || ''}
                onChange={handleInputChange}
                className="profile-input"
              />
            ) : (
              <span className="profile-value">{userProfile.classe || 'Non spécifiée'}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Rôle:</label>
            <span className="profile-value role-badge">{userProfile.role}</span>          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="password-modal-overlay">
          <div className="password-modal">
            <div className="password-modal-header">
              <h3><FontAwesomeIcon icon={faKey} /> Changer le mot de passe</h3>
              <button className="close-btn" onClick={handlePasswordCancel}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="password-modal-content">
              <div className="password-field">
                <label>Mot de passe actuel:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="password-input"
                />
              </div>
              <div className="password-field">
                <label>Nouveau mot de passe:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="password-input"
                />
              </div>
              <div className="password-field">
                <label>Confirmer le nouveau mot de passe:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="password-input"
                />
              </div>
              <div className="password-actions">
                <button className="save-password-btn" onClick={handlePasswordSave}>
                  <FontAwesomeIcon icon={faSave} /> Sauvegarder
                </button>
                <button className="cancel-password-btn" onClick={handlePasswordCancel}>
                  <FontAwesomeIcon icon={faTimes} /> Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
