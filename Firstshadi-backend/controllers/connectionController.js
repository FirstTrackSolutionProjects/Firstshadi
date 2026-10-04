import Connection from '../models/Connection.js';
import Notification from '../models/Notification.js';
import { pool } from '../config/database.js';

// Send connection request
export const sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId, message } = req.body;

    if (!toUserId) {
      return res.status(400).json({
        success: false,
        message: 'Target user ID is required'
      });
    }

    // Get target user
    const [users] = await pool.query('SELECT id FROM users WHERE uuid = ?', [toUserId]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const targetUserId = users[0].id;

    // Check if already connected
    const existing = await Connection.getConnectionBetween(fromUserId, targetUserId);
    if (existing) {
      if (existing.status === 'pending') {
        return res.status(409).json({
          success: false,
          message: 'Request already sent',
          data: existing
        });
      }
      if (existing.status === 'accepted') {
        return res.status(409).json({
          success: false,
          message: 'Already connected'
        });
      }
      if (existing.status === 'blocked') {
        return res.status(403).json({
          success: false,
          message: 'Cannot send request to this user'
        });
      }
    }

    const connection = await Connection.create(fromUserId, targetUserId, message);

    // Create notification for target user
    await Notification.create(
      targetUserId,
      'connection_request',
      'New Connection Request',
      `${req.user.name} sent you a connection request`,
      { connection_id: connection.id, from_user: req.user.name }
    );

    return res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: connection
    });
  } catch (error) {
    console.error('Send request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send connection request'
    });
  }
};

// Accept connection request
export const acceptRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Check if user is the receiver
    if (connection.to_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to accept this request'
      });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${connection.status}`
      });
    }

    const updated = await Connection.updateStatus(connectionId, 'accepted');

    // Create notification for sender
    await Notification.create(
      connection.from_user_id,
      'connection_accepted',
      'Connection Request Accepted',
      `${req.user.name} accepted your connection request`,
      { connection_id: connectionId }
    );

    return res.status(200).json({
      success: true,
      message: 'Connection request accepted',
      data: updated
    });
  } catch (error) {
    console.error('Accept request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to accept connection request'
    });
  }
};

// Decline connection request
export const declineRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    if (connection.to_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to decline this request'
      });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is already processed'
      });
    }

    const updated = await Connection.updateStatus(connectionId, 'declined');

    return res.status(200).json({
      success: true,
      message: 'Connection request declined',
      data: updated
    });
  } catch (error) {
    console.error('Decline request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to decline connection request'
    });
  }
};

// Get received requests
export const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await Connection.getReceivedRequests(userId);

    return res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get received requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get requests'
    });
  }
};

// Get sent requests
export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await Connection.getSentRequests(userId);

    return res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get sent requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get sent requests'
    });
  }
};

// Get accepted connections
export const getAcceptedConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    const connections = await Connection.getAcceptedConnections(userId);

    return res.status(200).json({
      success: true,
      data: connections
    });
  } catch (error) {
    console.error('Get accepted connections error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get connections'
    });
  }
};

// Block user
export const blockUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.params;

    const [users] = await pool.query('SELECT id FROM users WHERE uuid = ?', [targetUserId]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const targetId = users[0].id;

    let connection = await Connection.getConnectionBetween(userId, targetId);
    if (!connection) {
      connection = await Connection.create(userId, targetId);
    }

    const updated = await Connection.updateStatus(connection.id, 'blocked');

    return res.status(200).json({
      success: true,
      message: 'User blocked successfully',
      data: updated
    });
  } catch (error) {
    console.error('Block user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to block user'
    });
  }
};