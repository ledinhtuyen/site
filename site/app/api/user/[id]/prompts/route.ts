import Prompt from "@/models/prompt";

/**
 * @swagger
 * /api/user/{id}/prompts:
 *   get:
 *     summary: Retrieve all prompts created by the user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of prompts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prompts:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Failed to fetch prompts
 */

export async function GET(req) {
    const url = new URL(req.url);
    const id = decodeURIComponent(url.pathname.split('/').slice(-2, -1)[0]); // Extract user ID from URL
    
    try {
        const prompts = await Prompt.find({ creator: id });
    
        return new Response(JSON.stringify({ prompts }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response("Failed to fetch prompts", { status: 500 });
    }
}
