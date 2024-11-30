import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc,
  doc, 
  query,
  orderBy
} from 'firebase/firestore';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [open, setOpen] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', link: '', description: '' });
  const { isAdmin } = useAuth();

  // 获取资源列表
  const fetchResources = async () => {
    const resourcesCollection = collection(db, 'resources');
    const q = query(resourcesCollection, orderBy('title'));
    const querySnapshot = await getDocs(q);
    const resourcesList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setResources(resourcesList);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // 添加资源
  const handleAddResource = async () => {
    try {
      await addDoc(collection(db, 'resources'), newResource);
      setOpen(false);
      setNewResource({ title: '', link: '', description: '' });
      fetchResources();
    } catch (error) {
      console.error("Error adding resource: ", error);
    }
  };

  // 删除资源
  const handleDeleteResource = async (id) => {
    try {
      await deleteDoc(doc(db, 'resources', id));
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource: ", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        资源下载
      </Typography>
      
      {isAdmin && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ mb: 3 }}
        >
          添加资源
        </Button>
      )}

      <List>
        {resources.map((resource) => (
          <Paper key={resource.id} sx={{ mb: 2 }}>
            <ListItem
              secondaryAction={
                isAdmin && (
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDeleteResource(resource.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={resource.title}
                secondary={resource.description}
              />
              <Button 
                variant="outlined" 
                href={resource.link} 
                target="_blank"
                sx={{ ml: 2 }}
              >
                下载
              </Button>
            </ListItem>
          </Paper>
        ))}
      </List>

      {/* 添加资源对话框 */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>添加新资源</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="资源名称"
            fullWidth
            value={newResource.title}
            onChange={(e) => setNewResource({...newResource, title: e.target.value})}
          />
          <TextField
            margin="dense"
            label="资源链接"
            fullWidth
            value={newResource.link}
            onChange={(e) => setNewResource({...newResource, link: e.target.value})}
          />
          <TextField
            margin="dense"
            label="资源描述"
            fullWidth
            multiline
            rows={3}
            value={newResource.description}
            onChange={(e) => setNewResource({...newResource, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={handleAddResource}>添加</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Resources; 