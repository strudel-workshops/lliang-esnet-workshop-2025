import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';

interface ProcessStep {
  checked: boolean;
  timestamp: string | null;
}

interface ProcessData {
  [key: string]: ProcessStep;
}

interface HiringProcessPanelProps {
  rowId: string;
  onClose: () => void;
}

// Define the hiring process steps
const HIRING_STEPS = [
  'Abstract received',
  'ServiceNow approval',
  'HRSS request submitted',
  'REQ #',
  'Remote Work Agreement status (Y/N)',
  'Offer Accepted',
  'IRSO visa discussion?',
  'Laptop/software needs shared?',
  'Onboard completed',
  'Added to CSA Smartsheet',
];

/**
 * Side panel component that displays hiring process checklist
 * with timestamps for each completed step.
 */
export const HiringProcessPanel: React.FC<HiringProcessPanelProps> = ({ rowId, onClose }) => {
  const [processData, setProcessData] = useState<ProcessData>({});

  // Load process data from localStorage when component mounts or rowId changes
  useEffect(() => {
    const savedProcess = localStorage.getItem(`hiring_process_${rowId}`);
    if (savedProcess) {
      setProcessData(JSON.parse(savedProcess));
    } else {
      // Initialize with unchecked steps
      const initialData: ProcessData = {};
      HIRING_STEPS.forEach(step => {
        initialData[step] = {
          checked: false,
          timestamp: null,
        };
      });
      setProcessData(initialData);
    }
  }, [rowId]);

  const handleCheckboxChange = (step: string) => {
    const updatedData = {
      ...processData,
      [step]: {
        checked: !processData[step]?.checked,
        timestamp: !processData[step]?.checked ? new Date().toLocaleString() : null,
      },
    };
    setProcessData(updatedData);
    
    // Save to localStorage
    localStorage.setItem(`hiring_process_${rowId}`, JSON.stringify(updatedData));
    
    // Trigger a custom event to notify the cell component to update
    window.dispatchEvent(new Event('hiring_process_updated'));
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
        <Typography variant="h6">Hiring Process</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Checklist */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: 2,
        }}
      >
        <Stack spacing={1}>
          {HIRING_STEPS.map((step, index) => {
            const stepData = processData[step] || { checked: false, timestamp: null };
            return (
              <Box key={index}>
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: stepData.checked ? 'success.light' : 'grey.100',
                    borderRadius: 1,
                    borderLeft: 3,
                    borderColor: stepData.checked ? 'success.main' : 'grey.400',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={stepData.checked}
                        onChange={() => handleCheckboxChange(step)}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: stepData.checked ? 600 : 400,
                            textDecoration: stepData.checked ? 'line-through' : 'none',
                          }}
                        >
                          {step}
                        </Typography>
                        {stepData.checked && stepData.timestamp && (
                          <>
                            <Divider sx={{ my: 1 }} />
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                fontStyle: 'italic',
                              }}
                            >
                              Completed: {stepData.timestamp}
                            </Typography>
                          </>
                        )}
                      </Box>
                    }
                    sx={{ margin: 0, width: '100%' }}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Summary Footer */}
      <Box
        sx={{
          padding: 2,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Progress: {Object.values(processData).filter(step => step.checked).length} / {HIRING_STEPS.length} completed
        </Typography>
      </Box>
    </Paper>
  );
};
