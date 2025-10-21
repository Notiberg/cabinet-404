// Simple in-memory storage for shared data
let sharedData = {
  tasks: [],
  metalTracking: [],
  workClosures: [],
  documentTracking: []
};

// Helper function to generate IDs
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export default function handler(req, res) {
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
        return res.status(201).json(newItem);

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

        return res.status(200).json(sharedData[type][itemIndex]);

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
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
