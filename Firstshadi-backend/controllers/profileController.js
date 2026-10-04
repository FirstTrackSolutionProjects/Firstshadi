import Profile from '../models/Profile.js';
import User from '../models/User.js';
import Connection from '../models/Connection.js';
import Notification from '../models/Notification.js';

// Create or update profile
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    // Check if profile exists
    let existingProfile = await Profile.findByUserId(userId);
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'Profile already exists. Use update endpoint instead.'
      });
    }

    // Create profile
    const profile = await Profile.create({
      user_id: userId,
      ...profileData
    });

    // Update user with profile_for if provided
    if (profileData.profile_for) {
      await User.update(userId, { profile_for: profileData.profile_for });
    }

    return res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: profile
    });
  } catch (error) {
    console.error('Create profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create profile'
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    const existingProfile = await Profile.findByUserId(userId);
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create a profile first.'
      });
    }

    const updatedProfile = await Profile.update(existingProfile.id, profileData);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Get my profile
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.findByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

// Get profile by user UUID
export const getProfileByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await User.findByUuid(uuid);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const profile = await Profile.findByUserId(user.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Check if there's a connection between current user and profile owner
    let connection = null;
    if (req.user.id !== user.id) {
      connection = await Connection.getConnectionBetween(req.user.id, user.id);
    }

    return res.status(200).json({
      success: true,
      data: {
        ...profile,
        connection_status: connection ? connection.status : null
      }
    });
  } catch (error) {
    console.error('Get profile by UUID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

// Search profiles
export const searchProfiles = async (req, res) => {
  try {
    const filters = req.query;
    const userId = req.user.id;

    // Don't return current user's profile
    const results = await Profile.search(filters);
    results.data = results.data.filter(p => p.user_id !== userId);

    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Search profiles error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search profiles'
    });
  }
};

// Get matches for current user
export const getMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = req.query;

    const results = await Profile.getMatches(userId, filters);

    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Get matches error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get matches'
    });
  }
};

// Upload profile photos
export const uploadPhotos = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No photos uploaded'
      });
    }

    const profile = await Profile.findByUserId(userId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Get existing photos
    const existingPhotos = profile.profile_photos || [];
    
    // Add new photos
    const photoUrls = files.map(file => `/uploads/${file.filename}`);
    const allPhotos = [...existingPhotos, ...photoUrls];

    // Update profile with new photos
    const updatedProfile = await Profile.update(profile.id, {
      profile_photos: allPhotos
    });

    return res.status(200).json({
      success: true,
      message: 'Photos uploaded successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Upload photos error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload photos'
    });
  }
};

// Delete profile photo
export const deletePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { photoIndex } = req.params;

    const profile = await Profile.findByUserId(userId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const photos = profile.profile_photos || [];
    const index = parseInt(photoIndex);
    
    if (index < 0 || index >= photos.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid photo index'
      });
    }

    photos.splice(index, 1);
    const updatedProfile = await Profile.update(profile.id, {
      profile_photos: photos
    });

    return res.status(200).json({
      success: true,
      message: 'Photo deleted successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Delete photo error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete photo'
    });
  }
};

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findByUserId(userId);
    if (profile) {
      await Profile.delete(profile.id);
    }

    await User.delete(userId);

    return res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete profile'
    });
  }
};