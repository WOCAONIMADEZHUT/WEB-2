import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  limit
} from 'firebase/firestore';

const Forum = () => {
  const [tabValue, setTabValue] = useState(0);
  const [messages, setMessages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [openNewPost, setOpenNewPost] = useState(false);
  const { currentUser, isAdmin } = useAuth();

  // 获取留言和帖子
  const fetchMessages = async () => {
    const messagesCollection = collection(db, 'messages');
    const q = query(messagesCollection, orderBy('timestamp', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    const messagesList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMessages(messagesList);
  };

  const fetchPosts = async () => {
    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const postsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setPosts(postsList);
  };

  useEffect(() => {
    fetchMessages();
    fetchPosts();
  }, []);

  // 添加留言
  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('请先登录');
      return;
    }
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        content: newMessage,
        author: currentUser.email,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };

  // 添加帖子
  const handleAddPost = async () => {
    if (!currentUser) {
      alert('请先登录');
      return;
    }
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        ...newPost,
        author: currentUser.email,
        timestamp: serverTimestamp()
      });
      setOpenNewPost(false);
      setNewPost({ title: '', content: '' });
      fetchPosts();
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  // 删除留言或帖子
  const handleDelete = async (id, type) => {
    try {
      await deleteDoc(doc(db, type, id));
      if (type === 'messages') {
        fetchMessages();
      } else {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error deleting: ", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
        <Tab label="留言板" />
        <Tab label="论坛" />
      </Tabs>

      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>留言板</Typography>
          
          {/* 留言输入框 */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <form onSubmit={handleAddMessage}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="写下你的留言..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!currentUser}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={!currentUser}
              >
                发布留言
              </Button>
            </form>
          </Paper>

          {/* 留言列表 */}
          <List>
            {messages.map((message) => (
              <Paper key={message.id} sx={{ mb: 2 }}>
                <ListItem
                  secondaryAction={
                    (isAdmin || currentUser?.email === message.author) && (
                      <IconButton
                        edge="end"
                        onClick={() => handleDelete(message.id, 'messages')}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={message.author}
                    secondary={message.content}
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        </Box>
      )}

      {tabValue === 1 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5">论坛</Typography>
            <Button
              variant="contained"
              onClick={() => setOpenNewPost(true)}
              disabled={!currentUser}
            >
              发布新帖子
            </Button>
          </Box>

          {/* 帖子列表 */}
          <List>
            {posts.map((post) => (
              <Paper key={post.id} sx={{ mb: 2 }}>
                <ListItem
                  secondaryAction={
                    (isAdmin || currentUser?.email === post.author) && (
                      <IconButton
                        edge="end"
                        onClick={() => handleDelete(post.id, 'posts')}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6">{post.title}</Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          作者: {post.author}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {post.content}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        </Box>
      )}

      {/* 新帖子对话框 */}
      <Dialog open={openNewPost} onClose={() => setOpenNewPost(false)}>
        <DialogTitle>发布新帖子</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="标题"
            fullWidth
            value={newPost.title}
            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
          />
          <TextField
            margin="dense"
            label="内容"
            fullWidth
            multiline
            rows={4}
            value={newPost.content}
            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewPost(false)}>取消</Button>
          <Button onClick={handleAddPost}>发布</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Forum; 