import { Box, Grid, Paper, Typography } from '@mui/material';
import Plot from 'react-plotly.js';
import React from 'react';

interface DashboardProps {
  data: any[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // Get yearly data
  const year2023 = data.map(row => parseFloat(row['2023']) || 0);
  const year2024 = data.map(row => parseFloat(row['2024']) || 0);
  const year2025 = data.map(row => parseFloat(row['2025']) || 0);
  const year2026 = data.map(row => parseFloat(row['2026']) || 0);

  // Aggregate data by programs
  const programData: Record<string, number[]> = {};
  data.forEach((row, idx) => {
    const program = row['Details'] || 'Unknown';
    if (!programData[program]) {
      programData[program] = [0, 0, 0, 0];
    }
    programData[program][0] += year2023[idx];
    programData[program][1] += year2024[idx];
    programData[program][2] += year2025[idx];
    programData[program][3] += year2026[idx];
  });

  // Aggregate data by student levels
  const levelData: Record<string, number[]> = {};
  data.forEach((row, idx) => {
    const level = row['Metric '] || 'Unknown';
    if (!levelData[level]) {
      levelData[level] = [0, 0, 0, 0];
    }
    levelData[level][0] += year2023[idx];
    levelData[level][1] += year2024[idx];
    levelData[level][2] += year2025[idx];
    levelData[level][3] += year2026[idx];
  });

  const programNames = Object.keys(programData);
  const levelNames = Object.keys(levelData);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Student Data Visualization
      </Typography>
      <Grid container spacing={2}>
        {/* Bar Chart - Breakdown by Programs */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Breakdown by Programs
            </Typography>
            <Plot
              data={[
                {
                  x: programNames,
                  y: programNames.map(p => programData[p][0]),
                  name: '2023',
                  type: 'bar',
                  marker: { color: '#1976d2' },
                },
                {
                  x: programNames,
                  y: programNames.map(p => programData[p][1]),
                  name: '2024',
                  type: 'bar',
                  marker: { color: '#42a5f5' },
                },
                {
                  x: programNames,
                  y: programNames.map(p => programData[p][2]),
                  name: '2025',
                  type: 'bar',
                  marker: { color: '#90caf9' },
                },
                {
                  x: programNames,
                  y: programNames.map(p => programData[p][3]),
                  name: '2026',
                  type: 'bar',
                  marker: { color: '#bbdefb' },
                },
              ]}
              layout={{
                autosize: true,
                margin: { l: 60, r: 20, t: 20, b: 100 },
                xaxis: { 
                  tickangle: -45,
                  tickfont: { size: 12 }
                },
                yaxis: { 
                  title: 'Number of Students',
                  titlefont: { size: 14 }
                },
                barmode: 'group',
                showlegend: true,
                legend: { orientation: 'h', y: -0.3 },
                plot_bgcolor: '#f9f9f9',
              }}
              config={{ responsive: true, displayModeBar: true }}
              style={{ width: '100%', height: '450px' }}
            />
          </Paper>
        </Grid>

        {/* Bar Chart - Levels of Students */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Levels of Students
            </Typography>
            <Plot
              data={[
                {
                  x: levelNames,
                  y: levelNames.map(l => levelData[l][0]),
                  name: '2023',
                  type: 'bar',
                  marker: { color: '#1976d2' },
                },
                {
                  x: levelNames,
                  y: levelNames.map(l => levelData[l][1]),
                  name: '2024',
                  type: 'bar',
                  marker: { color: '#42a5f5' },
                },
                {
                  x: levelNames,
                  y: levelNames.map(l => levelData[l][2]),
                  name: '2025',
                  type: 'bar',
                  marker: { color: '#90caf9' },
                },
                {
                  x: levelNames,
                  y: levelNames.map(l => levelData[l][3]),
                  name: '2026',
                  type: 'bar',
                  marker: { color: '#bbdefb' },
                },
              ]}
              layout={{
                autosize: true,
                margin: { l: 60, r: 20, t: 20, b: 100 },
                xaxis: { 
                  tickangle: -45,
                  tickfont: { size: 12 }
                },
                yaxis: { 
                  title: 'Number of Students',
                  titlefont: { size: 14 }
                },
                barmode: 'group',
                showlegend: true,
                legend: { orientation: 'h', y: -0.3 },
                plot_bgcolor: '#f9f9f9',
              }}
              config={{ responsive: true, displayModeBar: true }}
              style={{ width: '100%', height: '450px' }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
