import mongoose from 'mongoose';

const roleSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);

export default Role;
