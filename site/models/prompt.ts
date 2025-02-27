import FirestoreService from "@/lib/database";
import { v4 as uuidv4 } from "uuid";

const firestore = new FirestoreService();

interface PromptData {
  creator: string;
  prompt: string;
  tag: string;
}

class Prompt {
  static async create({ creator, prompt, tag }: PromptData): Promise<any> {
    const uniqueID = uuidv4();
    try {
      const docRef = await firestore.addDocument(`prompts/${uniqueID}`, {
        id: uniqueID,
        creator,
        prompt,
        tag,
      });
      return docRef;
    } catch (error) {
      console.error('Error creating prompt: ', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<any> {
    try {
      const prompt = await firestore.getDocument(`prompts/${id}`);
      return prompt;
    } catch (error) {
      console.error('Error fetching prompt: ', error);
      throw error;
    }
  }

  static async getAll(): Promise<any[]> {
    try {
      // Get all documents from the 'prompts' collection
      const prompts = await firestore.getCollection('prompts');
      return prompts;
    } catch (error) {
      console.error('Error fetching prompts: ', error);
      throw error;
    }
  }

  static async find({ creator }: { creator: string }): Promise<any[]> {
    try {
      const prompts = await firestore.queryDocuments('prompts', 'creator', '==', creator);
      return prompts;
    } catch (error) {
      console.error('Error fetching prompts: ', error);
      throw error;
    }
  }

  static async update(id: string, { prompt, tag }: { prompt: string; tag: string }): Promise<void> {
    try {
      await firestore.updateDocument(`prompts/${id}`, { prompt, tag });
      console.log(`Prompt with ID ${id} updated successfully`);
    } catch (error) {
      console.error('Error updating prompt: ', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await firestore.deleteDocument(`prompts/${id}`);
      console.log(`Prompt with ID ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting prompt: ', error);
      throw error;
    }
  }
}

export default Prompt;
