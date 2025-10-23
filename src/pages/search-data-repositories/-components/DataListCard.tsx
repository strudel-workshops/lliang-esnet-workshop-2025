import { Box, Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import React from 'react';

interface DataListCardProps {
  item: any;
  previewItem: any;
  setPreviewItem: React.Dispatch<React.SetStateAction<any>>;
}

/**
 * Card to show in the main list of the `<DatasetExplorer>`.
 * The fields that are displayed in the cards are originally
 * configured in `defintions.cards.main`.
 */
export const DataListCard: React.FC<DataListCardProps> = ({
  item,
  previewItem,
  setPreviewItem,
}) => {
  const handleItemClick = () => {
    setPreviewItem(item);
  };

  return (
    <Stack
      className={previewItem?.id === item.id ? 'selected' : ''}
      data-testid="sdr-data-list-card"
      direction="row"
      onClick={() => handleItemClick()}
      sx={{
        padding: 1,
        transition: '0.25s',
        '&:hover': {
          bgcolor: 'neutral.light',
        },
        '&.selected': {
          bgcolor: blue[50],
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'neutral.dark',
          height: 70,
          width: 70,
        }}
      >
        <Typography fontSize="small">{'<Image>'}</Typography>
      </Box>
      <Box flex={1}>
        <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          {/* CUSTOMIZE: Display Metric field from CSV */}
          {item['Metric '] || item.Metric || 'N/A'}
        </Typography>
        {item.Details && (
          <Typography
            sx={{
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '2',
              display: '-webkit-box',
              overflow: 'hidden',
              marginTop: 0.5,
            }}
          >
            {/* CUSTOMIZE: Display Details field from CSV */}
            {item.Details}
          </Typography>
        )}
        <Typography
          sx={{
            fontSize: 'small',
            marginTop: 1,
            color: 'text.secondary',
          }}
        >
          {/* Display yearly data from CSV */}
          {item['2023'] && <span style={{ marginRight: '12px' }}>2023: {item['2023']}</span>}
          {item['2024'] && <span style={{ marginRight: '12px' }}>2024: {item['2024']}</span>}
          {item['2025'] && <span style={{ marginRight: '12px' }}>2025: {item['2025']}</span>}
          {item['2026'] && <span>2026: {item['2026']}</span>}
        </Typography>
      </Box>
    </Stack>
  );
};
