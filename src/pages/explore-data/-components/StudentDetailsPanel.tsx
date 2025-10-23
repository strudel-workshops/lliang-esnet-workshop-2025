import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';

interface StudentDetails {
  studentName: string;
  mentor: string;
  supervisor: string;
  academicLevel: string;
  schoolYear: string;
  schoolName: string;
  deskLocation: string;
  personalEmail: string;
  phoneNumber: string;
  startDate: string;
  endDate: string;
  extendedEndDate: string;
}

interface StudentDetailsPanelProps {
  rowId: string;
  studentName: string;
  onClose: () => void;
}

/**
 * Side panel component that displays and edits student details
 */
export const StudentDetailsPanel: React.FC<StudentDetailsPanelProps> = ({ 
  rowId, 
  studentName,
  onClose 
}) => {
  const [details, setDetails] = useState<StudentDetails>({
    studentName: '',
    mentor: '',
    supervisor: '',
    academicLevel: '',
    schoolYear: '',
    schoolName: '',
    deskLocation: '',
    personalEmail: '',
    phoneNumber: '',
    startDate: '',
    endDate: '',
    extendedEndDate: '',
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Load student details from localStorage when component mounts or rowId changes
  useEffect(() => {
    const savedDetails = localStorage.getItem(`student_details_${rowId}`);
    if (savedDetails) {
      setDetails(JSON.parse(savedDetails));
    } else {
      setDetails({
        studentName: studentName || '',
        mentor: '',
        supervisor: '',
        academicLevel: '',
        schoolYear: '',
        schoolName: '',
        deskLocation: '',
        personalEmail: '',
        phoneNumber: '',
        startDate: '',
        endDate: '',
        extendedEndDate: '',
      });
    }
    setHasChanges(false);
  }, [rowId, studentName]);

  const handleFieldChange = (field: keyof StudentDetails, value: string) => {
    setDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save student details to localStorage
    localStorage.setItem(`student_details_${rowId}`, JSON.stringify(details));
    
    // Also update the main table's Student Name field
    const savedEdits = localStorage.getItem('metrics_edits');
    let edits: any = {};
    if (savedEdits) {
      try {
        edits = JSON.parse(savedEdits);
      } catch (e) {
        console.error('Error parsing saved edits:', e);
      }
    }
    
    // Update the Student Name in the row edits
    edits[rowId] = {
      ...(edits[rowId] || {}),
      'Student Name': details.studentName,
    };
    
    localStorage.setItem('metrics_edits', JSON.stringify(edits));
    setHasChanges(false);
    
    // Reload the page to reflect changes in the table
    window.location.reload();
  };

  const academicLevelOptions = [
    'Postdoc',
    'PhD',
    "Master's",
    "Bachelor's",
    'High School',
  ];

  const schoolYearOptions = [
    '1st year',
    '2nd year',
    '3rd year',
    '4th year',
  ];

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
        <Box>
          <Typography variant="h6">Student Details</Typography>
          <Typography variant="body2" color="text.secondary">
            {details.studentName || 'No name provided'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Save Button at Top */}
      <Box
        sx={{
          padding: 2,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Button
          onClick={handleSave}
          variant="contained"
          fullWidth
          disabled={!hasChanges}
        >
          {hasChanges ? 'Save Changes' : 'Saved'}
        </Button>
      </Box>

      {/* Form Fields */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: 2,
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="Student Name"
            value={details.studentName}
            onChange={(e) => handleFieldChange('studentName', e.target.value)}
            fullWidth
            size="small"
            required
          />
          
          <TextField
            label="Mentor"
            value={details.mentor}
            onChange={(e) => handleFieldChange('mentor', e.target.value)}
            fullWidth
            size="small"
          />
          
          <TextField
            label="Supervisor"
            value={details.supervisor}
            onChange={(e) => handleFieldChange('supervisor', e.target.value)}
            fullWidth
            size="small"
          />
          
          <TextField
            select
            label="Academic Level"
            value={details.academicLevel}
            onChange={(e) => handleFieldChange('academicLevel', e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {academicLevelOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            label="School Year"
            value={details.schoolYear}
            onChange={(e) => handleFieldChange('schoolYear', e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {schoolYearOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            label="School Name"
            value={details.schoolName}
            onChange={(e) => handleFieldChange('schoolName', e.target.value)}
            fullWidth
            size="small"
          />
          
          <TextField
            label="Desk Location"
            value={details.deskLocation}
            onChange={(e) => handleFieldChange('deskLocation', e.target.value)}
            fullWidth
            size="small"
          />
          
          <TextField
            label="Personal Email"
            type="email"
            value={details.personalEmail}
            onChange={(e) => handleFieldChange('personalEmail', e.target.value)}
            fullWidth
            size="small"
          />
          
          <TextField
            label="Phone Number"
            type="tel"
            value={details.phoneNumber}
            onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
            fullWidth
            size="small"
          />
          
          <TextField
            label="Start Date"
            type="date"
            value={details.startDate}
            onChange={(e) => handleFieldChange('startDate', e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <TextField
            label="End Date"
            type="date"
            value={details.endDate}
            onChange={(e) => handleFieldChange('endDate', e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <TextField
            label="Extended End Date"
            type="date"
            value={details.extendedEndDate}
            onChange={(e) => handleFieldChange('extendedEndDate', e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Stack>
      </Box>
    </Paper>
  );
};
