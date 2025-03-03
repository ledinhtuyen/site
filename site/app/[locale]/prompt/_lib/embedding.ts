import { env } from "@/env";
import { VertexAIEmbeddings } from '@langchain/google-vertexai';

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const embeddings = new VertexAIEmbeddings({
      model: env.MODEL_EMBEDDING,
    });

    const result = await embeddings.embedQuery(text);
    return result;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}
