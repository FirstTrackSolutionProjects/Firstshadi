// src/services/profileService.js
import { api } from './api';

export const profileService = {
  // Get profile
  async getProfile() {
    return await api.get('/profiles/me');
  },

  // Create profile
  async createProfile(data) {
    return await api.post('/profiles', data);
  },

  // Update profile
  async updateProfile(data) {
    return await api.put('/profiles', data);
  },

  // Upload photos
  async uploadPhotos(files) {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('photos', file);
    });
    return await api.upload('/profiles/photos', formData);
  },

  // Search profiles
  async searchProfiles(filters) {
    const queryParams = new URLSearchParams(filters).toString();
    return await api.get(`/profiles/search?${queryParams}`);
  },

  // Get matches
  async getMatches(filters) {
    const queryParams = new URLSearchParams(filters).toString();
    return await api.get(`/profiles/matches?${queryParams}`);
  },

  // Get profile by UUID
  async getProfileByUuid(uuid) {
    return await api.get(`/profiles/user/${uuid}`);
  },

  // Delete profile
  async deleteProfile() {
    return await api.delete('/profiles');
  }
};