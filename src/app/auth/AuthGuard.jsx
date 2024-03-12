import useAuth from 'app/hooks/useAuth';
import jwt from 'jsonwebtoken';

import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  let authenticated = false;
  const storedToken = localStorage.getItem('accessToken');
  //import jwt from 'jsonwebtoken';
  const decodedToken = jwt.decode(storedToken);

  let { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  console.log('Is Authenticated:', isAuthenticated);

  if (storedToken) {
    authenticated = true;
    console.log('Hay un token', decodedToken);
    console.log('authenticated token', authenticated);
  }

  return (
    <>
      {storedToken ? (
        children
      ) : (
        <Navigate replace to="/session/signin" state={{ from: pathname }} />
      )}
    </>
  );
};

export default AuthGuard;
