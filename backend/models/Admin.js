import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema({
  email: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true
  },
  status: {
      type: Boolean,
      default: true,
  },
  role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
  },
  is_super_admin: {
      type: Boolean,
      default: false
  },
});

AdminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
