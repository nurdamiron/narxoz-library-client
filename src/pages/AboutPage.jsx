import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
} from '@mui/material';
import {
  History as HistoryIcon,
  AutoStories as AutoStoriesIcon,
  Groups as GroupsIcon,
  LocationOn as LocationOnIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  ImportContacts as ImportContactsIcon,
} from '@mui/icons-material';

/**
 * AboutPage компоненті - кітапхана туралы ақпаратты көрсету беті
 * 
 * Бұл компонент кітапхана туралы келесі ақпаратты көрсетеді:
 * - Кітапхана миссиясы
 * - Кітапхана тарихы
 * - Байланыс ақпараты мен жұмыс кестесі
 * - Кітапхананың артықшылықтары
 * - Кітапханың білім беру рөлі
 * - Ресурстар мен коллекциялар туралы ақпарат
 */
const AboutPage = () => {
  const theme = useTheme(); // Material UI тақырыбын алу

  /**
   * Кітапхананың артықшылықтары туралы деректер массиві
   * 
   * Әр элемент келесі қасиеттерден тұрады:
   * - icon: Артықшылықты көрсететін иконка
   * - title: Артықшылық атауы
   * - description: Артықшылықтың сипаттамасы
   */
  const features = [
    {
      icon: <AutoStoriesIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Более 100,000 книг',
      description: 'Обширная коллекция учебной и научной литературы для всех специальностей университета',
    },
    {
      icon: <ImportContactsIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Электронные ресурсы',
      description: 'Доступ к электронным базам данных, включая научные журналы и публикации',
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Учебные пространства',
      description: 'Комфортные читальные залы и пространства для групповой работы',
    },
  ];

  return (
    <Container>
      <Box sx={{ mb: 6 }}>
        {/* Беттің тақырыбы мен қысқаша сипаттамасы */}
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          О библиотеке
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          Библиотека Университета Нархоз - центр знаний и информационных ресурсов
        </Typography>

        {/* Кітапхана ғимаратының суреті */}
        <Paper
          sx={{
            p: 0,
            overflow: 'hidden',
            borderRadius: 2,
            mb: 6,
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src="https://via.placeholder.com/1200x400?text=Library+Building"
            alt="Здание библиотеки"
            sx={{
              width: '100%',
              height: { xs: 200, sm: 300, md: 400 }, // Экран өлшеміне байланысты биіктігі
              objectFit: 'cover',
            }}
          />
        </Paper>

        {/* Миссия мен тарих бөлімі */}
        <Grid container spacing={4}>
          {/* Сол жақ бағана - миссия мен тарих */}
          <Grid item xs={12} md={8}>
            {/* Миссия бөлімі */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Наша миссия
            </Typography>
            <Typography variant="body1" paragraph>
              Миссия библиотеки Университета Нархоз заключается в поддержке образовательного
              процесса и научно-исследовательской деятельности путем предоставления доступа к
              качественным информационным ресурсам и создания комфортной среды для обучения и развития.
            </Typography>
            <Typography variant="body1" paragraph>
              Мы стремимся быть современным информационным центром, который помогает студентам,
              преподавателям и исследователям в получении знаний, развитии навыков и проведении
              исследований на высоком уровне.
            </Typography>

            <Divider sx={{ my: 4 }} /> {/* Бөлгіш сызық */}

            {/* Тарих бөлімі */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                <HistoryIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                История библиотеки
              </Typography>
              <Typography variant="body1" paragraph>
                Библиотека Университета Нархоз была основана в 1963 году одновременно с созданием университета.
                За более чем полувековую историю библиотека превратилась в один из крупнейших академических
                информационных центров в Казахстане.
              </Typography>
              <Typography variant="body1" paragraph>
                Первоначально библиотечный фонд насчитывал всего несколько тысяч книг, но благодаря
                постоянному развитию сейчас он включает более 100 000 печатных изданий и предоставляет
                доступ к многочисленным электронным ресурсам.
              </Typography>
              <Typography variant="body1" paragraph>
                В 2018 году библиотека переехала в новое современное здание, оборудованное по последнему
                слову техники, что позволило расширить спектр услуг и создать еще более комфортные условия
                для пользователей.
              </Typography>
            </Box>
          </Grid>

          {/* Оң жақ бағана - байланыс ақпараты мен жұмыс кестесі */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                {/* Байланыс ақпараты бөлімі */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.primary.main }} />
                  Контактная информация
                </Typography>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  {/* Мекенжай */}
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Адрес"
                      secondary="ул. Жандосова, 55, Алматы, Казахстан"
                    />
                  </ListItem>
                  {/* Телефон */}
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Телефон"
                      secondary="+7 (727) 377-11-11"
                    />
                  </ListItem>
                  {/* Email */}
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary="library@narxoz.kz"
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Жұмыс кестесі бөлімі */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  <ScheduleIcon sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.primary.main }} />
                  Часы работы
                </Typography>
                <List dense>
                  {/* Дүйсенбі-жұма */}
                  <ListItem>
                    <ListItemText
                      primary="Понедельник - Пятница"
                      secondary="9:00 - 20:00"
                    />
                  </ListItem>
                  {/* Сенбі */}
                  <ListItem>
                    <ListItemText
                      primary="Суббота"
                      secondary="10:00 - 17:00"
                    />
                  </ListItem>
                  {/* Жексенбі */}
                  <ListItem>
                    <ListItemText
                      primary="Воскресенье"
                      secondary="Закрыто"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} /> {/* Бөлгіш сызық */}

        {/* Кітапхананың артықшылықтары бөлімі */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
          Преимущества нашей библиотеки
        </Typography>

        {/* Артықшылықтар картасының торы */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                  textAlign: 'center',
                  transition: 'transform 0.3s', // Анимация үшін
                  '&:hover': {
                    transform: 'translateY(-8px)', // Үстінен өткенде жоғары көтеріледі
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 6 }} /> {/* Бөлгіш сызық */}

        {/* Кітапхананың білім беру рөлі мен ресурстар бөлімі */}
        <Grid container spacing={4}>
          {/* Білім беру рөлі */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Образовательная роль
            </Typography>
            <Typography variant="body1" paragraph>
              Библиотека Университета Нархоз является неотъемлемой частью образовательного процесса.
              Мы активно сотрудничаем с факультетами и кафедрами для обеспечения учебных программ
              необходимыми материалами.
            </Typography>
            <Typography variant="body1" paragraph>
              Наша команда регулярно проводит обучающие семинары и мастер-классы по информационной
              грамотности, работе с электронными базами данных и правильному оформлению научных работ.
            </Typography>
          </Grid>

          {/* Ресурстар мен коллекциялар */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              <ImportContactsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Ресурсы и коллекции
            </Typography>
            <Typography variant="body1" paragraph>
              Библиотечный фонд включает учебники, монографии, научные журналы, диссертации,
              справочные издания и другие материалы по всем направлениям обучения в университете.
            </Typography>
            <Typography variant="body1" paragraph>
              Особую ценность представляют специализированные коллекции по экономике, финансам,
              бизнесу и праву. Библиотека также предоставляет доступ к международным базам данных,
              таким как EBSCO, Scopus, Web of Science и другим.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutPage;