import Message from '../models/Message.js';
import Connection from '../models/Connection.js';
import Notification from '../models/Notification.js';
import { pool } from '../config/database.js';

// Send message
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { connectionId, message } = req.body;

    if (!connectionId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Connection ID and message are required'
      });
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    if (connection.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot send message. Connection is not accepted yet.'
      });
    }

    // Determine receiver
    const receiverId = connection.from_user_id === senderId 
      ? connection.to_user_id 
      : connection.from_user_id;

    const newMessage = await Message.create(
      connectionId,
      senderId,
      receiverId,
      message
    );

    // Create notification for receiver
    await Notification.create(
      receiverId,
      'new_message',
      'New Message',
      `${req.user.name} sent you a message`,
      { connection_id: connectionId, message_id: newMessage.id }
    );

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Get messages for connection
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { connectionId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    if (connection.from_user_id !== userId && connection.to_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view these messages'
      });
    }

    const messages = await Message.getForConnection(
      connectionId,
      parseInt(limit),
      parseInt(offset)
    );

    // Mark messages as read
    await Message.markAllAsRead(connectionId, userId);

    return res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get messages'
    });
  }
};

// Get conversations
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Message.getConversations(userId);

    return res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get conversations'
    });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Message.getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      data: { unread_count: count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.receiver_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this message'
      });
    }

    const updated = await Message.markAsRead(messageId);

    return res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: updated
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark message as read'
    });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.sender_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    await Message.delete(messageId);

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
};