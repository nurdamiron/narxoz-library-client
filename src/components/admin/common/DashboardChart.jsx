import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import dashboardService from '../../../services/dashboardService';
import { useTranslation } from 'react-i18next';

// Регистрация необходимых компонентов Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardChart = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  
  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Загрузка данных статистики по годам
        const yearlyStats = await dashboardService.getYearlyStats(year);
        
        setChartData({
          labels: yearlyStats.labels,
          datasets: [
            {
              label: t('admin.borrowingsCount', 'Количество заимствований'),
              data: yearlyStats.data,
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              borderColor: 'rgb(53, 162, 235)',
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error('Error loading chart data:', err);
        setError(t('admin.chartDataError', 'Произошла ошибка при загрузке данных графика'));
      } finally {
        setLoading(false);
      }
    };
    
    loadChartData();
  }, [year, t]);
  
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('admin.yearlyBorrowStats', 'Статистика заимствований за {{year}} год', { year }),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t('admin.borrowingsCount', 'Количество заимствований')
        }
      },
      x: {
        title: {
          display: true,
          text: t('admin.month', 'Месяц')
        }
      }
    }
  };
  
  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{t('admin.yearlyStats', 'Годовая статистика')}</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="year-select-label">{t('admin.year', 'Год')}</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={year}
            label={t('admin.year', 'Год')}
            onChange={handleYearChange}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : chartData ? (
        <Box sx={{ height: 300 }}>
          <Bar options={options} data={chartData} />
        </Box>
      ) : null}
    </Paper>
  );
};

export default DashboardChart;