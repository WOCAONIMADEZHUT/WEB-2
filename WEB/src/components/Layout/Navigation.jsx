import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const { currentUser, logout, isAdmin } = useAuth();

  return (
    <Stack direction="row" spacing={2} sx={{ marginLeft: 'auto' }}>
      <Button color="inherit" component={Link} to="/">首页</Button>
      <Button color="inherit" component={Link} to="/about">个人简介</Button>
      <Button color="inherit" component={Link} to="/portfolio">作品展示</Button>
      <Button color="inherit" component={Link} to="/blog">博客园地</Button>
      <Button color="inherit" component={Link} to="/forum">互动交流</Button>
      <Button color="inherit" component={Link} to="/resources">资源共享</Button>
      {currentUser ? (
        <>
          <Typography sx={{ alignSelf: 'center' }}>
            {currentUser.email}
            {isAdmin && ' (管理员)'}
          </Typography>
          <Button 
            color="inherit" 
            onClick={logout}
          >
            退出
          </Button>
        </>
      ) : (
        <>
          <Button color="inherit" component={Link} to="/login">
            登录
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            注册
          </Button>
        </>
      )}
    </Stack>
  );
};

export default Navigation; 