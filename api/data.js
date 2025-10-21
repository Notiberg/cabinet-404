const fs = require('fs');
const path = require('path');

// Path to store data (Vercel provides /tmp directory)
const DATA_FILE = '/tmp/cabinet-404-data.json';

// Initialize data structure
const defaultData = {
  tasks: [],
  metalTracking: [],
  workClosures: [],
  documentTracking: []
};

// Load data from file or create default
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return { ...defaultData };
}

// Save data to file
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
}

// Helper function to generate IDs
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, query, body } = req;
  const { type, id } = query;

  // Validate type
  if (!['tasks', 'metalTracking', 'workClosures', 'documentTracking'].includes(type)) {
    return res.status(400).json({ error: 'Invalid data type' });
  }

  // Load current data
  const sharedData = loadData();

  try {
    switch (method) {
      case 'GET':
        // Get all items of specified type
        return res.status(200).json(sharedData[type] || []);

      case 'POST':
        // Add new item
        const newItem = {
          ...body,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        if (!sharedData[type]) {
          sharedData[type] = [];
        }
        
        sharedData[type].push(newItem);
        
        // Save updated data
        if (saveData(sharedData)) {
          return res.status(201).json(newItem);
        } else {
          return res.status(500).json({ error: 'Failed to save data' });
        }

      case 'PUT':
        // Update existing item
        if (!id) {
          return res.status(400).json({ error: 'ID is required for update' });
        }

        const itemIndex = sharedData[type].findIndex(item => item.id === id);
        if (itemIndex === -1) {
          return res.status(404).json({ error: 'Item not found' });
        }

        sharedData[type][itemIndex] = {
          ...sharedData[type][itemIndex],
          ...body,
          updatedAt: new Date().toISOString()
        };

        // Save updated data
        if (saveData(sharedData)) {
          return res.status(200).json(sharedData[type][itemIndex]);
        } else {
          return res.status(500).json({ error: 'Failed to save data' });
        }

      case 'DELETE':
        // Delete item
        if (!id) {
          return res.status(400).json({ error: 'ID is required for delete' });
        }

        const deleteIndex = sharedData[type].findIndex(item => item.id === id);
        if (deleteIndex === -1) {
          return res.status(404).json({ error: 'Item not found' });
        }

        sharedData[type].splice(deleteIndex, 1);
        
        // Save updated data
        if (saveData(sharedData)) {
          return res.status(204).end();
        } else {
          return res.status(500).json({ error: 'Failed to save data' });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
