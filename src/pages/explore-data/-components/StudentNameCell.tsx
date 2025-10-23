import { Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import { useEffect, useState } from 'react';

interface StudentNameCellProps {
  rowId: string;
  studentName: string;
  onOpenStudentDetails: (rowId: string) => void;
}

/**
 * Student Name cell component that displays the name as a clickable element
 * to open the student details side panel.
 * Shows a red warning if the end date is within 3 weeks.
 */
export const StudentNameCell: React.FC<StudentNameCellProps> = ({ 
  rowId, 
  studentName,
  onOpenStudentDetails 
}) => {
  const [isEndDateApproaching, setIsEndDateApproaching] = useState(false);

  useEffect(() => {
    // Check if end date is within 3 weeks
    const checkEndDate = () => {
      const savedDetails = localStorage.getItem(`student_details_${rowId}`);
      if (savedDetails) {
        try {
          const details = JSON.parse(savedDetails);
          if (details.endDate) {
            const endDate = new Date(details.endDate);
            const today = new Date();
            const threeWeeksFromNow = new Date();
            threeWeeksFromNow.setDate(today.getDate() + 21); // 3 weeks = 21 days

            // Check if end date is between today and 3 weeks from now
            if (endDate >= today && endDate <= threeWeeksFromNow) {
              setIsEndDateApproaching(true);
            } else {
              setIsEndDateApproaching(false);
            }
          } else {
            setIsEndDateApproaching(false);
          }
        } catch (e) {
          console.error('Error parsing student details:', e);
          setIsEndDateApproaching(false);
        }
      } else {
        setIsEndDateApproaching(false);
      }
    };

    checkEndDate();
  }, [rowId]);

  const handleClick = () => {
    onOpenStudentDetails(rowId);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: 1,
        transition: 'background-color 0.2s',
        backgroundColor: isEndDateApproaching ? 'error.light' : 'transparent',
        '&:hover': {
          backgroundColor: isEndDateApproaching ? 'error.main' : 'action.hover',
        },
      }}
    >
      {isEndDateApproaching ? (
        <WarningIcon fontSize="small" sx={{ color: 'error.dark' }} />
      ) : (
        <PersonIcon fontSize="small" color="primary" />
      )}
      <Typography
        variant="body2"
        sx={{
          color: isEndDateApproaching ? 'error.dark' : 'primary.main',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          fontWeight: isEndDateApproaching ? 'bold' : 'normal',
        }}
      >
        {studentName || 'Click to add details'}
      </Typography>
    </Box>
  );
};
