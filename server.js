import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please create a .env file with DATABASE_URL=your_connection_string');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Teams endpoints
app.get('/api/teams', async (req, res) => {
  try {
    const result = await query('SELECT * FROM teams ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/teams/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM teams WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: error.message });
  }
});

// Equipment Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const result = await query('SELECT * FROM equipment_categories ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM equipment_categories WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: error.message });
  }
});

// Equipment endpoints
app.get('/api/equipment', async (req, res) => {
  try {
    const result = await query('SELECT * FROM equipment ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/equipment/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM equipment WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/equipment/stats/total', async (req, res) => {
  try {
    const result = await query(
      "SELECT COUNT(*) as count FROM equipment WHERE status != 'Scrap'"
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Error fetching total assets:', error);
    res.status(500).json({ error: error.message });
  }
});

// Maintenance Requests endpoints
app.get('/api/requests', async (req, res) => {
  try {
    const equipmentFilter = req.query.equipment;
    let queryText = 'SELECT * FROM maintenance_requests ORDER BY created_date DESC';
    let params = [];

    if (equipmentFilter) {
      queryText = 'SELECT * FROM maintenance_requests WHERE equipment_id = $1 ORDER BY created_date DESC';
      params = [equipmentFilter];
    }

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/requests/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM maintenance_requests WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/requests/equipment/:equipmentId', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM maintenance_requests WHERE equipment_id = $1 ORDER BY created_date DESC',
      [req.params.equipmentId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching requests by equipment:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/requests/equipment/:equipmentId/open', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM maintenance_requests 
       WHERE equipment_id = $1 
       AND stage NOT IN ('Repaired', 'Scrap')
       ORDER BY created_date DESC`,
      [req.params.equipmentId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching open requests:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/requests/stage/:stage', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM maintenance_requests WHERE stage = $1 ORDER BY scheduled_date',
      [req.params.stage]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching requests by stage:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/requests/open', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM maintenance_requests 
       WHERE stage NOT IN ('Repaired', 'Scrap')
       ORDER BY created_date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching open requests:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/requests/preventive', async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM maintenance_requests WHERE type = 'Preventive' ORDER BY scheduled_date"
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching preventive requests:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/requests/overdue', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM maintenance_requests 
       WHERE stage NOT IN ('Repaired', 'Scrap')
       AND scheduled_date < CURRENT_DATE
       ORDER BY scheduled_date`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching overdue requests:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/requests/stats/by-team', async (req, res) => {
  try {
    const result = await query(
      `SELECT t.name, COUNT(mr.id) as count
       FROM teams t
       LEFT JOIN equipment e ON e.maintenance_team_id = t.id
       LEFT JOIN maintenance_requests mr ON mr.equipment_id = e.id
       GROUP BY t.id, t.name
       ORDER BY count DESC`
    );
    const stats = result.rows.reduce((acc, row) => {
      acc[row.name] = parseInt(row.count);
      return acc;
    }, {});
    res.json(stats);
  } catch (error) {
    console.error('Error fetching requests by team:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/requests/stats/by-category', async (req, res) => {
  try {
    const result = await query(
      `SELECT ec.name, COUNT(mr.id) as count
       FROM equipment_categories ec
       LEFT JOIN equipment e ON e.category_id = ec.id
       LEFT JOIN maintenance_requests mr ON mr.equipment_id = e.id
       GROUP BY ec.id, ec.name
       ORDER BY count DESC`
    );
    const stats = result.rows.reduce((acc, row) => {
      acc[row.name] = parseInt(row.count);
      return acc;
    }, {});
    res.json(stats);
  } catch (error) {
    console.error('Error fetching requests by category:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create maintenance request
app.post('/api/requests', async (req, res) => {
  try {
    const {
      subject,
      equipment_id,
      type,
      scheduled_date,
      priority,
      assignee,
      description,
      stage = 'New',
    } = req.body;

    const result = await query(
      `INSERT INTO maintenance_requests 
       (subject, equipment_id, type, scheduled_date, priority, assignee, description, stage, created_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE)
       RETURNING *`,
      [subject, equipment_id, type, scheduled_date, priority, assignee || null, description || null, stage]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update maintenance request
app.patch('/api/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      const result = await query('SELECT * FROM maintenance_requests WHERE id = $1', [id]);
      return res.json(result.rows[0]);
    }

    values.push(id);
    const result = await query(
      `UPDATE maintenance_requests 
       SET ${fields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update equipment status
app.patch('/api/equipment/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await query(
      'UPDATE equipment SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating equipment status:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

