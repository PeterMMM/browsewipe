import mongoose from 'mongoose';

const permissionSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;
