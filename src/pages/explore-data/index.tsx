import { Box, Paper, Stack } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FilterContext } from '../../components/FilterContext';
import { PageHeader } from '../../components/PageHeader';
import { DataView } from './-components/DataView';
import { FiltersPanel } from './-components/FiltersPanel';
import { CommentsPanel } from './-components/CommentsPanel';
import { FilesPanel } from './-components/FilesPanel';
import { FilterConfig } from '../../types/filters.types';

export const Route = createFileRoute('/explore-data/')({
  component: DataExplorer,
});

// CUSTOMIZE: the filter definitions
const filterConfigs: FilterConfig[] = [];

/**
 * Main explorer page in the explore-data Task Flow.
 * This page includes the page header, filters panel,
 * main table, and the table row preview panel.
 */
function DataExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);
  const [commentsRowId, setCommentsRowId] = useState<string | null>(null);
  const [filesRowId, setFilesRowId] = useState<string | null>(null);

  const handleCloseFilters = () => {
    setShowFiltersPanel(false);
  };

  const handleToggleFilters = () => {
    setShowFiltersPanel(!showFiltersPanel);
  };

  const handleOpenComments = (rowId: string) => {
    setCommentsRowId(rowId);
  };

  const handleCloseComments = () => {
    setCommentsRowId(null);
  };

  const handleOpenFiles = (rowId: string) => {
    setFilesRowId(rowId);
  };

  const handleCloseFiles = () => {
    setFilesRowId(null);
  };

  return (
    <FilterContext>
      <Box>
        <PageHeader
          // CUSTOMIZE: the page title
          pageTitle="Explore Data App"
          // CUSTOMIZE: the page description
          description="Description of this app"
          sx={{
            marginBottom: 1,
            padding: 2,
          }}
        />
        <Box>
          <Stack direction="row">
            {showFiltersPanel && (
              <Box
                sx={{
                  width: '350px',
                }}
              >
                <FiltersPanel
                  filterConfigs={filterConfigs}
                  onClose={handleCloseFilters}
                />
              </Box>
            )}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                minHeight: '600px',
                minWidth: 0,
              }}
            >
              <DataView
                filterConfigs={filterConfigs}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onToggleFiltersPanel={handleToggleFilters}
                onOpenComments={handleOpenComments}
                onOpenFiles={handleOpenFiles}
              />
            </Paper>
            {commentsRowId && (
              <Box
                sx={{
                  minWidth: '400px',
                }}
              >
                <CommentsPanel
                  rowId={commentsRowId}
                  onClose={handleCloseComments}
                />
              </Box>
            )}
            {filesRowId && (
              <Box
                sx={{
                  minWidth: '400px',
                }}
              >
                <FilesPanel
                  rowId={filesRowId}
                  onClose={handleCloseFiles}
                />
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </FilterContext>
  );
}
