
export const schema = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('sales','admin')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  city TEXT NOT NULL,
  note TEXT,
  budget TEXT,
  owner_user_id TEXT,
  owner_name TEXT,
  owner_phone TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','qualified','lost')),
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK(sync_status IN ('pending','synced')),
  whatsapp_status TEXT NOT NULL DEFAULT 'none' CHECK(whatsapp_status IN ('none','queued','sent','failed')),
  brochure_url TEXT,
  brochure_sent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  FOREIGN KEY(owner_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notification_jobs (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'whatsapp',
  status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','processing','sent','failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(lead_id) REFERENCES leads(id)
);
`;
