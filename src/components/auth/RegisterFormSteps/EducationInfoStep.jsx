// src/components/auth/RegisterFormSteps/EducationInfoStep.jsx
import React, { useState, useEffect } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText, 
  TextField, 
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Card,
  Grid,
  Chip,
  Collapse,
  Paper,
  Tooltip,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { 
  School, 
  Info as InfoIcon, 
  MenuBook, 
  Badge, 
  Timeline,
  Error,
  CheckCircle,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../../services/api'; // Import your API client

/**
 * Оқу ақпараты қадамы компоненті
 * =============================
 * Бұл компонент қолданушының оқу орны туралы ақпаратын жинауға арналған.
 * Факультет, мамандық, курс және студенттік ID мәліметтерін енгізу мүмкіндігін береді.
 * Студенттік ID жүйеде бар-жоғын тексеру функционалы қамтылған.
 * 
 * @param {Object} formData - Форма мәліметтері объектісі
 * @param {Object} formErrors - Форма қателері объектісі
 * @param {Function} handleInputChange - Енгізілген мәліметтерді өңдеу функциясы
 * @param {Function} setFieldError - Форма өрісіне қате орнату функциясы
 * @param {Boolean} isLoading - Жүктелу күйін көрсететін белгі
 * @param {Function} setStepIsProcessing - Қадам өңделуде екенін орнату функциясы
 * @returns {JSX.Element} Оқу ақпараты формасы
 */
const EducationInfoStep = ({ formData, formErrors, handleInputChange, setFieldError, isLoading, setStepIsProcessing }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('xs'));
  
  // State for student ID checking
  const [checkingStudentId, setCheckingStudentId] = useState(false);
  const [studentIdAvailable, setStudentIdAvailable] = useState(true);
  const [studentIdChecked, setStudentIdChecked] = useState(false);
  
  // Student ID check debounce timeout
  const [studentIdCheckTimeout, setStudentIdCheckTimeout] = useState(null);

  // Update parent component about processing state
  useEffect(() => {
    // Notify parent component about checking status
    if (setStepIsProcessing) {
      setStepIsProcessing(checkingStudentId);
    }
  }, [checkingStudentId, setStepIsProcessing]);

  // Check student ID availability when the field is changed
  const handleStudentIdChange = async (e) => {
    const { name, value } = e.target;
    
    // Update the form data through the parent component's handler
    handleInputChange(e);
    
    // Reset student ID availability states when the user starts typing again
    setStudentIdChecked(false);
    
    // Clear any existing timeout
    if (studentIdCheckTimeout) {
      clearTimeout(studentIdCheckTimeout);
    }
    
    // Only check if student ID format is valid (basic validation)
    const studentIdRegex = /^[a-zA-Z0-9]+$/;
    
    if (studentIdRegex.test(value) && value.length >= 3) {
      // Set checking status to true immediately to prevent user from proceeding
      setCheckingStudentId(true);
      
      // Set a new timeout to check student ID after typing stops (debounce)
      const newTimeout = setTimeout(async () => {
        try {
          // Call API to check if student ID exists
          const response = await apiClient.post('/auth/check-student-id', { studentId: value });
          const available = !response.data.exists;
          
          setStudentIdAvailable(available);
          setStudentIdChecked(true);
          
          // If student ID is not available, set an error through the form errors mechanism
          if (!available) {
            setFieldError('studentId', 'Бұл студенттік ID жүйеде тіркелген. Басқа ID енгізіңіз.');
          } else {
            // Clear error if student ID is available
            setFieldError('studentId', '');
          }
        } catch (error) {
          console.error('Error checking student ID availability:', error);
          // Don't show an error to the user if the check fails
          setStudentIdChecked(false);
        } finally {
          setCheckingStudentId(false);
        }
      }, 800); // Wait 800ms after typing stops before checking
      
      setStudentIdCheckTimeout(newTimeout);
    } else {
      // If student ID is invalid, make sure we're not in checking state
      setCheckingStudentId(false);
    }
  };
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (studentIdCheckTimeout) {
        clearTimeout(studentIdCheckTimeout);
      }
    };
  }, [studentIdCheckTimeout]);

  /**
   * Факультеттер тізімі
   * @type {Array<{value: string, label: string}>}
   */
  const faculties = [
    { value: "Бизнес мектебі", label: "Бизнес мектебі" },
    { value: "Құқық және мемлекеттік басқару мектебі", label: "Құқық және мемлекеттік басқару мектебі" },
    { value: "Цифрлық технологиялар мектебі", label: "Цифрлық технологиялар мектебі" },
    { value: "Экономика мектебі", label: "Экономика мектебі" },
  ];

  /**
   * Мамандықтар тізімі
   * @type {Array<{value: string, label: string}>}
   */
  const specializations = [
    { value: "Қаржы", label: "Қаржы" },
    { value: "Бухгалтерлік есеп", label: "Бухгалтерлік есеп" },
    { value: "Маркетинг", label: "Маркетинг" },
    { value: "Менеджмент", label: "Менеджмент" },
    { value: "Заңтану", label: "Заңтану" },
    { value: "Ақпараттық жүйелер", label: "Ақпараттық жүйелер" },
  ];

  /**
   * Курстар тізімі
   * @type {Array<{value: string, label: string}>}
   */
  const years = [
    { value: "1", label: "1 курс" },
    { value: "2", label: "2 курс" },
    { value: "3", label: "3 курс" },
    { value: "4", label: "4 курс" },
    { value: "Магистратура", label: "Магистратура" },
    { value: "Докторантура", label: "Докторантура" },
  ];

  // Staggered animation for form controls
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5 }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          mb: 3,
          gap: 1
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <School 
            sx={{ 
              color: theme.palette.primary.main,
              fontSize: { xs: 32, sm: 40 },
              mr: isMobile ? 0 : 1.5,
              mb: isMobile ? 1 : 0
            }} 
          />
        </motion.div>
        
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.primary.main,
            textAlign: isMobile ? 'center' : 'left',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          Оқу ақпараты
        </Typography>
      </Box>

      <Card 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: 3,
          mb: 3,
          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '5px',
            height: '100%',
            background: theme.palette.primary.main,
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px'
          }
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 3, 
            color: theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <InfoIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
          Оқу орнындағы мәліметтеріңізді енгізіңіз
        </Typography>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <Grid container spacing={isMobile ? 2 : 3}>
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <FormControl 
                  fullWidth 
                  margin="normal" 
                  required 
                  error={!!formErrors.faculty}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main + '90',
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    },
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      padding: { xs: '12px 14px', sm: '15px 14px' },
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      marginLeft: 1,
                    },
                  }}
                >
                  <InputLabel id="faculty-label" sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenuBook fontSize="small" sx={{ mr: 1, opacity: 0.7 }} /> Факультет
                  </InputLabel>
                  <Select
                    labelId="faculty-label"
                    id="faculty"
                    name="faculty"
                    value={formData.faculty}
                    label="Факультет"
                    onChange={handleInputChange}
                    disabled={isLoading}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: 2,
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        },
                      },
                    }}
                  >
                    {faculties.map(faculty => (
                      <MenuItem key={faculty.value} value={faculty.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MenuBook fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main, opacity: 0.7 }} />
                          {faculty.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.faculty && <FormHelperText>{formErrors.faculty}</FormHelperText>}
                </FormControl>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <FormControl 
                  fullWidth 
                  margin="normal" 
                  required 
                  error={!!formErrors.specialization}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main + '90',
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    },
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      padding: { xs: '12px 14px', sm: '15px 14px' },
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      marginLeft: 1,
                    },
                  }}
                >
                  <InputLabel id="specialization-label">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Badge fontSize="small" sx={{ mr: 1, opacity: 0.7 }} /> Мамандық
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="specialization-label"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    label="Мамандық"
                    onChange={handleInputChange}
                    disabled={isLoading}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: 2,
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        },
                      },
                    }}
                  >
                    {specializations.map(spec => (
                      <MenuItem key={spec.value} value={spec.value}>
                        {spec.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.specialization && <FormHelperText>{formErrors.specialization}</FormHelperText>}
                </FormControl>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <FormControl 
                  fullWidth 
                  margin="normal" 
                  required 
                  error={!!formErrors.year}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main + '90',
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    },
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      padding: { xs: '12px 14px', sm: '15px 14px' },
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      marginLeft: 1,
                    },
                  }}
                >
                  <InputLabel id="year-label">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Timeline fontSize="small" sx={{ mr: 1, opacity: 0.7 }} /> Курс
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="year-label"
                    id="year"
                    name="year"
                    value={formData.year}
                    label="Курс"
                    onChange={handleInputChange}
                    disabled={isLoading}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: 2,
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        },
                      },
                    }}
                  >
                    {years.map(year => (
                      <MenuItem key={year.value} value={year.value}>
                        {year.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.year && <FormHelperText>{formErrors.year}</FormHelperText>}
                </FormControl>
              </motion.div>
            </Grid>

            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="studentId"
                  label="Студенттік ID"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleStudentIdChange} // Use custom handler for checking
                  error={!!formErrors.studentId || (studentIdChecked && !studentIdAvailable)}
                  helperText={
                    formErrors.studentId || 
                    (studentIdChecked && !studentIdAvailable ? 'Бұл студенттік ID жүйеде тіркелген. Басқа ID енгізіңіз.' : 
                    "Студенттік куәлігіңіздегі ID нөмірін енгізіңіз")
                  }
                  disabled={isLoading}
                  placeholder="123456789"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main + '90',
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: '2px',
                      },
                      // Add color for available student ID
                      ...(studentIdChecked && studentIdAvailable && {
                        '& fieldset': {
                          borderColor: theme.palette.success.main,
                          borderWidth: '2px',
                        }
                      }),
                      // Add color for unavailable student ID
                      ...(studentIdChecked && !studentIdAvailable && {
                        '& fieldset': {
                          borderColor: theme.palette.error.main,
                          borderWidth: '2px',
                        }
                      }),
                      // Add color for checking student ID
                      ...(checkingStudentId && {
                        '& fieldset': {
                          borderColor: theme.palette.warning.main,
                          borderWidth: '2px',
                        }
                      })
                    },
                    '& .MuiFormLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      ...(studentIdChecked && studentIdAvailable && {
                        color: theme.palette.success.main
                      }),
                      ...(studentIdChecked && !studentIdAvailable && {
                        color: theme.palette.error.main
                      }),
                      ...(checkingStudentId && {
                        color: theme.palette.warning.main
                      })
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      padding: { xs: '12px 14px', sm: '15px 14px' },
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      marginLeft: 1,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon 
                          sx={{ 
                            opacity: 0.8,
                            color: checkingStudentId ? 
                              theme.palette.warning.main : 
                              (studentIdChecked ? 
                                (studentIdAvailable ? theme.palette.success.main : theme.palette.error.main) : 
                                theme.palette.primary.main)
                          }} 
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {checkingStudentId ? (
                          <CircularProgress size={20} color="warning" />
                        ) : studentIdChecked && studentIdAvailable ? (
                          <CheckCircle color="success" />
                        ) : studentIdChecked && !studentIdAvailable ? (
                          <Error color="error" />
                        ) : null}
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Card>

      <AnimatePresence>
        {formData.faculty && formData.specialization && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: theme.palette.success.main + '15',
                border: `1px dashed ${theme.palette.success.main}30`,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.success.main }}>
                Таңдалған оқу ақпараты:
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip 
                  icon={<MenuBook fontSize="small" />} 
                  label={`Факультет: ${formData.faculty}`} 
                  size="small" 
                  variant="outlined" 
                  color="primary" 
                />
                <Chip 
                  icon={<Badge fontSize="small" />} 
                  label={`Мамандық: ${formData.specialization}`} 
                  size="small" 
                  variant="outlined" 
                  color="primary" 
                />
                {formData.year && (
                  <Chip 
                    icon={<Timeline fontSize="small" />} 
                    label={`Курс: ${formData.year}`} 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                  />
                )}
              </Box>
              
              <Box 
                sx={{ 
                  mt: 1.5, 
                  pt: 1.5, 
                  borderTop: `1px dashed ${theme.palette.success.main}30`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1
                }}
              >
                <InfoIcon fontSize="small" sx={{ color: theme.palette.info.main, mt: 0.3 }} />
                <Typography variant="caption" color="text.secondary">
                  Кітапханада сіздің факультет және мамандығыңызға сәйкес ақпараттық ресурстар мен кітаптар ұсынылады. 
                  Студенттік ID арқылы сіз кітапхана қорынан кітаптарды алу мүмкіндігіне ие боласыз.
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Optional help text */}
      {!formData.faculty && (
        <Box 
          sx={{ 
            mt: 2, 
            p: 2, 
            borderRadius: 2,
            bgcolor: theme.palette.info.main + '10',
            border: `1px dashed ${theme.palette.info.main}30`,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <InfoIcon sx={{ mr: 1.5, color: theme.palette.info.main }} />
          <Typography variant="body2" color="text.secondary">
            Жүйеде тіркелу үшін оқу ақпаратыңызды толық көрсетіңіз
          </Typography>
        </Box>
      )}
    </motion.div>
  );
};

export default EducationInfoStep;