//
// 🧮 Aggregate scores from multiple questions
//
export const calculateFinalScore = (evaluations) => {
  if (!evaluations.length) return 0;

  let totals = {
    correctness: 0,
    clarity: 0,
    depth: 0,
    confidence: 0
  };

  evaluations.forEach((e) => {
    totals.correctness += e.correctness || 0;
    totals.clarity += e.clarity || 0;
    totals.depth += e.depth || 0;
    totals.confidence += e.confidence || 0;
  });

  const count = evaluations.length;

  const avg = {
    correctness: totals.correctness / count,
    clarity: totals.clarity / count,
    depth: totals.depth / count,
    confidence: totals.confidence / count
  };

  // 🎯 Weighted final score (0–100)
  const finalScore = Math.round(
    (avg.correctness * 0.4 +
      avg.depth * 0.3 +
      avg.clarity * 0.2 +
      avg.confidence * 0.1) * 10
  );

  return {
    finalScore,
    avg
  };
};
