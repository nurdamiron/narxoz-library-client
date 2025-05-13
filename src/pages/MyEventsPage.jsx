/**
 * My Events Page
 * 
 * Page for viewing user's registered events
 */
import React from 'react';
import { MyEvents } from '../components/events';
import Layout from '../components/layout/Layout';

const MyEventsPage = () => {
  return (
    <Layout>
      <MyEvents />
    </Layout>
  );
};

export default MyEventsPage;