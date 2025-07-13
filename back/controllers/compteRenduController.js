const CompteRendu = require('../models/CompteRendu');
const path = require('path');
const fs = require('fs');

// CRUD operations
exports.createCompteRendu = async (req, res) => {
  try {
    const compteRenduData = { ...req.body };
    
    // If file was uploaded, add file information
    if (req.file) {
      compteRenduData.filePath = req.file.path;
      compteRenduData.fileName = req.file.originalname;
      compteRenduData.fileSize = req.file.size;
    }
    
    const compteRendu = await CompteRendu.create(compteRenduData);
    res.status(201).json(compteRendu);
  } catch (error) {
    // If file was uploaded but database creation failed, clean up the file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ error: error.message });
  }
};

exports.getCompteRendus = async (req, res) => {
  try {
    const compteRendus = await CompteRendu.findAll();
    res.status(200).json(compteRendus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCompteRenduById = async (req, res) => {
  try {
    const compteRendu = await CompteRendu.findByPk(req.params.id);
    if (!compteRendu) return res.status(404).send('CompteRendu not found');
    res.status(200).json(compteRendu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCompteRendu = async (req, res) => {
  try {
    const compteRendu = await CompteRendu.findByPk(req.params.id);
    if (!compteRendu) {
      // Clean up uploaded file if compteRendu not found
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: 'CompteRendu not found' });
    }

    const updateData = { ...req.body };
    
    // If new file was uploaded
    if (req.file) {
      // Delete old file if it exists
      if (compteRendu.filePath && fs.existsSync(compteRendu.filePath)) {
        fs.unlinkSync(compteRendu.filePath);
      }
      
      // Update with new file information
      updateData.filePath = req.file.path;
      updateData.fileName = req.file.originalname;
      updateData.fileSize = req.file.size;
      updateData.uploadedAt = new Date();
    }
    
    await compteRendu.update(updateData);
    res.status(200).json(compteRendu);
  } catch (error) {
    // Clean up uploaded file if update failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCompteRendu = async (req, res) => {
  try {
    const compteRendu = await CompteRendu.findByPk(req.params.id);
    if (!compteRendu) {
      return res.status(404).json({ error: 'CompteRendu not found' });
    }
    
    // Delete associated file if it exists
    if (compteRendu.filePath && fs.existsSync(compteRendu.filePath)) {
      fs.unlinkSync(compteRendu.filePath);
    }
    
    await compteRendu.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Download file
exports.downloadFile = async (req, res) => {
  try {
    const compteRendu = await CompteRendu.findByPk(req.params.id);
    if (!compteRendu) {
      return res.status(404).json({ error: 'CompteRendu not found' });
    }
    
    if (!compteRendu.filePath || !fs.existsSync(compteRendu.filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${compteRendu.fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream the file
    const fileStream = fs.createReadStream(compteRendu.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.acceptCompteRendu = async (req, res) => {
  try {
    const compteRendu = await CompteRendu.findByPk(req.params.id);
    if (!compteRendu) {
      return res.status(404).json({ error: 'Compte rendu not found' });
    }

    await compteRendu.update({ statut: 'Accepté' });
    res.status(200).json({ message: 'Compte rendu accepted successfully', compteRendu });
  } catch (error) {
    console.error('Error accepting compte rendu:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.refuseCompteRendu = async (req, res) => {
  try {
    const compteRendu = await CompteRendu.findByPk(req.params.id);
    if (!compteRendu) {
      return res.status(404).json({ error: 'Compte rendu not found' });
    }

    await compteRendu.update({ statut: 'Refusé' });
    res.status(200).json({ message: 'Compte rendu refused successfully', compteRendu });
  } catch (error) {
    console.error('Error refusing compte rendu:', error);
    res.status(400).json({ error: error.message });
  }
};