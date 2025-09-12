// src/components/LogoutButton.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from './ui/button';

export const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      variant="destructive"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log Out
    </Button>
  );
};