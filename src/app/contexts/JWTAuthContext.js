import React, { createContext, useEffect, useReducer } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios.js';
import { MatxLoading } from 'app/components';

const initialState = {
  isAuthenticated: false,
  isInitialised: false,
  usuario: null,
};

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decodedToken = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      const { isAuthenticated, usuario } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        usuario,
      };
    }
    case 'LOGIN': {
      const { usuario } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        usuario,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        usuario: null,
      };
    }

    default: {
      return { ...state };
    }
  }
};

export const AuthContext = createContext({
  ...initialState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => {},
  register: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (usuarioCorreo, clave) => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/usuarios/login', {
        usuarioCorreo,
        clave,
      });

      console.log(response);

      const { token, usuario } = response.data; //accessToken  asi se llamaba en la otra api en spring boot

      setSession(token);

      dispatch({
        type: 'LOGIN',
        payload: {
          usuario,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error en la autenticación:', error);
      return { success: false, error };
    }
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('accessToken'); // Agregar esta línea para eliminar el token
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');

        if (storedToken && isValidToken(storedToken)) {
          axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
          const response = await axios.get('http://localhost:8080/api/v1/usuarios/login');
          const { usuario } = response.data;
          console.log(response);

          dispatch({
            type: 'INIT',
            payload: {
              isAuthenticated: true,
              usuario,
            },
          });
        } else {
          dispatch({
            type: 'INIT',
            payload: {
              isAuthenticated: false,
              usuario: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INIT',
          payload: {
            isAuthenticated: false,
            usuario: null,
          },
        });
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    // Actualiza el token en cada cambio en el estado
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken && isValidToken(storedToken)) {
      axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }
  }, [state.isAuthenticated, state.usuario]);

  // Persiste el token en localStorage al iniciar sesión
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (state.isAuthenticated && storedToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }
  }, [state.isAuthenticated]);

  if (!state.isInitialised) {
    return <MatxLoading />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
