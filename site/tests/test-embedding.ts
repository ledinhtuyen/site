import { VertexAIEmbeddings  } from '@langchain/google-vertexai';

async function main() {
  const embeddings = new VertexAIEmbeddings({
    model: 'text-multilingual-embedding-002',
  });
  embeddings.embedDocuments(['Hello, world!', 'Goodbye, world!']).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.error(error);
  }
  );
}

main();