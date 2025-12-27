import { query } from './db.js';

// Teams
export async function getTeams() {
  const result = await query('SELECT * FROM teams ORDER BY id');
  return result.rows;
}

export async function getTeamById(id) {
  const result = await query('SELECT * FROM teams WHERE id = $1', [id]);
  return result.rows[0] || null;
}

// Equipment Categories
export async function getEquipmentCategories() {
  const result = await query('SELECT * FROM equipment_categories ORDER BY id');
  return result.rows;
}

export async function getCategoryById(id) {
  const result = await query('SELECT * FROM equipment_categories WHERE id = $1', [id]);
  return result.rows[0] || null;
}

// Equipment
export async function getEquipment() {
  const result = await query('SELECT * FROM equipment ORDER BY id');
  return result.rows;
}

export async function getEquipmentById(id) {
  const result = await query('SELECT * FROM equipment WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getTotalAssets() {
  const result = await query(
    "SELECT COUNT(*) as count FROM equipment WHERE status != 'Scrap'"
  );
  return parseInt(result.rows[0].count);
}

// Maintenance Requests
export async function getRequests() {
  const result = await query('SELECT * FROM maintenance_requests ORDER BY created_date DESC');
  return result.rows;
}

export async function getRequestById(id) {
  const result = await query('SELECT * FROM maintenance_requests WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getRequestsByEquipmentId(equipmentId) {
  const result = await query(
    'SELECT * FROM maintenance_requests WHERE equipment_id = $1 ORDER BY created_date DESC',
    [equipmentId]
  );
  return result.rows;
}

export async function getOpenRequestsByEquipmentId(equipmentId) {
  const result = await query(
    `SELECT * FROM maintenance_requests 
     WHERE equipment_id = $1 
     AND stage NOT IN ('Repaired', 'Scrap')
     ORDER BY created_date DESC`,
    [equipmentId]
  );
  return result.rows;
}

export async function getRequestsByStage(stage) {
  const result = await query(
    'SELECT * FROM maintenance_requests WHERE stage = $1 ORDER BY scheduled_date',
    [stage]
  );
  return result.rows;
}

export async function getOpenRequests() {
  const result = await query(
    `SELECT * FROM maintenance_requests 
     WHERE stage NOT IN ('Repaired', 'Scrap')
     ORDER BY created_date DESC`
  );
  return result.rows;
}

export async function getPreventiveRequests() {
  const result = await query(
    "SELECT * FROM maintenance_requests WHERE type = 'Preventive' ORDER BY scheduled_date"
  );
  return result.rows;
}

export async function getOverdueRequests() {
  const result = await query(
    `SELECT * FROM maintenance_requests 
     WHERE stage NOT IN ('Repaired', 'Scrap')
     AND scheduled_date < CURRENT_DATE
     ORDER BY scheduled_date`
  );
  return result.rows;
}

export async function getRequestsByTeam() {
  const result = await query(
    `SELECT t.name, COUNT(mr.id) as count
     FROM teams t
     LEFT JOIN equipment e ON e.maintenance_team_id = t.id
     LEFT JOIN maintenance_requests mr ON mr.equipment_id = e.id
     GROUP BY t.id, t.name
     ORDER BY count DESC`
  );
  return result.rows.reduce((acc, row) => {
    acc[row.name] = parseInt(row.count);
    return acc;
  }, {});
}

export async function getRequestsByCategory() {
  const result = await query(
    `SELECT ec.name, COUNT(mr.id) as count
     FROM equipment_categories ec
     LEFT JOIN equipment e ON e.category_id = ec.id
     LEFT JOIN maintenance_requests mr ON mr.equipment_id = e.id
     GROUP BY ec.id, ec.name
     ORDER BY count DESC`
  );
  return result.rows.reduce((acc, row) => {
    acc[row.name] = parseInt(row.count);
    return acc;
  }, {});
}

// Create/Update operations
export async function createMaintenanceRequest(requestData) {
  const {
    subject,
    equipment_id,
    type,
    scheduled_date,
    priority,
    assignee,
    description,
    stage = 'New',
  } = requestData;

  const result = await query(
    `INSERT INTO maintenance_requests 
     (subject, equipment_id, type, scheduled_date, priority, assignee, description, stage, created_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE)
     RETURNING *`,
    [subject, equipment_id, type, scheduled_date, priority, assignee || null, description || null, stage]
  );
  return result.rows[0];
}

export async function updateMaintenanceRequest(id, updates) {
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
    return getRequestById(id);
  }

  values.push(id);
  const result = await query(
    `UPDATE maintenance_requests 
     SET ${fields.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function updateEquipmentStatus(id, status) {
  const result = await query(
    'UPDATE equipment SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
}

