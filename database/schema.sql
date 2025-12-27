-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS maintenance_requests CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS equipment_categories CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- Create Teams table
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Equipment Categories table
CREATE TABLE equipment_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Equipment table
CREATE TABLE equipment (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  serial_number VARCHAR(255) UNIQUE,
  purchase_date DATE,
  warranty_info TEXT,
  location VARCHAR(255),
  department VARCHAR(255),
  assigned_employee VARCHAR(255),
  maintenance_team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  category_id INTEGER REFERENCES equipment_categories(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Scrap', 'Maintenance')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Maintenance Requests table
CREATE TABLE maintenance_requests (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Corrective', 'Preventive')),
  equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  duration DECIMAL(10, 2),
  stage VARCHAR(50) DEFAULT 'New' CHECK (stage IN ('New', 'In Progress', 'Repaired', 'Scrap')),
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  assignee VARCHAR(255),
  created_date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_equipment_team ON equipment(maintenance_team_id);
CREATE INDEX idx_equipment_category ON equipment(category_id);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_serial ON equipment(serial_number);
CREATE INDEX idx_requests_equipment ON maintenance_requests(equipment_id);
CREATE INDEX idx_requests_stage ON maintenance_requests(stage);
CREATE INDEX idx_requests_scheduled_date ON maintenance_requests(scheduled_date);
CREATE INDEX idx_requests_type ON maintenance_requests(type);
CREATE INDEX idx_requests_priority ON maintenance_requests(priority);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON equipment_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON maintenance_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data (teams)
INSERT INTO teams (id, name, description) VALUES
  (1, 'Mechanics', 'Mechanical maintenance team'),
  (2, 'Electricians', 'Electrical maintenance team'),
  (3, 'IT Support', 'IT equipment maintenance team'),
  (4, 'HVAC', 'Heating, ventilation, and air conditioning team'),
  (5, 'General Maintenance', 'General facility maintenance')
ON CONFLICT (id) DO NOTHING;

-- Insert initial data (equipment categories)
INSERT INTO equipment_categories (id, name, description) VALUES
  (1, 'Machinery', 'Production machinery and equipment'),
  (2, 'Vehicles', 'Company vehicles and transportation'),
  (3, 'IT Equipment', 'Computers, servers, and IT infrastructure'),
  (4, 'HVAC Systems', 'Heating and cooling systems'),
  (5, 'Tools', 'Hand tools and power tools')
ON CONFLICT (id) DO NOTHING;

-- Insert initial data (equipment) - Updated with current dates
INSERT INTO equipment (id, name, serial_number, purchase_date, warranty_info, location, department, assigned_employee, maintenance_team_id, category_id, status) VALUES
  (1, 'CNC Milling Machine #1', 'CNC-2023-001', '2023-01-15', '2 years warranty, expires 2025-01-15', 'Production Floor A', 'Manufacturing', 'John Smith', 1, 1, 'Active'),
  (2, 'Forklift Truck #3', 'FL-2022-003', '2022-06-20', '3 years warranty, expires 2025-06-20', 'Warehouse', 'Logistics', 'Mike Johnson', 1, 2, 'Active'),
  (3, 'Server Rack Unit A', 'SRV-2023-101', '2023-03-10', '5 years warranty, expires 2028-03-10', 'Server Room', 'IT', 'Sarah Williams', 3, 3, 'Active'),
  (4, 'HVAC Unit - Main Building', 'HVAC-2021-050', '2021-08-05', 'Warranty expired', 'Main Building - Roof', 'Facilities', 'Tom Brown', 4, 4, 'Active'),
  (5, 'Drill Press Station 2', 'DP-2020-002', '2020-11-12', 'Warranty expired', 'Workshop B', 'Manufacturing', 'John Smith', 1, 5, 'Scrap'),
  (6, 'Delivery Van #2', 'VAN-2022-002', '2022-04-18', '3 years warranty, expires 2025-04-18', 'Parking Lot', 'Logistics', 'Mike Johnson', 1, 2, 'Active'),
  (7, 'Network Switch - Floor 2', 'NSW-2023-201', '2023-05-22', '3 years warranty, expires 2026-05-22', 'IT Closet - Floor 2', 'IT', 'Sarah Williams', 3, 3, 'Active'),
  (8, 'Air Compressor Unit', 'AC-2021-015', '2021-09-30', 'Warranty expired', 'Workshop A', 'Manufacturing', 'John Smith', 1, 1, 'Active')
ON CONFLICT (id) DO NOTHING;

-- Insert initial data (maintenance requests) - Updated with current dates
INSERT INTO maintenance_requests (id, subject, type, equipment_id, scheduled_date, duration, stage, priority, assignee, created_date, description) VALUES
  (1, 'CNC Machine - Unusual Noise', 'Corrective', 1, CURRENT_DATE + INTERVAL '2 days', NULL, 'In Progress', 'High', 'John Smith', CURRENT_DATE, 'CNC milling machine making unusual grinding noise during operation. Needs immediate inspection.'),
  (2, 'Forklift - Monthly Inspection', 'Preventive', 2, CURRENT_DATE + INTERVAL '7 days', NULL, 'New', 'Medium', 'Mike Johnson', CURRENT_DATE - INTERVAL '3 days', 'Monthly preventive maintenance check for forklift truck #3. Check hydraulic system, brakes, and battery.'),
  (3, 'Server Rack - Overheating Alert', 'Corrective', 3, CURRENT_DATE - INTERVAL '1 day', 2.5, 'Repaired', 'High', 'Sarah Williams', CURRENT_DATE - INTERVAL '1 day', 'Server rack showing overheating warnings. Temperature sensors reading above normal.'),
  (4, 'HVAC - Quarterly Service', 'Preventive', 4, CURRENT_DATE + INTERVAL '14 days', NULL, 'New', 'Low', 'Tom Brown', CURRENT_DATE - INTERVAL '10 days', 'Quarterly preventive maintenance: filter replacement, coil cleaning, and system check.'),
  (5, 'Drill Press - Motor Failure', 'Corrective', 5, CURRENT_DATE - INTERVAL '10 days', NULL, 'Scrap', 'High', 'John Smith', CURRENT_DATE - INTERVAL '12 days', 'Drill press motor completely failed. Repair cost exceeds replacement value. Equipment marked for scrap.'),
  (6, 'Delivery Van - Oil Change', 'Preventive', 6, CURRENT_DATE + INTERVAL '3 days', NULL, 'In Progress', 'Medium', 'Mike Johnson', CURRENT_DATE - INTERVAL '1 day', 'Scheduled oil change and tire rotation for delivery van #2.'),
  (7, 'Network Switch - Port Malfunction', 'Corrective', 7, CURRENT_DATE + INTERVAL '1 day', NULL, 'New', 'High', 'Sarah Williams', CURRENT_DATE, 'Port 8 on network switch not responding. Multiple devices unable to connect.'),
  (8, 'Air Compressor - Pressure Drop', 'Corrective', 8, CURRENT_DATE - INTERVAL '2 days', 3.0, 'Repaired', 'Medium', 'John Smith', CURRENT_DATE - INTERVAL '3 days', 'Air compressor not maintaining pressure. Suspected leak in the system.'),
  (9, 'CNC Machine - Weekly Calibration', 'Preventive', 1, CURRENT_DATE + INTERVAL '9 days', NULL, 'New', 'Low', 'John Smith', CURRENT_DATE - INTERVAL '5 days', 'Weekly calibration check for CNC milling machine to ensure precision.'),
  (10, 'HVAC - Filter Replacement', 'Preventive', 4, CURRENT_DATE + INTERVAL '11 days', NULL, 'New', 'Low', 'Tom Brown', CURRENT_DATE - INTERVAL '8 days', 'Monthly filter replacement for main building HVAC unit.')
ON CONFLICT (id) DO NOTHING;

-- Reset sequences to avoid conflicts
SELECT setval('teams_id_seq', (SELECT MAX(id) FROM teams));
SELECT setval('equipment_categories_id_seq', (SELECT MAX(id) FROM equipment_categories));
SELECT setval('equipment_id_seq', (SELECT MAX(id) FROM equipment));
SELECT setval('maintenance_requests_id_seq', (SELECT MAX(id) FROM maintenance_requests));
