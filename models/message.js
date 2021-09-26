'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'channel',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  reactions: [
    {
      type: String,
    },
  ],
  created: {
    type: Date,
    default: Date.now(),
  },
  updated: {
    type: Date,
  },
});

// static methods

// instance methods
MessageSchema.methods.serialize = function serialize() {
  return {
    id: this._id,
    content: this.content,
    channel: this.channel,
    user: this.user,
    reactions: this.reactions || null,
    created: this.created,
    updated: this.updated || null,
  };
};

const Message = mongoose.model('Message', MessageSchema);

module.exports = {
  MessageSchema,
  Message,
};
