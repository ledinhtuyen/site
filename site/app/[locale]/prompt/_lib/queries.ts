import "server-only";
import { Prompt, promptsCollection } from "@/db/schema";
import { Query, DocumentData, WhereFilterOp } from "@google-cloud/firestore";
import { unstable_cache } from "@/lib/unstable-cache";
import { getEmbedding } from "./embedding";
import { type Filter } from "@/types";

export interface GetPromptsInput {
  page: number;
  perPage: number;
  userEmail?: string;
  appName?: string;
  searchTerm?: string;
  from?: string;
  to?: string;
  filters?: Filter<Prompt>[];
  sort?: { id: string; desc: boolean }[];
}

// Map custom filter operators to Firestore WhereFilterOp
const operatorMap: Partial<Record<string, WhereFilterOp>> = {
  'eq': '==',
  'ne': '!=',
  'lt': '<',
  'lte': '<=',
  'gt': '>',
  'gte': '>=',
};

export async function getPrompts(input: GetPromptsInput) {
  return await unstable_cache(
    async () => {
      try {
        let query: Query<DocumentData> = promptsCollection;

        // Apply non-embedding filters first
        if (input.userEmail) {
          query = query.where('userEmail', '==', input.userEmail);
        }

        if (input.appName && input.appName !== "") {
          query = query.where('appName', '==', input.appName);
        }

        if (input.from) {
          query = query.where('createdAt', '>=', new Date(input.from));
        }

        if (input.to) {
          query = query.where('createdAt', '<=', new Date(input.to));
        }

        // Apply advanced filters if provided
        if (input.filters?.length) {
          input.filters.forEach((filter) => {
            if (filter.value && filter.operator) {
              const firestoreOp = operatorMap[filter.operator];
              if (firestoreOp) {
                query = query.where(filter.id, firestoreOp, filter.value);
              }
            }
          });
        }

        // Get base query ordered by createdAt
        query = query.orderBy('createdAt', 'desc');

        // Add additional sort fields
        if (input.sort?.length) {
          input.sort.forEach(({ id, desc }) => {
            if (id !== 'createdAt') {
              query = query.orderBy(id, desc ? 'desc' : 'asc');
            }
          });
        }

        // Apply vector similarity search if searchTerm is provided
        if (input.searchTerm) {
          const searchEmbedding = await getEmbedding(input.searchTerm);
          query = query.findNearest({
            vectorField: 'promptNameEmbedding',
            queryVector: searchEmbedding,
            limit: 10,
            distanceMeasure: 'COSINE',
          }).query;
        }

        // Get all matching documents before pagination
        const snapshot = await query.get();

        let prompts = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            promptId: doc.id,
            appName: data.appName,
            userEmail: data.userEmail,
            anonymous: data.anonymous,
            promptName: data.promptName,
            promptNameEmbedding: data.promptNameEmbedding || [],
            content: data.content,
            howToUse: data.howToUse,
            likedBy: data.likedBy || [],
            bookmarkedBy: data.bookmarkedBy || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Prompt;
        });

        // Handle pagination after all filtering
        const total = prompts.length;
        const pageCount = Math.ceil(total / input.perPage);
        const start = (input.page - 1) * input.perPage;
        const end = start + input.perPage;

        return {
          data: prompts.slice(start, end),
          pageCount,
          total
        };
      } catch (err) {
        console.error('Error fetching prompts:', err);
        return {
          data: [],
          pageCount: 0,
          total: 0
        };
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 3600,
      tags: ["prompts"],
    }
  )();
}

export async function getPromptsByUserEmail(userEmail: string) {
  return await unstable_cache(
    async () => {
      try {
        const snapshot = await promptsCollection
          .where('userEmail', '==', userEmail)
          .orderBy('createdAt', 'desc')
          .get();

        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            promptId: doc.id,
            appName: data.appName,
            userEmail: data.userEmail,
            anonymous: data.anonymous,
            promptName: data.promptName,
            promptNameEmbedding: data.promptNameEmbedding || [],
            content: data.content,
            howToUse: data.howToUse,
            likedBy: data.likedBy || [],
            bookmarkedBy: data.bookmarkedBy || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Prompt;
        });
      } catch (err) {
        console.error('Error fetching prompts by email:', err);
        return [];
      }
    },
    [`prompts-by-email-${userEmail}`],
    {
      revalidate: 3600,
      tags: ["prompts"],
    }
  )();
}

export async function getPromptsByAppName(appName: string) {
  return await unstable_cache(
    async () => {
      try {
        let query: Query<DocumentData> = promptsCollection;

        if (appName && appName !== "") {
          query = query.where('appName', '==', appName);
        }

        const snapshot = await query
          .orderBy('createdAt', 'desc')
          .get();

        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            promptId: doc.id,
            appName: data.appName,
            userEmail: data.userEmail,
            anonymous: data.anonymous,
            promptName: data.promptName,
            promptNameEmbedding: data.promptNameEmbedding || [],
            content: data.content,
            howToUse: data.howToUse,
            likedBy: data.likedBy || [],
            bookmarkedBy: data.bookmarkedBy || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Prompt;
        });
      } catch (err) {
        console.error('Error fetching prompts by app:', err);
        return [];
      }
    },
    [`prompts-by-app-${appName}`],
    {
      revalidate: 3600,
      tags: ["prompts"],
    }
  )();
}
