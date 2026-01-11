import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  loginWithGoogle, 
  loginWithEmail,
  clearError 
} from '../services/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Jika sudah login, redirect
  if (isAuthenticated) {
    navigate('/');
  }

  const handleGoogleLogin = async () => {
    dispatch(clearError());
    const result = await dispatch(loginWithGoogle());
    
    if (result.type === 'auth/loginWithGoogle/fulfilled') {
      console.log('Login berhasil:', result.payload);
      navigate('/');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    const result = await dispatch(loginWithEmail({ email, password }));
    
    if (result.type === 'auth/loginWithEmail/fulfilled') {
      console.log('Login berhasil:', result.payload);
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login dengan Email'}
        </button>
      </form>

      <div className="divider">ATAU</div>

      <button onClick={handleGoogleLogin} disabled={loading}>
        Login dengan Google
      </button>
    </div>
  );
};

export default LoginPage;
