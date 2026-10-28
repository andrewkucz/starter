import { defaultShouldDehydrateQuery, type DehydrateOptions } from "@tanstack/react-query";
import type { PersistedClient, Persister } from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";

export const PERSISTED_QUERY_CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour

const storageKey = "acme-query-cache";

interface QueryMeta extends Record<string, unknown> {
  /** Opt a query into the IndexedDB cache that survives page reloads. */
  persist?: boolean;
}

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: QueryMeta;
  }
}

export const persistedQueryDehydrateOptions: DehydrateOptions = {
  shouldDehydrateMutation: () => false,
  shouldDehydrateQuery: (query) => !!query.meta?.persist && defaultShouldDehydrateQuery(query),
};

function createIDBPersister(): Persister {
  return {
    persistClient: async (client) => {
      try {
        await set(storageKey, client);
      } catch (error) {
        // Storage is optional; quota or browser restrictions must not break navigation.
        console.warn("Unable to persist the query cache.", error);
      }
    },
    restoreClient: () => get<PersistedClient>(storageKey),
    removeClient: async () => {
      try {
        await del(storageKey);
      } catch (error) {
        console.warn("Unable to remove the query cache.", error);
      }
    },
  };
}

export function createQueryPersistOptions() {
  return {
    persister: createIDBPersister(),
    maxAge: PERSISTED_QUERY_CACHE_MAX_AGE,
    buster: "v1",
    dehydrateOptions: persistedQueryDehydrateOptions,
  };
}
