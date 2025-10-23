import { IconButton, Typography } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { useState, useEffect } from 'react';

interface CommentsCellProps {
  rowId: string;
  onOpenComments: (rowId: string) => void;
}

/**
 * Comments cell component that displays a button to open the comments side panel.
 */
export const CommentsCell: React.FC<CommentsCellProps> = ({ rowId, onOpenComments }) => {
  const [commentCount, setCommentCount] = useState(0);

  // Load comment count from localStorage
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${rowId}`);
    if (savedComments) {
      const comments = JSON.parse(savedComments);
      setCommentCount(comments.length);
    } else {
      setCommentCount(0);
    }
  }, [rowId]);

  const handleClick = () => {
    onOpenComments(rowId);
  };

  return (
    <IconButton
      size="small"
      onClick={handleClick}
      color={commentCount > 0 ? 'primary' : 'default'}
    >
      <CommentIcon />
      {commentCount > 0 && (
        <Typography
          component="span"
          sx={{
            fontSize: '0.75rem',
            marginLeft: 0.5,
          }}
        >
          ({commentCount})
        </Typography>
      )}
    </IconButton>
  );
};
