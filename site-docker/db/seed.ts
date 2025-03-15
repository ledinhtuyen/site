import { AppNames, Models } from "@/types/prompt";
import { createPrompt } from "./prompt";

async function seedTasks() {
  try {
    // Sample prompts data
    const samplePrompts = [
      {
        appName: AppNames.copilot,
        userEmail: "test@example.com",
        anonymous: false,
        promptName: "Extract Technical Specifications",
        content: "Extract all technical specifications from the following document: {{document}}",
        howToUse: "Replace {{document}} with the text you want to analyze.",
      },
      {
        appName: AppNames.chat,
        model: Models.gpt4,
        userEmail: "test@example.com",
        anonymous: false,
        promptName: "Technical Support Assistant",
        content: "You are a technical support assistant for EBARA products. Help the user with their question: {{question}}",
        howToUse: "Replace {{question}} with the user's technical support question.",
      },
      {
        appName: AppNames.gemini,
        model: Models.gemini2Flash,
        userEmail: "test@example.com",
        anonymous: true,
        promptName: "Meeting Transcription",
        content: "Transcribe the following audio and format it as a meeting summary with action items: {{audio}}",
        howToUse: "Replace {{audio}} with the audio file to transcribe.",
      },
      {
        appName: AppNames.notebooklm,
        userEmail: "admin@ebara.com",
        anonymous: false,
        promptName: "Extract Maintenance Requirements",
        content: "Extract all maintenance requirements and schedules from the following manual: {{manual}}",
        howToUse: "Replace {{manual}} with the maintenance manual text.",
      },
      {
        appName: AppNames.chat,
        userEmail: "admin@ebara.com",
        anonymous: false,
        promptName: "Product Recommendation",
        content: "Based on the following requirements, recommend the most suitable EBARA product: {{requirements}}",
        howToUse: "Replace {{requirements}} with the customer's requirements.",
      }
    ];
    
    // Create the sample prompts
    const createdPrompts = [];
    for (const promptData of samplePrompts) {
      const prompt = await createPrompt(promptData);
      createdPrompts.push(prompt);
    }
    
    console.log("Sample prompts created:", createdPrompts);
  } catch (error) {
    console.error("Failed to seed prompts:", error);
  }
}

async function runSeed() {
    console.log("⏳ Running seed...");
  
    const start = Date.now();
  
    await seedTasks();
  
    const end = Date.now();
  
    console.log(`✅ Seed completed in ${end - start}ms`);
  
    process.exit(0);
  }
  
  runSeed().catch((err) => {
    console.error("❌ Seed failed");
    console.error(err);
    process.exit(1);
  });
