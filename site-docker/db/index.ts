import { env } from "@/env";
import { Firestore } from "@google-cloud/firestore";

export const db = new Firestore({
  projectId: env.GOOGLE_CLOUD_PROJECT_ID,
  databaseId: env.FIRESTORE_DATABASE_ID,
});
