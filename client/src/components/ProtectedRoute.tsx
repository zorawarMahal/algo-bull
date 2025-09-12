import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

// This component is a wrapper around any component that should be protected.
// It uses Auth0's `withAuthenticationRequired` higher-order component.
// This HOC automatically handles the following:
// 1. If the user is authenticated, it renders the component you want to protect.
// 2. If the user is NOT authenticated, it redirects them to the login page.
// 3. While the authentication status is loading, it shows a custom loading component.
export const ProtectedRoute = ({ component }: { component: React.ComponentType }) => {
  const Component = withAuthenticationRequired(component, {
    // While the SDK is checking for a session, show this loading message.
    onRedirecting: () => (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    ),
  });

  return <Component />;
};