const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Teams
export async function getTeams() {
  return fetchAPI('/teams');
}

export async function getTeamById(id) {
  return fetchAPI(`/teams/${id}`);
}

// Equipment Categories
export async function getEquipmentCategories() {
  return fetchAPI('/categories');
}

export async function getCategoryById(id) {
  return fetchAPI(`/categories/${id}`);
}

// Equipment
export async function getEquipment() {
  return fetchAPI('/equipment');
}

export async function getEquipmentById(id) {
  return fetchAPI(`/equipment/${id}`);
}

export async function getTotalAssets() {
  const result = await fetchAPI('/equipment/stats/total');
  return result.count;
}

// Maintenance Requests
export async function getRequests(equipmentFilter = null) {
  const url = equipmentFilter ? `/requests?equipment=${equipmentFilter}` : '/requests';
  return fetchAPI(url);
}

export async function getRequestById(id) {
  return fetchAPI(`/requests/${id}`);
}

export async function getRequestsByEquipmentId(equipmentId) {
  return fetchAPI(`/requests/equipment/${equipmentId}`);
}

export async function getOpenRequestsByEquipmentId(equipmentId) {
  return fetchAPI(`/requests/equipment/${equipmentId}/open`);
}

export async function getRequestsByStage(stage) {
  return fetchAPI(`/requests/stage/${stage}`);
}

export async function getOpenRequests() {
  return fetchAPI('/requests/open');
}

export async function getPreventiveRequests() {
  return fetchAPI('/requests/preventive');
}

export async function getOverdueRequests() {
  return fetchAPI('/requests/overdue');
}

export async function getRequestsByTeam() {
  return fetchAPI('/requests/stats/by-team');
}

export async function getRequestsByCategory() {
  return fetchAPI('/requests/stats/by-category');
}

// Create/Update operations
export async function createMaintenanceRequest(requestData) {
  return fetchAPI('/requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
}

export async function updateMaintenanceRequest(id, updates) {
  return fetchAPI(`/requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function updateEquipmentStatus(id, status) {
  return fetchAPI(`/equipment/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

