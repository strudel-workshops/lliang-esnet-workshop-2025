import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';

interface Comment {
  text: string;
  author: string;
  timestamp: string;
}

interface CommentsPanelProps {
  rowId: string;
  onClose: () => void;
}

/**
 * Side panel component that displays comment history
 * and allows users to add new comments.
 */
export const CommentsPanel: React.FC<CommentsPanelProps> = ({ rowId, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  // Load comments from localStorage when component mounts or rowId changes
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${rowId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      setComments([]);
    }
    
    // Load saved author name
    const savedAuthor = localStorage.getItem('comment_author');
    if (savedAuthor) {
      setAuthorName(savedAuthor);
    }
  }, [rowId]);

  const handleAddComment = () => {
    if (newComment.trim() && authorName.trim()) {
      const comment: Comment = {
        text: newComment,
        author: authorName,
        timestamp: new Date().toLocaleString(),
      };
      
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      
      // Save to localStorage
      localStorage.setItem(`comments_${rowId}`, JSON.stringify(updatedComments));
      localStorage.setItem('comment_author', authorName);
      
      setNewComment('');
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Comments</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Add New Comment Form */}
      <Box
        sx={{
          padding: 2,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="Your Name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="Type your comment here..."
          />
          <Button
            onClick={handleAddComment}
            variant="contained"
            fullWidth
            disabled={!newComment.trim() || !authorName.trim()}
          >
            Add Comment
          </Button>
        </Stack>
      </Box>

      {/* Comment History */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: 2,
        }}
      >
        {comments.length > 0 ? (
          <Stack spacing={2}>
            {comments.map((comment, index) => (
              <Box
                key={index}
                sx={{
                  padding: 2,
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  borderLeft: 3,
                  borderColor: 'primary.main',
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {comment.text}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                  }}
                >
                  <strong>{comment.author}</strong>
                  <br />
                  {comment.timestamp}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              padding: 4,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">
              No comments yet. Be the first to add one!
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
