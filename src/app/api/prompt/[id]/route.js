import Prompt from '@models/prompt';

/**
 * @swagger
 * /api/prompt/{id}:
 *   get:
 *     summary: Get a prompt by ID
 *     description: Retrieve a prompt by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the prompt.
 *     responses:
 *       200:
 *         description: A prompt object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 creator:
 *                   type: string
 *                 prompt:
 *                   type: string
 *                 tag:
 *                   type: string
 *       404:
 *         description: Prompt not found.
 *       500:
 *         description: Internal server error.
 *   patch:
 *     summary: Update a prompt by ID
 *     description: Update a prompt's details by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the prompt.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *               tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prompt updated successfully.
 *       404:
 *         description: Prompt not found.
 *       500:
 *         description: Internal server error.
 *   delete:
 *     summary: Delete a prompt by ID
 *     description: Delete a prompt by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the prompt.
 *     responses:
 *       200:
 *         description: Prompt deleted successfully.
 *       404:
 *         description: Prompt not found.
 *       500:
 *         description: Internal server error.
 */

export const GET = async (req) => {
  const id = req.url.split('/').pop(); // Extract id from URL

  try {
    const prompt = await Prompt.getById(id);
    if (!prompt) {
      return new Response(JSON.stringify({ message: 'Prompt not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    console.error('Error fetching prompt: ', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
};

export const PATCH = async (req) => {
  const id = req.url.split('/').pop(); // Extract id from URL
  
  const { prompt, tag } = await req.json();
  try {
    const existingPrompt = await Prompt.getById(id);
    if (!existingPrompt) {
      return new Response(JSON.stringify({ message: 'Prompt not found' }), { status: 404 });
    }
    await Prompt.update(id, { prompt, tag });
    return new Response(JSON.stringify({ message: 'Prompt updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating prompt: ', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
};

export const DELETE = async (req) => {
  const id = req.url.split('/').pop(); // Extract id from URL

  try {
    const existingPrompt = await Prompt.getById(id);
    if (!existingPrompt) {
      return new Response(JSON.stringify({ message: 'Prompt not found' }), { status: 404 });
    }
    await Prompt.delete(id);
    return new Response(JSON.stringify({ message: 'Prompt deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting prompt: ', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
};
