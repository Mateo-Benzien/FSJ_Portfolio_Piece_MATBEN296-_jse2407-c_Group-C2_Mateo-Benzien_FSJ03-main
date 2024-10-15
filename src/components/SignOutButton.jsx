// src/components/SignOutButton.jsx
import { useContext } from 'react';
import { logout } from '../lib/auth';
import { AuthContext } from '../context/AuthContext';

const SignOutButton = () => {
  const { user } = useContext(AuthContext);

  const handleSignOut = async () => {
    await logout();
  };

  if (!user) return null; // Don't show button if not signed in

  return (
    <button onClick={handleSignOut}>Sign Out</button>
  );
};

export default SignOutButton;
