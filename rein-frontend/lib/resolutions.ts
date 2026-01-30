// API utilities for resolution management
export interface Resolution {
  id: string;
  userId: string;
  title: string;
  goal: string;
  roadmap: any;
  isPublic: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResolutionData {
  userId: string;
  title: string;
  goal: string;
  roadmap: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const resolutionAPI = {
  // Create a new resolution
  async create(data: CreateResolutionData): Promise<Resolution> {
    const response = await fetch(`${API_BASE_URL}/resolution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create resolution');
    }

    return response.json();
  },

  // Get all resolutions for a user
  async getAllByUser(userId: string): Promise<Resolution[]> {
    const response = await fetch(`${API_BASE_URL}/resolution/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch resolutions');
    }

    return response.json();
  },

  // Get a specific resolution
  async getById(id: string, userId?: string): Promise<Resolution> {
    const url = userId 
      ? `${API_BASE_URL}/resolution/${id}?userId=${userId}`
      : `${API_BASE_URL}/resolution/${id}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch resolution');
    }

    return response.json();
  },

  // Delete a resolution
  async delete(id: string, userId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/resolution/${id}?userId=${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete resolution');
    }

    return response.json();
  },

  // Toggle public status
  async togglePublic(id: string, userId: string, isPublic: boolean): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/resolution/${id}/public`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, isPublic }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle resolution visibility');
    }

    return response.json();
  },
};