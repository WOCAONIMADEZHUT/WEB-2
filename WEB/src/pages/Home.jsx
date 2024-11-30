import React from 'react';
import { Typography, Grid, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h3" gutterBottom align="center">
        欢迎来到我的个人空间
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h5" gutterBottom>个人简介</Typography>
            <Typography>了解我的故事和经历</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h5" gutterBottom>最新作品</Typography>
            <Typography>探索我的创作世界</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h5" gutterBottom>博客动态</Typography>
            <Typography>分享我的最新想法</Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 