import { IconButton, Typography } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useState, useEffect } from 'react';

interface HiringProcessCellProps {
  rowId: string;
  onOpenHiringProcess: (rowId: string) => void;
}

/**
 * Hiring Process cell component that displays a button to open the hiring process side panel.
 */
export const HiringProcessCell: React.FC<HiringProcessCellProps> = ({ rowId, onOpenHiringProcess }) => {
  const [completedCount, setCompletedCount] = useState(0);
  const totalSteps = 10; // Total number of hiring process steps

  // Load completed count from localStorage
  useEffect(() => {
    const updateCount = () => {
      const savedProcess = localStorage.getItem(`hiring_process_${rowId}`);
      if (savedProcess) {
        const processData = JSON.parse(savedProcess);
        const completed = Object.values(processData).filter((item: any) => item.checked).length;
        setCompletedCount(completed);
      } else {
        setCompletedCount(0);
      }
    };

    // Initial load
    updateCount();

    // Listen for updates
    window.addEventListener('hiring_process_updated', updateCount);

    return () => {
      window.removeEventListener('hiring_process_updated', updateCount);
    };
  }, [rowId]);

  const handleClick = () => {
    onOpenHiringProcess(rowId);
  };

  return (
    <IconButton
      size="small"
      onClick={handleClick}
      color={completedCount > 0 ? 'primary' : 'default'}
    >
      <AssignmentTurnedInIcon />
      {completedCount > 0 && (
        <Typography
          component="span"
          sx={{
            fontSize: '0.75rem',
            marginLeft: 0.5,
          }}
        >
          ({completedCount}/{totalSteps})
        </Typography>
      )}
    </IconButton>
  );
};
