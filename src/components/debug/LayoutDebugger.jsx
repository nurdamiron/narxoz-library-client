/**
 * Layout Debugger Component
 * 
 * This component helps diagnose layout and rendering issues
 * It can be temporarily added to components to provide debugging information
 */
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Divider } from '@mui/material';

const LayoutDebugger = () => {
  const params = useParams();
  const location = useLocation();
  const [mountCount, setMountCount] = useState(0);
  const [renderId] = useState(Math.random().toString(36).substring(7));

  useEffect(() => {
    // Count component mounts
    setMountCount(count => count + 1);
    
    // Log component lifecycle
    console.log(`LayoutDebugger (${renderId}) mounted`);
    
    return () => {
      console.log(`LayoutDebugger (${renderId}) unmounted`);
    };
  }, [renderId]);

  // Capture React rendering info
  const reactRenderInfo = {
    componentMountCount: mountCount,
    timestamp: new Date().toISOString(),
    renderId
  };

  // Get DOM structure info
  const domInfo = {
    bodyChildCount: document.body.childElementCount,
    rootElementCount: document.getElementById('root')?.childElementCount || 'root not found',
    rootFirstChild: document.getElementById('root')?.firstElementChild?.tagName || 'none',
    multipleAppBarsPresent: document.querySelectorAll('header').length > 1,
    headerCount: document.querySelectorAll('header').length,
    headerElements: Array.from(document.querySelectorAll('header')).map(el => ({
      className: el.className,
      childCount: el.childElementCount
    }))
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        width: 350,
        p: 2,
        opacity: 0.9,
        maxHeight: '80vh',
        overflow: 'auto'
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
        Layout Debugger
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Typography variant="subtitle2">URL Parameters:</Typography>
      <Box component="pre" sx={{ 
        bgcolor: 'grey.100', 
        p: 1, 
        borderRadius: 1,
        fontSize: '0.75rem',
        mb: 2
      }}>
        {JSON.stringify(params, null, 2)}
      </Box>
      
      <Typography variant="subtitle2">Location:</Typography>
      <Box component="pre" sx={{ 
        bgcolor: 'grey.100', 
        p: 1, 
        borderRadius: 1,
        fontSize: '0.75rem',
        mb: 2,
        wordBreak: 'break-all'
      }}>
        {JSON.stringify({
          pathname: location.pathname,
          search: location.search,
          hash: location.hash
        }, null, 2)}
      </Box>
      
      <Typography variant="subtitle2">React Rendering:</Typography>
      <Box component="pre" sx={{ 
        bgcolor: 'grey.100', 
        p: 1, 
        borderRadius: 1,
        fontSize: '0.75rem',
        mb: 2
      }}>
        {JSON.stringify(reactRenderInfo, null, 2)}
      </Box>
      
      <Typography variant="subtitle2">DOM Structure:</Typography>
      <Box component="pre" sx={{ 
        bgcolor: 'grey.100', 
        p: 1, 
        borderRadius: 1,
        fontSize: '0.75rem'
      }}>
        {JSON.stringify(domInfo, null, 2)}
      </Box>
    </Paper>
  );
};

export default LayoutDebugger;