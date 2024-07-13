import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const Indicator = ({ title, subtitle, value, value2, image }) => {
  return (
    <Card style={{ backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          {image && <img src={image} alt={title} style={{ width: 50, height: 50, marginRight: 20 }} />}
          <Box>
            <Typography variant="h5" component="div" style={{ color: '#3f51b5' }}>
              {title}
            </Typography>
            <Typography variant="body2" style={{ color: '#757575' }}>
              {subtitle}
            </Typography>
            <Typography variant="body2" style={{ color: '#757575' }}>
              {value}
            </Typography>
            <Typography variant="body2" style={{ color: '#757575' }}>
              {value2}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Indicator;
