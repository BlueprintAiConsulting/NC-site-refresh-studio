/* eslint-disable @typescript-eslint/no-explicit-any */
// Lovable-only local runtime shim for legacy Supabase call-sites.
// This keeps existing UI modules functioning without networked Supabase services.

import type { Database } from './types';

type QueryResult<T = any> = {
  data: T;
  error: null;
  count?: number | null;
};

const DB_PREFIX = 'lovable-db-table:';
const STORAGE_PREFIX = 'lovable-db-storage:';

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const readTable = (table: string): any[] => readJson<any[]>(`${DB_PREFIX}${table}`, []);
const writeTable = (table: string, rows: any[]) => writeJson(`${DB_PREFIX}${table}`, rows);

const applyFilters = (rows: any[], filters: Array<{ field: string; value: any }>) =>
  rows.filter((row) => filters.every((f) => row?.[f.field] === f.value));

class LocalQueryBuilder implements PromiseLike<QueryResult<any>> {
  private filters: Array<{ field: string; value: any }> = [];
  private orderBy?: { field: string; ascending: boolean };
  private maxRows?: number;
  private op: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private payload: any = null;
  private head = false;
  private singleMode: 'none' | 'single' | 'maybeSingle' = 'none';
  private includeCount = false;

  constructor(private table: string) {}

  select(_columns?: string, options?: { count?: 'exact'; head?: boolean }) {
    this.op = 'select';
    this.head = options?.head === true;
    this.includeCount = options?.count === 'exact';
    return this;
  }

  insert(payload: any) {
    this.op = 'insert';
    this.payload = payload;
    return this;
  }
});
