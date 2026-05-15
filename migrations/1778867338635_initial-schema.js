/* eslint-disable no-undef */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Add pgcrypto extension for UUID generation if not exists
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  // Users Table
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    phone: { type: 'varchar(20)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    role: { type: 'varchar(20)', notNull: true, check: "role IN ('OWNER', 'TENANT')" },
    photo_url: { type: 'text' },
    address: { type: 'text' },
    room_code: { type: 'varchar(20)' },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Rooms Table
  pgm.createTable('rooms', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    owner_id: {
      type: 'uuid',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    room_number: { type: 'varchar(50)', notNull: true },
    room_code: { type: 'varchar(20)', notNull: true, unique: true },
    address: { type: 'text', notNull: true },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Tenant Links Table
  pgm.createTable('tenant_links', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    owner_id: {
      type: 'uuid',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    room_id: {
      type: 'uuid',
      notNull: true,
      references: '"rooms"',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    joined_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    is_active: { type: 'boolean', notNull: true, default: true },
  });

  // Bills Table
  pgm.createTable('bills', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    room_id: {
      type: 'uuid',
      notNull: true,
      references: '"rooms"',
      onDelete: 'CASCADE',
    },
    owner_id: {
      type: 'uuid',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    tenant_id: {
      type: 'uuid',
      notNull: true,
      references: '"tenant_links"',
      onDelete: 'CASCADE',
    },
    month: { type: 'varchar(7)', notNull: true }, // YYYY-MM
    rent: { type: 'numeric(12,2)', notNull: true, default: 0 },
    electricity: { type: 'numeric(12,2)', notNull: true, default: 0 },
    water: { type: 'numeric(12,2)', notNull: true, default: 0 },
    dustbin: { type: 'numeric(12,2)', notNull: true, default: 0 },
    note: { type: 'text' },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'DUE',
      check: "status IN ('DUE', 'PAID')",
    },
    total: { type: 'numeric(12,2)', notNull: true, default: 0 },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Notifications Table
  pgm.createTable('notifications', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    bill_id: {
      type: 'uuid',
      references: '"bills"',
      onDelete: 'SET NULL',
    },
    message: { type: 'text', notNull: true },
    is_read: { type: 'boolean', notNull: true, default: false },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Indexes
  pgm.createIndex('rooms', 'owner_id');
  pgm.createIndex('tenant_links', 'room_id');
  pgm.createIndex('tenant_links', 'user_id');
  pgm.createIndex('bills', 'tenant_id');
  pgm.createIndex('notifications', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropTable('notifications');
  pgm.dropTable('bills');
  pgm.dropTable('tenant_links');
  pgm.dropTable('rooms');
  pgm.dropTable('users');
};
