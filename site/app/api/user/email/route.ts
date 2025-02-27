import { NextResponse } from "next/server";
import { getEmail } from "@/lib/server";

/**
 * @swagger
 * /api/user/email:
 *   get:
 *     summary: Get user email
 *     description: Retrieve the email of the user making the request.
 *     tag: User
 *     responses:
 *       200:
 *         description: The user's email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: The user's email
 *       500:
 *         description: Failed to fetch user email
 */

interface GetEmailResponse {
  email: string;
}

export async function GET(req: Request): Promise<NextResponse<GetEmailResponse>> {
  const email: string = getEmail(req);

  return NextResponse.json({ email });
}
