import { DocumentData, Query, WithFieldValue } from "@google-cloud/firestore";
import { News, NewNews } from "@/types/news";
import { db } from "./index";

// Create a new news item
export async function createNews(data: NewNews) {
  try {
    // Create document reference
    const docRef = db.collection('news').doc();
    
    const now = new Date();
    
    const newNews: WithFieldValue<News> = {
      id: docRef.id,
      title: data.title,
      postDate: data.postDate,
      link: data.link,
      createdAt: now,
      updatedAt: now,
    };
    
    await docRef.set(newNews);
    return newNews as News;
  } catch (error) {
    console.error("Error in createNews:", error);
    throw error;
  }
}

// List all news items sorted by most recent postDate
export async function listNews(limit?: number) {
  let query: Query<DocumentData> = db.collection('news').orderBy('postDate', 'desc');
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      postDate: data.postDate?.toDate(),
      link: data.link,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as News;
  });
}

// Get latest news items
export async function getLatestNews(count: number = 5) {
  return listNews(count);
}
