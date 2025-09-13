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
  profile_uuid: {
      type: String,
      required: true,
  },
  profile_label: {
      type: String,
      default: null,
  }
});

const UserBroswer = mongoose.model('UserBroswer', UserBroswerSchema);
export default UserBroswer;
