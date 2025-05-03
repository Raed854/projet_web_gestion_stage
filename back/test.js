const { createUser, getUsers, getUserById, updateUser } = require('./controllers/userController');
const { createStage, getStages, getStageById, updateStage } = require('./controllers/stageController');
const { createMessage, getMessages, getMessageById, updateMessage } = require('./controllers/messageController');
const { createCompteRendu, getCompteRendus, getCompteRenduById, updateCompteRendu } = require('./controllers/compteRenduController');
const { createCommentaire, getCommentaires, getCommentaireById, updateCommentaire } = require('./controllers/commentaireController');
const { createTache, getTaches, getTacheById, updateTache } = require('./controllers/tacheController');

async function testFunctions() {
  try {
    // User functions
    console.log('Testing User Functions...');
    const newUser = await createUser({
      body: {
        nom: 'John',
        prenom: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'etudiant'
      }
    }, mockResponse());

    const newUserId = 1; // Use a fixed user ID for testing

    await getUsers({}, mockResponse());
    await getUserById({ params: { id: newUserId } }, mockResponse());
    await updateUser({ params: { id: newUserId }, body: { nom: 'John Updated' } }, mockResponse());

    // Stage functions
    console.log('Testing Stage Functions...');
    const newStage = await createStage({
      body: {
        intitule: 'Stage 1',
        typeStage: "Stage d'été",
        dateDebut: '2025-06-01',
        dateFin: '2025-08-31',
        description: 'Summer internship',
        statut: true
      }
    }, mockResponse());

    const newStageId = 1; // Use a fixed stage ID for testing

    await getStages({}, mockResponse());
    await getStageById({ params: { id: newStageId } }, mockResponse());
    await updateStage({ params: { id: newStageId }, body: { intitule: 'Updated Stage 1' } }, mockResponse());

    // Message functions
    console.log('Testing Message Functions...');
    const newMessage = await createMessage({
      body: {
        destinataire: newUserId,
        date: '2025-05-03',
        contenu: 'Hello, this is a test message.'
      }
    }, mockResponse());

    const newMessageId = 1; // Use a fixed message ID for testing

    await getMessages({}, mockResponse());
    await getMessageById({ params: { id: newMessageId } }, mockResponse());
    await updateMessage({ params: { id: newMessageId }, body: { contenu: 'Updated message content.' } }, mockResponse());

    // CompteRendu functions
    console.log('Testing CompteRendu Functions...');
    const newCompteRendu = await createCompteRendu({
      body: {
        nom: 'Compte Rendu 1',
        type: 'Rapport',
        statut: 'En attente'
      }
    }, mockResponse());

    const newCompteRenduId = 1; // Use a fixed compteRendu ID for testing

    await getCompteRendus({}, mockResponse());
    await getCompteRenduById({ params: { id: newCompteRenduId } }, mockResponse());
    await updateCompteRendu({ params: { id: newCompteRenduId }, body: { statut: 'Accepté' } }, mockResponse());

    // Commentaire functions
    console.log('Testing Commentaire Functions...');
    const newCommentaire = await createCommentaire({
      body: {
        contenu: 'This is a test comment.',
        date: '2025-05-03'
      }
    }, mockResponse());

    const newCommentaireId = 1; // Use a fixed commentaire ID for testing

    await getCommentaires({}, mockResponse());
    await getCommentaireById({ params: { id: newCommentaireId } }, mockResponse());
    await updateCommentaire({ params: { id: newCommentaireId }, body: { contenu: 'Updated comment content.' } }, mockResponse());

    // Tache functions
    console.log('Testing Tache Functions...');
    const newTache = await createTache({
      body: {
        nom: 'Tache 1',
        intitule: 'Task Title',
        description: 'Task description',
        ddl: '2025-05-10',
        statut: false
      }
    }, mockResponse());

    const newTacheId = 1; // Use a fixed tache ID for testing

    await getTaches({}, mockResponse());
    await getTacheById({ params: { id: newTacheId } }, mockResponse());
    await updateTache({ params: { id: newTacheId }, body: { statut: true } }, mockResponse());

  } catch (error) {
    console.error('Error during function testing:', error);
  }
}

function mockResponse() {
  return {
    status: function (statusCode) {
      console.log('Status:', statusCode);
      return this;
    },
    json: function (data) {
      console.log('JSON Response:', data);
      return this;
    },
    send: function (data) {
      console.log('Send Response:', data);
      return this;
    }
  };
}

testFunctions();