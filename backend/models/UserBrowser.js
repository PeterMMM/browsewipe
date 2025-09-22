import mongoose from 'mongoose';

const UserBrowserSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  browser_id: {
      type: String,
      required: true,
  },
  browser_name: {
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

const UserBrowser = mongoose.model('UserBrowser', UserBrowserSchema);
export default UserBrowser;
