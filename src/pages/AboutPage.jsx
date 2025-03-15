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

const AboutPage = () => {
  const theme = useTheme();

  // Секция с преимуществами
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
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          О библиотеке
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          Библиотека Университета Нархоз - центр знаний и информационных ресурсов
        </Typography>

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
              height: { xs: 200, sm: 300, md: 400 },
              objectFit: 'cover',
            }}
          />
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
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

            <Divider sx={{ my: 4 }} />

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

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.primary.main }} />
                  Контактная информация
                </Typography>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Адрес"
                      secondary="ул. Жандосова, 55, Алматы, Казахстан"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Телефон"
                      secondary="+7 (727) 377-11-11"
                    />
                  </ListItem>
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

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  <ScheduleIcon sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.primary.main }} />
                  Часы работы
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Понедельник - Пятница"
                      secondary="9:00 - 20:00"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Суббота"
                      secondary="10:00 - 17:00"
                    />
                  </ListItem>
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

        <Divider sx={{ my: 6 }} />

        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
          Преимущества нашей библиотеки
        </Typography>

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
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
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

        <Divider sx={{ my: 6 }} />

        <Grid container spacing={4}>
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