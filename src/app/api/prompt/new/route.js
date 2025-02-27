import { getEmail } from "@utils/server";
import Prompt from "@models/prompt"

/**
 * @swagger
 * /api/prompt/new:
 *   post:
 *     summary: Create a new prompt
 *     description: Create a new prompt with the given prompt text and tag.
 *     tag: Prompt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The prompt text
 *               tag:
 *                 type: string
 *                 description: The tag for the prompt
 *     responses:
 *       201:
 *         description: Success for create a new prompt
 *       500:
 *         description: Failed to create a new prompt
 */

export const POST = async (request) => {
  const { prompt, tag } = await request.json();
  const creator = getEmail(request);

  try {
    const result = await Prompt.create({ creator, prompt, tag });

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
