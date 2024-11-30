import React from 'react';
import { styled } from '@mui/material/styles';
import { 
  AppBar, 
  Toolbar, 
  Container, 
  Typography, 
  Box,
  IconButton,
  Link as MuiLink
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';
import Navigation from './Navigation';

const StyledMain = styled('main')({
  minHeight: 'calc(100vh - 160px)', // 减去头部和页脚的高度
  padding: '2rem 0',
  backgroundColor: '#f5f5f5'
});

const Footer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  textAlign: 'center'
}));

const SocialIcons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2)
}));

const Layout = ({ children }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">我的个人网站</Typography>
          <Navigation />
        </Toolbar>
      </AppBar>
      
      <StyledMain>
        <Container>{children}</Container>
      </StyledMain>

      <Footer>
        <Typography variant="h6" gutterBottom>
          快乐12点
        </Typography>
        <Typography variant="body2" color="inherit">
          分享快乐，传递温暖
        </Typography>
        <SocialIcons>
          <IconButton
            color="inherit"
            component={MuiLink}
            href="https://github.com/你的GitHub用户名"
            target="_blank"
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            color="inherit"
            component={MuiLink}
            href="https://twitter.com/你的Twitter用户名"
            target="_blank"
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            component={MuiLink}
            href="https://instagram.com/你的Instagram用户名"
            target="_blank"
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            color="inherit"
            component={MuiLink}
            href="https://youtube.com/你的YouTube频道"
            target="_blank"
          >
            <YouTubeIcon />
          </IconButton>
        </SocialIcons>
        <Typography variant="body2" sx={{ mt: 2 }}>
          © {new Date().getFullYear()} 快乐12点. All rights reserved.
        </Typography>
      </Footer>
    </>
  );
};

export default Layout; 