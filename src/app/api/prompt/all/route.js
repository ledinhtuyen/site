import Prompt from "@models/prompt";

/**
 * @swagger
 * /api/prompt/all:
 *   get:
 *     summary: Get all prompts
 *     description: Retrieve a list of all prompts.
 *     tag: Prompt
 *     responses:
 *       200:
 *         description: A list of prompts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   creator:
 *                     type: string
 *                     description: The creator's email
 *                   prompt:
 *                     type: string
 *                     description: The prompt text
 *                   tag:
 *                     type: string
 *                     description: The tag for the prompt
 *       500:
 *         description: Failed to fetch prompts
 */

export const GET = async (request) => {
  try {
    const prompts = await Prompt.getAll();
    return new Response(JSON.stringify(prompts), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to fetch prompts", { status: 500 });
  }
};
