import { loadUSE } from './useLoader';
import { FIELD_CATEGORIES } from './categories';

function cosineSimilarity(a, b) {
  let dot = 0.0,
    normA = 0.0,
    normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function classifyLabel(labelText, threshold = 0.75) {
  const model = await loadUSE();
  const labelEmbedding = (await model.embed([labelText])).arraySync()[0];

  let best = { category: null, score: 0 };

  for (const cat of FIELD_CATEGORIES) {
    for (const example of cat.examples) {
      const exampleEmbedding = (await model.embed([example])).arraySync()[0];
      const score = cosineSimilarity(labelEmbedding, exampleEmbedding);
      if (score > best.score) {
        best = { category: cat, score };
      }
    }
  }

  return best.score >= threshold
    ? {
        id: best.category.id,
        display: best.category.display,
        score: best.score
      }
    : null;
}
