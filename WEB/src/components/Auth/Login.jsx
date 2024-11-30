import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // 表单验证
  const validateForm = () => {
    if (!formData.email) {
      setError('请输入邮箱');
      return false;
    }
    if (!formData.password) {
      setError('请输入密码');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('请输入有效的邮箱地址');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error(err);
      switch (err.code) {
        case 'auth/user-not-found':
          setError('用户不存在');
          break;
        case 'auth/wrong-password':
          setError('密码错误');
          break;
        case 'auth/too-many-requests':
          setError('登录尝试次数过多，请稍后再试');
          break;
        default:
          setError('登录失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
    setError(''); // 清除错误信息
  };

  const handleClickShowPassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  return (
    <Box sx={{ 
      maxWidth: 400, 
      mx: 'auto', 
      mt: 4,
      animation: 'fadeIn 0.5s ease-in-out',
      '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(-20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' }
      }
    }}>
      <Paper sx={{ 
        p: 4,
        boxShadow: 3,
        '&:hover': {
          boxShadow: 6
        },
        transition: 'box-shadow 0.3s ease-in-out'
      }}>
        <Typography variant="h5" gutterBottom align="center">
          登录
        </Typography>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ mt: 2 }}
          noValidate
        >
          <TextField
            fullWidth
            label="邮箱"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            margin="normal"
            required
            autoComplete="email"
            autoFocus
            error={!!error && error.includes('邮箱')}
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="密码"
            type={formData.showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
            margin="normal"
            required
            autoComplete="current-password"
            error={!!error && error.includes('密码')}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2,
              height: 48,
              position: 'relative'
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress 
                size={24} 
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px'
                }}
              />
            ) : '登录'}
          </Button>

          <Typography align="center">
            还没有账号？ 
            <Link 
              to="/signup"
              style={{ 
                textDecoration: 'none', 
                color: 'primary.main',
                marginLeft: '8px'
              }}
            >
              立即注册
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 