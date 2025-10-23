import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import DownloadIcon from '@mui/icons-material/Download';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Stack, TextField, Typography, IconButton, Tooltip } from '@mui/material';
import React from 'react';

interface DataViewHeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onToggleFiltersPanel: () => void;
  onAddRow?: () => void;
  onAddColumn?: () => void;
  onExport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onToggleColumnVisibility?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

/**
 * Data table header section with filters button and search bar
 */
export const DataViewHeader: React.FC<DataViewHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  onToggleFiltersPanel,
  onAddRow,
  onAddColumn,
  onExport,
  onUndo,
  onRedo,
  onToggleColumnVisibility,
  canUndo,
  canRedo,
}) => {
  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    setSearchTerm(evt.target.value);
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        overflow: 'hidden',
        padding: 2,
      }}
    >
      {onAddRow && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddRow}
          size="small"
        >
          Add Row
        </Button>
      )}
      {onAddColumn && (
        <Button
          variant="contained"
          startIcon={<ViewColumnIcon />}
          onClick={onAddColumn}
          size="small"
        >
          Add Column
        </Button>
      )}
      {onExport && (
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={onExport}
          size="small"
        >
          Export
        </Button>
      )}
      {onUndo && onRedo && (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Undo">
            <span>
              <IconButton
                onClick={onUndo}
                disabled={!canUndo}
                size="small"
              >
                <UndoIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redo">
            <span>
              <IconButton
                onClick={onRedo}
                disabled={!canRedo}
                size="small"
              >
                <RedoIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      )}
      {onToggleColumnVisibility && (
        <Tooltip title="Column Visibility">
          <IconButton
            onClick={onToggleColumnVisibility}
            size="small"
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      )}
      <Typography variant="h6" component="h2" flex={1}>
        Entity List
      </Typography>
      <Button startIcon={<FilterListIcon />} onClick={onToggleFiltersPanel}>
        Filters
      </Button>
      <TextField
        variant="outlined"
        label="Search"
        size="small"
        value={searchTerm}
        onChange={handleSearch}
      />
    </Stack>
  );
};
