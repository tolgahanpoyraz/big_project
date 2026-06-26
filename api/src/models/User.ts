import { Schema, model, type Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    email: string,
    password: string,
    verified?: boolean,
    verificationToken?: string,
    verificationTokenExpires?: Date,
    resetToken?: string,
    resetTokenExpires?: Date,
}

interface IUserMethods {
    comparePassword(candidate: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, select: false },
        verified: { type: Boolean, default: false },
        verificationToken: { type: String, select: false },
        verificationTokenExpires: { type: Date, select: false },
        resetToken: { type: String, select: false },
        resetTokenExpires: { type: Date, select: false },
    }
)

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser, UserModel>('User', userSchema);

