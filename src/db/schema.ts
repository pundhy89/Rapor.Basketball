import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const students = pgTable('students', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  studentId: text('student_id').notNull(),
  jerseyNumber: text('jersey_number'),
  name: text('name').notNull(),
  birthPlace: text('birth_place'),
  birthDate: text('birth_date'),
  gender: text('gender'),
  address: text('address'),
  phone: text('phone'),
  parentName: text('parent_name'),
  parentPhone: text('parent_phone'),
  classLevel: text('class_level').notNull(),
  joinDate: text('join_date').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const coaches = pgTable('coaches', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  coachId: text('coach_id').notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  certification: text('certification'),
  activeClasses: jsonb('active_classes').notNull(), // array of ClassLevel
  isActive: boolean('is_active').notNull().default(true),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const assessments = pgTable('assessments', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  date: text('date').notNull(),
  coachId: text('coach_id').notNull(),
  studentId: text('student_id').notNull(),
  classLevel: text('class_level').notNull(),
  scores: jsonb('scores').notNull(), // { technical, tactical, physical, mental, character }
  notes: text('notes'),
  target: text('target'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const attendances = pgTable('attendances', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  date: text('date').notNull(),
  classLevel: text('class_level').notNull(),
  studentId: text('student_id').notNull(),
  status: text('status').notNull(),
  reason: text('reason'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const evaluations = pgTable('evaluations', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  period: text('period').notNull(),
  studentId: text('student_id').notNull(),
  notes: jsonb('notes').notNull(), // { strengths, improvements, nextTarget, recommendation }
  createdAt: timestamp('created_at').defaultNow(),
});

export const schedules = pgTable('schedules', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  class: text('class').notNull(),
  days: text('days').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  color: text('color').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const settings = pgTable('settings', {
  userId: integer('user_id').references(() => users.id).primaryKey(),
  data: jsonb('data').notNull(), // contains weights, academy, periods, etc.
  createdAt: timestamp('created_at').defaultNow(),
});
