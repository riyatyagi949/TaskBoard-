import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'intern@demo.com' && password === 'intern123') {
      login(rememberMe);
      setError('');
    } else {
      setError('Invalid credentials!\nEmail: intern@demo.com\nPassword: intern123');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: 'white', padding: '40px', borderRadius: '20px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)', maxWidth: '400px', width: '100%'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center', color: '#1e293b' }}>
          TaskBoard Pro 
        </h1>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="intern@demo.com" required
            style={{ width: '100%', padding: '15px', marginBottom: '15px', 
            border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px' }}
          />
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="intern123" required
            style={{ width: '100%', padding: '15px', marginBottom: '20px', 
            border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px' }}
          />
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            <span style={{ fontSize: '14px', color: '#64748b' }}>Remember me</span>
          </label>

          {error && (
            <div style={{
              background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px',
              marginBottom: '20px', borderLeft: '4px solid #dc2626', whiteSpace: 'pre-line'
            }}>
              {error}
            </div>
          )}
          
          <button type="submit" style={{
            width: '100%', padding: '15px', background: '#3b82f6', color: 'white',
            border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
