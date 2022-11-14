import { IConversationDTO } from "../dtos/conversation.dto";
import mongoose, { Types } from 'mongoose';
const { Schema, model } = mongoose;

const conversationSchema = new Schema<IConversationDTO>({
    name: {
        type: String,
        default: '',
    },
    members: [{ 
        type: mongoose.Types.ObjectId
    }],
    avatar: {
        type: String,
        default: '',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: Schema.Types.ObjectId
    }
});

export default model('conversations', conversationSchema);
  