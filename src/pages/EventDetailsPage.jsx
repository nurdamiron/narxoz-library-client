/**
 * Event Details Page
 * 
 * Page for viewing event details and registration
 */
import React from 'react';
import { EventDetails } from '../components/events';
import Layout from '../components/layout/Layout';

const EventDetailsPage = () => {
  return (
    <Layout>
      <EventDetails />
    </Layout>
  );
};

export default EventDetailsPage;