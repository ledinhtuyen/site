import { env } from "@/env";
import { VertexAIEmbeddings } from '@langchain/google-vertexai';

export async function getEmbedding(text: string | string[]): Promise<number[]> {
  try {
    const embeddings = new VertexAIEmbeddings({
      model: env.MODEL_EMBEDDING,
    });

    // If an array of strings is provided, combine them with spaces in between
    const combinedText = Array.isArray(text) ? text.filter(Boolean).join(' ') : text;
    
    const result = await embeddings.embedQuery(combinedText);
    return result;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}
