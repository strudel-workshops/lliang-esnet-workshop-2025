import { Alert, Box, LinearProgress, Skeleton } from '@mui/material';
import { GridPaginationModel, GridRowModel, GridColumnHeaderParams } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { useFilters } from '../../../components/FilterContext';
import { SciDataGrid } from '../../../components/SciDataGrid';
import { filterData } from '../../../utils/filters.utils';
import { useListQuery } from '../../../hooks/useListQuery';
import { FilterConfig } from '../../../types/filters.types';
import { CommentsCell } from './CommentsCell';
import { FilesCell } from './FilesCell';
import { StudentNameCell } from './StudentNameCell';
import { HiringProcessCell } from './HiringProcessCell';
import { DataViewHeader } from './DataViewHeader';
import * as XLSX from 'xlsx';

interface DataViewProps {
  filterConfigs: FilterConfig[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onToggleFiltersPanel: () => void;
  onOpenComments: (rowId: string) => void;
  onOpenFiles: (rowId: string) => void;
  onOpenStudentDetails: (rowId: string) => void;
  onOpenHiringProcess: (rowId: string) => void;
}
/**
 * Query the data rows and render as an interactive table
 */
export const DataView: React.FC<DataViewProps> = ({
  filterConfigs,
  searchTerm,
  setSearchTerm,
  onToggleFiltersPanel,
  onOpenComments,
  onOpenFiles,
  onOpenStudentDetails,
  onOpenHiringProcess,
}) => {
  const { activeFilters } = useFilters();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [offset, setOffest] = useState(page * pageSize);
  const [editedRows, setEditedRows] = useState<Record<string, any>>({});
  const [newRows, setNewRows] = useState<any[]>([]);
  const [customColumns, setCustomColumns] = useState<string[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [selectedColumnField, setSelectedColumnField] = useState<string | null>(null);
  
  // CUSTOMIZE: the unique ID field for the data source
  const dataIdField = 'id';
  // CUSTOMIZE: query mode, 'client' or 'server'
  const queryMode = 'client';
  const { isPending, isFetching, isError, data, error } = useListQuery({
    activeFilters,
    // CUSTOMIZE: the table data source
    dataSource: 'data/Metrics Summary.csv',
    filterConfigs,
    offset,
    page,
    pageSize,
    queryMode,
    staticParams: null,
  });

  // Load edited rows, new rows, custom columns, and column order from localStorage on mount
  useEffect(() => {
    const savedEdits = localStorage.getItem('metrics_edits');
    if (savedEdits) {
      setEditedRows(JSON.parse(savedEdits));
    }
    
    const savedNewRows = localStorage.getItem('metrics_new_rows');
    if (savedNewRows) {
      setNewRows(JSON.parse(savedNewRows));
    }
    
    const savedCustomColumns = localStorage.getItem('metrics_custom_columns');
    if (savedCustomColumns) {
      setCustomColumns(JSON.parse(savedCustomColumns));
    }
  }, []);

  // Handler to add a new row
  const handleAddRow = () => {
    const newRowId = `new-row-${Date.now()}`;
    const newRow: any = {
      id: newRowId,
      'Metric ': '',
      Details: '',
      '2023': '',
      '2024': '',
      '2025': '',
      '2026': '',
      'Student Name': '',
      'Onboarding': '',
      'Location': '',
      'Attend Poster session': '',
    };
    
    // Add any custom columns to the new row
    customColumns.forEach(col => {
      newRow[col] = '';
    });
    
    let updatedNewRows: any[];
    
    // If a row is selected, insert the new row below it
    if (selectedRowId) {
      // Create the current combined data with proper IDs (matching how csvData assigns them)
      const allCurrentData = [...(data || []), ...newRows];
      const selectedIndex = allCurrentData.findIndex((row, index) => {
        const rowId = row.id || `row-${index}`;
        return rowId === selectedRowId;
      });
      
      if (selectedIndex !== -1) {
        // Calculate how many rows are from the original data vs new rows
        const originalDataLength = (data || []).length;
        
        if (selectedIndex < originalDataLength) {
          // Selected row is from original data, add new row at the beginning of newRows
          updatedNewRows = [newRow, ...newRows];
        } else {
          // Selected row is from newRows, insert after it
          const newRowIndex = selectedIndex - originalDataLength;
          updatedNewRows = [
            ...newRows.slice(0, newRowIndex + 1),
            newRow,
            ...newRows.slice(newRowIndex + 1),
          ];
        }
      } else {
        // If not found, append to the end
        updatedNewRows = [...newRows, newRow];
      }
    } else {
      // No row selected, add at the end
      updatedNewRows = [...newRows, newRow];
    }
    
    setNewRows(updatedNewRows);
    localStorage.setItem('metrics_new_rows', JSON.stringify(updatedNewRows));
  };

  // Handler to add a new column
  const handleAddColumn = () => {
    const columnName = prompt('Enter column name:');
    if (columnName && columnName.trim()) {
      let updatedColumns: string[];
      
      // If a column is selected, insert the new column to its right
      if (selectedColumnField && selectedColumnField !== 'comments') {
        const selectedIndex = customColumns.indexOf(selectedColumnField);
        
        if (selectedIndex !== -1) {
          // Selected column is a custom column
          updatedColumns = [
            ...customColumns.slice(0, selectedIndex + 1),
            columnName.trim(),
            ...customColumns.slice(selectedIndex + 1),
          ];
        } else {
          // Selected column is a default column, add new column at the beginning of custom columns
          updatedColumns = [columnName.trim(), ...customColumns];
        }
      } else {
        // No column selected or comments column selected, add at the end
        updatedColumns = [...customColumns, columnName.trim()];
      }
      
      setCustomColumns(updatedColumns);
      localStorage.setItem('metrics_custom_columns', JSON.stringify(updatedColumns));
    }
  };

  // Combine CSV data with new rows
  const allData = [...(data || []), ...newRows];
  
  // Add unique IDs to CSV data and merge with edited data
  const csvData = allData.map((item: any, index: number) => {
    const id = item.id || `row-${index}`;
    return {
      ...item,
      id,
      // Override with edited values if they exist
      ...(editedRows[id] || {}),
    };
  }).filter((row: any) => !row.__deleted); // Filter out deleted rows

  // Handle row updates when user edits a cell
  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedEdits = {
      ...editedRows,
      [newRow.id]: newRow,
    };
    setEditedRows(updatedEdits);
    // Save to localStorage
    localStorage.setItem('metrics_edits', JSON.stringify(updatedEdits));
    return newRow;
  };

  const handleProcessRowUpdateError = (error: Error) => {
    console.error('Error updating row:', error);
  };

  const handleRowClick = (rowData: any) => {
    setSelectedRowId(rowData.row.id);
    // Preview panel disabled - don't show popup when clicking cells
    // setPreviewItem(rowData.row);
  };
  
  const handleColumnHeaderClick = (params: GridColumnHeaderParams) => {
    setSelectedColumnField(params.field);
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    // Reset page to first when the page size changes
    const newPage = model.pageSize !== pageSize ? 0 : model.page;
    const newPageSize = model.pageSize;
    const newOffset = newPage * newPageSize;
    setPage(newPage);
    setPageSize(newPageSize);
    setOffest(newOffset);
  };

  // Handler to export data to CSV
  const handleExport = () => {
    // Get the filtered data
    const filteredData = filterData(csvData, activeFilters, filterConfigs, searchTerm);
    
    // Prepare data for export (exclude internal fields like 'id', 'files', 'comments')
    const exportData = filteredData.map((row: any) => {
      const { id, files, comments, ...rest } = row;
      return rest;
    });
    
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Metrics Summary');
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `Metrics_Summary_${date}.csv`;
    
    // Write the file as CSV
    XLSX.writeFile(wb, filename, { bookType: 'csv' });
  };

  // Show a loading skeleton while the initial query is pending
  if (isPending) {
    const emptyRows = new Array(pageSize).fill(null);
    const indexedRows = emptyRows.map((row, i) => i);
    return (
      <Box
        sx={{
          padding: 2,
        }}
      >
        {indexedRows.map((row) => (
          <Skeleton key={row} height={50} />
        ))}
      </Box>
    );
  }

  // Show an error message if the query fails
  if (isError) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  // Show the data when the query completes
  return (
    <>
      <DataViewHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onToggleFiltersPanel={onToggleFiltersPanel}
        onAddRow={handleAddRow}
        onAddColumn={handleAddColumn}
        onExport={handleExport}
      />
      {isFetching && <LinearProgress variant="indeterminate" />}
      <SciDataGrid
        rows={filterData(csvData, activeFilters, filterConfigs, searchTerm)}
        pagination
        paginationMode={queryMode}
        onPaginationModelChange={handlePaginationModelChange}
        getRowId={(row) => row[dataIdField]}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        // CUSTOMIZE: the table columns
        columns={[
          {
            field: 'Metric ',
            headerName: 'Metric',
            width: 250,
            editable: true,
          },
          {
            field: 'Details',
            headerName: 'Details',
            width: 300,
            editable: true,
          },
          {
            field: '2023',
            headerName: '2023',
            width: 120,
            editable: true,
          },
          {
            field: '2024',
            headerName: '2024',
            width: 120,
            editable: true,
          },
          {
            field: '2025',
            headerName: '2025',
            width: 120,
            editable: true,
          },
          {
            field: '2026',
            headerName: '2026',
            width: 120,
            editable: true,
          },
          {
            field: 'Student Name',
            headerName: 'Student Name',
            width: 200,
            editable: true,
            renderCell: (params) => (
              <StudentNameCell
                rowId={params.row.id}
                studentName={params.value || ''}
                onOpenStudentDetails={onOpenStudentDetails}
              />
            ),
          },
          {
            field: 'Onboarding',
            headerName: 'Onboarding',
            width: 250,
            editable: true,
            type: 'singleSelect',
            valueOptions: [
              '',
              'Onboarding work in progress',
              'On-site seat assigned',
              'No seat needed, work remote',
              'Onboarding complete',
            ],
          },
          {
            field: 'Location',
            headerName: 'Location',
            width: 250,
            editable: true,
            type: 'singleSelect',
            valueOptions: [
              '',
              'Fully remote',
              'Fully onsite',
              'Hybrid (3 days on-site)',
            ],
          },
          {
            field: 'Attend Poster session',
            headerName: 'Attend Poster session',
            width: 250,
            editable: true,
            type: 'singleSelect',
            valueOptions: [
              '',
              'Not attend',
              'Fly in to attend',
              'Local attend',
            ],
          },
          // Add custom columns dynamically
          ...customColumns.map(colName => ({
            field: colName,
            headerName: colName,
            width: 120,
            editable: true,
          })),
          {
            field: 'hiring_process',
            headerName: 'Hiring Process',
            width: 150,
            sortable: false,
            filterable: false,
            editable: false,
            renderCell: (params) => (
              <HiringProcessCell 
                rowId={params.row.id} 
                onOpenHiringProcess={onOpenHiringProcess}
              />
            ),
          },
          {
            field: 'files',
            headerName: 'Files',
            width: 120,
            sortable: false,
            filterable: false,
            editable: false,
            renderCell: (params) => (
              <FilesCell 
                rowId={params.row.id} 
                onOpenFiles={onOpenFiles}
              />
            ),
          },
          {
            field: 'comments',
            headerName: 'Comments',
            width: 120,
            sortable: false,
            filterable: false,
            editable: false,
            renderCell: (params) => (
              <CommentsCell 
                rowId={params.row.id} 
                onOpenComments={onOpenComments}
              />
            ),
          },
        ]}
        disableColumnSelector
        autoHeight
        initialState={{
          pagination: { paginationModel: { page, pageSize } },
        }}
        onRowClick={handleRowClick}
        onColumnHeaderClick={handleColumnHeaderClick}
      />
    </>
  );
};
