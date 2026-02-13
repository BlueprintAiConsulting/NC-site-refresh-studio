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

  update(payload: any) {
    this.op = 'update';
    this.payload = payload;
    return this;
  }

  delete() {
    this.op = 'delete';
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push({ field, value });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderBy = { field, ascending: options?.ascending !== false };
    return this;
  }

  limit(count: number) {
    this.maxRows = count;
    return this;
  }

  single() {
    this.singleMode = 'single';
    return this;
  }

  maybeSingle() {
    this.singleMode = 'maybeSingle';
    return this;
  }

  private execute(): QueryResult<any> {
    const current = readTable(this.table);

    if (this.op === 'insert') {
      const rows = Array.isArray(this.payload) ? this.payload : [this.payload];
      const enriched = rows.map((row) => ({
        id: row?.id ?? crypto.randomUUID(),
        created_at: row?.created_at ?? new Date().toISOString(),
        ...row,
      }));
      writeTable(this.table, [...current, ...enriched]);
      return { data: enriched, error: null };
    }

    if (this.op === 'update') {
      const updated = current.map((row) =>
        applyFilters([row], this.filters).length ? { ...row, ...this.payload } : row,
      );
      writeTable(this.table, updated);
      return { data: null, error: null };
    }

    if (this.op === 'delete') {
      const kept = current.filter((row) => !applyFilters([row], this.filters).length);
      writeTable(this.table, kept);
      return { data: null, error: null };
    }

    let data = applyFilters(current, this.filters);

    if (this.orderBy) {
      const { field, ascending } = this.orderBy;
      data = [...data].sort((a, b) => {
        const av = a?.[field];
        const bv = b?.[field];
        if (av === bv) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        return ascending ? (av > bv ? 1 : -1) : av > bv ? -1 : 1;
      });
    }

    if (typeof this.maxRows === 'number') {
      data = data.slice(0, this.maxRows);
    }

    const count = this.includeCount ? data.length : undefined;

    if (this.head) {
      return { data: null, error: null, count: count ?? null };
    }

    if (this.singleMode === 'single') {
      return { data: data[0] ?? null, error: null };
    }

    if (this.singleMode === 'maybeSingle') {
      return { data: data[0] ?? null, error: null };
    }

    return { data, error: null, count: count ?? null };
  }

  then<TResult1 = QueryResult<any>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<any>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.execute()).then(onfulfilled, onrejected);
  }
}

const storageFrom = (bucket: string) => ({
  upload: async (path: string, _file: unknown, _opts?: unknown) => {
    const entries = readJson<Record<string, string>>(`${STORAGE_PREFIX}${bucket}`, {});
    entries[path] = new Date().toISOString();
    writeJson(`${STORAGE_PREFIX}${bucket}`, entries);
    return { data: { path }, error: null };
  },
  remove: async (paths: string[]) => {
    const entries = readJson<Record<string, string>>(`${STORAGE_PREFIX}${bucket}`, {});
    for (const p of paths) delete entries[p];
    writeJson(`${STORAGE_PREFIX}${bucket}`, entries);
    return { data: null, error: null };
  },
  list: async (_prefix = '', _opts?: unknown) => {
    const entries = readJson<Record<string, string>>(`${STORAGE_PREFIX}${bucket}`, {});
    const data = Object.keys(entries).map((name) => ({ name }));
    return { data, error: null };
  },
  getPublicUrl: (path: string) => ({
    data: { publicUrl: `local-storage://${bucket}/${path}` },
  }),
});

export const supabase: any = {
  from: (table: keyof Database['public']['Tables'] | string) => new LocalQueryBuilder(String(table)),
  rpc: async (_fn: string, _args?: unknown) => ({ data: null, error: null }),
  functions: {
    invoke: async (name: string, _options?: { body?: unknown }) => {
      if (name === 'send-contact-email') {
        return { data: { success: true, message: 'Stored locally (Lovable mode).' }, error: null };
      }
      if (name === 'get-monthly-visitors') {
        return { data: { visitors: 0 }, error: null };
      }
      return { data: null, error: null };
    },
  },
  storage: {
    from: storageFrom,
  },
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
    signInWithPassword: async () => ({ data: { user: null }, error: { message: 'Disabled in Lovable-only mode' } }),
    signOut: async () => ({ error: null }),
  },
};
