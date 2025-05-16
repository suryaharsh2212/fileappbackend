// src/Controllers/routes.js
import { Router } from "express";
import Channel from "../Database/channelSchema.js";
import mongoose from 'mongoose';

function createRouter(io) {
  const router = Router();

  router.post('/send-message', async (req, res) => {
    const { channelId, message, sender } = req.body;

    if (!channelId || !message || !sender) {
      return res.status(400).json({ error: 'channelId, message, and sender are required.' });
    }

    try {
      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ error: 'Channel not found.' });
      }

      const newMessage = {
        sender,
        text: message,
        createdAt: new Date()
      };

      channel.messages.push(newMessage);
      await channel.save();

      io.to(channelId).emit('newMessage', {
        channelId,
        message,
        sender,
        timestamp: newMessage.createdAt
      });

      res.status(200).json({ success: true, message: 'Message sent and stored.' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

  router.post('/join-channel', async (req, res) => {
    const { channelId, userId, passkey } = req.body;

    if (!channelId || !userId || !passkey) {
      return res.status(400).json({ error: 'channelId, userId, and passkey are required.' });
    }

    try {
      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ error: 'Channel not found.' });
      }

      if (channel.passkey !== passkey) {
        return res.status(403).json({ error: 'Invalid passkey.' });
      }

      if (!channel.members.includes(userId)) {
        channel.members.push(userId);
        await channel.save();
      }

      io.to(channelId).emit('userJoined', { channelId, userId });

      res.status(200).json({
        success: true,
        message: 'User joined channel.',
        channel: {
          id: channel._id,
          name: channel.name,
          members: channel.members,
        }
      });
    } catch (error) {
      console.error('Error joining channel:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

  router.post('/create', async (req, res) => {
    try {
      const { name, passkey, userId } = req.body;

      if (!name || !passkey || !userId) {
        return res.status(400).json({ message: 'Name, passkey, and userId are required.' });
      }

      const channel = new Channel({
        name,
        createdBy: mongoose.Types.ObjectId(userId),
        members: [mongoose.Types.ObjectId(userId)],
        passkey
      });

      await channel.save();

      res.status(201).json({ message: 'Channel created successfully', channel });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  return router;
}

export default createRouter;
