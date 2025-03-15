import { db } from "./index";
import { getEmbedding } from "@/lib/embedding";
import { env } from "@/env";
import { Prompt } from "@/types/prompt";

async function updateEmbeddings() {
  try {
    console.log(`⏳ Updating prompt embeddings with model: ${env.MODEL_EMBEDDING}`);
    
    // Get all prompts from the database
    const promptsSnapshot = await db.collection('prompts').get();
    
    if (promptsSnapshot.empty) {
      console.log("No prompts found in the database.");
      return;
    }
    
    console.log(`Found ${promptsSnapshot.size} prompts to update.`);
    
    // Update each prompt with a new embedding
    const updatePromises = promptsSnapshot.docs.map(async (doc) => {
      const promptData = doc.data() as Prompt;
      const promptId = doc.id;
      
      try {
        // Generate new embedding for promptName, content, and howToUse
        const newEmbedding = await getEmbedding([
          promptData.promptName,
          promptData.content,
          promptData.howToUse
        ]);
        
        // Update the prompt with the new embedding
        await db.collection('prompts').doc(promptId).update({
          embedding: newEmbedding,
          updatedAt: new Date()
        });
        
        return {
          promptId,
          promptName: promptData.promptName,
          success: true
        };
      } catch (error) {
        console.error(`Error updating embedding for prompt ${promptId}:`, error);
        return {
          promptId,
          promptName: promptData.promptName,
          success: false,
          error
        };
      }
    });
    
    // Wait for all updates to complete
    const results = await Promise.all(updatePromises);
    
    // Count successes and failures
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    console.log(`✅ Successfully updated embeddings for ${successCount} prompts.`);
    
    if (failureCount > 0) {
      console.log(`❌ Failed to update embeddings for ${failureCount} prompts.`);
      console.log("Failed prompts:");
      results.filter(r => !r.success).forEach(r => {
        console.log(`- ${r.promptName} (${r.promptId})`);
      });
    }
  } catch (error) {
    console.error("Failed to update prompt embeddings:", error);
    throw error;
  }
}

async function runUpdate() {
  console.log("⏳ Running embedding update...");

  const start = Date.now();

  await updateEmbeddings();

  const end = Date.now();

  console.log(`✅ Embedding update completed in ${end - start}ms`);

  process.exit(0);
}

runUpdate().catch((err) => {
  console.error("❌ Embedding update failed");
  console.error(err);
  process.exit(1);
});
