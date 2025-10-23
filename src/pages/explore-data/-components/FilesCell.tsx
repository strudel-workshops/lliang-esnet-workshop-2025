import { IconButton, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useState, useEffect } from 'react';

interface FilesCellProps {
  rowId: string;
  onOpenFiles: (rowId: string) => void;
}

/**
 * Files cell component that displays a button to open the files side panel.
 */
export const FilesCell: React.FC<FilesCellProps> = ({ rowId, onOpenFiles }) => {
  const [fileCount, setFileCount] = useState(0);

  // Load file count from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem(`files_${rowId}`);
    if (savedFiles) {
      const files = JSON.parse(savedFiles);
      setFileCount(files.length);
    } else {
      setFileCount(0);
    }
  }, [rowId]);

  const handleClick = () => {
    onOpenFiles(rowId);
  };

  return (
    <IconButton
      size="small"
      onClick={handleClick}
      color={fileCount > 0 ? 'primary' : 'default'}
    >
      <AttachFileIcon />
      {fileCount > 0 && (
        <Typography
          component="span"
          sx={{
            fontSize: '0.75rem',
            marginLeft: 0.5,
          }}
        >
          ({fileCount})
        </Typography>
      )}
    </IconButton>
  );
};
