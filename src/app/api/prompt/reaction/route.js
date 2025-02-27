import FirestoreService from '@utils/database';

const firestore = new FirestoreService();

export const POST = async (request) => {
  const { promptId, reactions } = await request.json();

  try {
    // Calculate the total number of reactions
    const totalReactions = Object.values(reactions).reduce((acc, emails) => acc + emails.length, 0);

    // Update the reactions and totalReactions in the database
    await firestore.updateDocument(`prompts/${promptId}`, { reactions, totalReactions });
    return new Response(JSON.stringify({ message: 'Reactions updated successfully' }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Failed to update reactions', error);
    return new Response(JSON.stringify({ message: 'Failed to update reactions' }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
};
