import mongoose from 'mongoose';

const UserBroswerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  broswer_id: {
      type: String,
      required: true,
  },
  broswer_name: {
      type: String,
      default: null,
  },
  emergency_action: {
      type: Boolean,
      default: false,
  },
});

const UserBroswer = mongoose.model('UserBroswer', UserBroswerSchema);
export default UserBroswer;
