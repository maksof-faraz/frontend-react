import { useContext, useState, useEffect } from 'react';
import './authForm.css'; // Import the CSS file
import { registerUser, loginUser } from '../apis/axiosApi';
import { useNavigate } from 'react-router-dom';
import type { LoginRegister } from '../types/userTypes';
import { AuthContext } from '../store/auth';
import { jwtDecode } from 'jwt-decode';

const AuthForm = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Optionally check for expiration:
        const currentTime = Date.now() / 1000;
        if ((decoded as any).exp && (decoded as any).exp < currentTime) {
          localStorage.removeItem('token');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        // Invalid token string
        localStorage.removeItem('token');
      }
    }
  }, []);




  const [btnDisable, setBtnDisable] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState<LoginRegister>({
    username: '',
    email: '',
    password: ''
  });


  const { setTokenInLS } = useContext(AuthContext)

  const toggleForm = () => {
    setIsSignUp(prev => !prev);
    setFormData({ username: '', email: '', password: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setBtnDisable(true)
      const res: any = (isSignUp) ? await registerUser(formData) : await loginUser({ email: formData.email, password: formData.password });
      if (res.status == '201') {
        setFormData({
          username: '',
          email: '',
          password: ''
        })

        setTokenInLS(res.data.token)
        navigate('/dashboard')
      }
      setBtnDisable(false)
    } catch (err) {
      setBtnDisable(false)
      console.error(err);
    }

  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {isSignUp && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={btnDisable}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <p className="toggle-link" onClick={toggleForm}>
        {isSignUp
          ? 'Already have an account? Sign In'
          : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default AuthForm;


