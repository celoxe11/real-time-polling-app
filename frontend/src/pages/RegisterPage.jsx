import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerWithEmail, clearError } from '../services/authSlice';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Password tidak cocok!');
      return;
    }

    dispatch(clearError());
    
    const result = await dispatch(registerWithEmail({ 
      email, 
      password, 
      displayName 
    }));
    
    if (result.type === 'auth/registerWithEmail/fulfilled') {
      console.log('Registrasi berhasil:', result.payload);
      navigate('/');
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
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
          minLength={6}
        />
        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>

      <p>
        Sudah punya akun? <a href="/login">Login di sini</a>
      </p>
    </div>
  );
};

export default RegisterPage;
