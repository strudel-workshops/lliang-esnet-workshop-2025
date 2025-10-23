import {
  Box,
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useState, useEffect, useRef } from 'react';

interface FileData {
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  dataUrl: string;
}

interface FilesPanelProps {
  rowId: string;
  onClose: () => void;
}

/**
 * Side panel component that displays uploaded files
 * and allows users to upload new files.
 */
export const FilesPanel: React.FC<FilesPanelProps> = ({ rowId, onClose }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files from localStorage when component mounts or rowId changes
  useEffect(() => {
    const savedFiles = localStorage.getItem(`files_${rowId}`);
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    } else {
      setFiles([]);
    }
  }, [rowId]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      Array.from(selectedFiles).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileData: FileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toLocaleString(),
            dataUrl: e.target?.result as string,
          };
          
          const updatedFiles = [...files, fileData];
          setFiles(updatedFiles);
          localStorage.setItem(`files_${rowId}`, JSON.stringify(updatedFiles));
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = (index: number) => {
    if (confirm('Are you sure you want to delete this file?')) {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      localStorage.setItem(`files_${rowId}`, JSON.stringify(updatedFiles));
    }
  };

  const handleDownloadFile = (file: FileData) => {
    const link = document.createElement('a');
    link.href = file.dataUrl;
    link.download = file.name;
    link.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
        <Typography variant="h6">Files</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Upload Section */}
      <Box
        sx={{
          padding: 2,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="*/*"
        />
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          fullWidth
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Files
        </Button>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          Supports: Word, PDF, Excel, Images, and more
        </Typography>
      </Box>

      {/* Files List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: 2,
        }}
      >
        {files.length > 0 ? (
          <List>
            {files.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  mb: 1,
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  borderLeft: 3,
                  borderColor: 'primary.main',
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteFile(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <InsertDriveFileIcon sx={{ mr: 2, color: 'primary.main' }} />
                <ListItemText
                  primary={
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => handleDownloadFile(file)}
                      sx={{
                        textAlign: 'left',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {file.name}
                    </Link>
                  }
                  secondary={
                    <>
                      {formatFileSize(file.size)}
                      <br />
                      Uploaded: {file.uploadDate}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              padding: 4,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">
              No files uploaded yet. Click "Upload Files" to add files.
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
