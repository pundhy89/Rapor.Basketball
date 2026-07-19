/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Students } from './components/Students';
import { Assessment } from './components/Assessment';
import { Report } from './components/Report';
import { Settings } from './components/Settings';
import { Evaluation } from './components/Evaluation';
import { Coaches } from './components/Coaches';
import { Material } from './components/Material';
import { Schedule } from './components/Schedule';
import { Notifications } from './components/Notifications';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="assessment" element={<Assessment />} />
          <Route path="report" element={<Report />} />
          <Route path="settings" element={<Settings />} />
          <Route path="evaluation" element={<Evaluation />} />
          <Route path="coaches" element={<Coaches />} />
          <Route path="material" element={<Material />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
