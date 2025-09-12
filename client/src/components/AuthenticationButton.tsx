// src/components/AuthenticationButton.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';

export const AuthenticationButton = () => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};