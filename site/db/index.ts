import { env } from "@/env.js";
import { Firestore } from "@google-cloud/firestore";

const firestore = new Firestore({
  projectId: env.GOOGLE_CLOUD_PROJECT_ID,
  databaseId: env.FIRESTORE_DATABASE_ID,
});

export { firestore as db };
