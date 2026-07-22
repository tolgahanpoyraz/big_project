import { request, putImage } from './client';
import type {
  AuthResponse,
  ChangePasswordResponse,
  MeResponse,
  MessageResponse,
  UploadUrlResponse,
} from './types';

export function register(displayName: string, email: string, password: string) {
  return request<MessageResponse>('/auth/register', {
    method: 'POST',
    body: { displayName, email, password },
  });
}

export function login(email: string, password: string) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function getMe() {
  return request<MeResponse>('/auth/me', { auth: true });
}

export function resendVerification(email: string) {
  return request<MessageResponse>('/auth/resend-verification', {
    method: 'POST',
    body: { email },
  });
}

export function forgotPassword(email: string) {
  return request<MessageResponse>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

export function resetPassword(token: string, password: string) {
  return request<MessageResponse>('/auth/reset-password', {
    method: 'POST',
    body: { token, password },
  });
}

export function changePassword(currentPassword: string, newPassword: string) {
  return request<ChangePasswordResponse>('/auth/change-password', {
    method: 'POST',
    auth: true,
    body: { currentPassword, newPassword },
  });
}

// Two-step avatar upload: get a presigned URL, PUT the bytes to S3, then confirm.
export async function uploadAvatar(file: Blob): Promise<MeResponse> {
  const { url } = await request<UploadUrlResponse>('/auth/me/avatar-upload-url', { auth: true });
  await putImage(url, file);
  return request<MeResponse>('/auth/me/avatar', { method: 'POST', auth: true });
}
