export function detectLanguage(code) {
  if (!code || typeof code !== "string") return "javascript";

  const codeStr = code.trim().toLowerCase();

  // 단순화된 패턴들
  const patterns = {
    sql: {
      patterns: [
        /\bselect\b/i, // select만 있어도 SQL일 가능성 매우 높음
        /\bfrom\b/i, // from도 SQL의 핵심 키워드
        /\bwhere\b/i, // where절
        /\border by\b/i, // order by절
        /\bgroup by\b/i, // group by절
        /\s+\*\s+/, // select * 패턴
      ],
      weight: 3.0, // SQL 가중치 매우 높게
    },
    java: {
      patterns: [
        /public class/i,
        /public static void main/i,
        /System\.out\.print/i,
        /new \w+\(/i,
      ],
      weight: 1.5,
    },
    javascript: {
      patterns: [/const |let |var /, /function\s+\w+\s*\(/, /=>/, /console\./],
      weight: 1.0,
    },
  };

  let maxScore = 0;
  let detectedLang = "javascript";

  // 각 언어별 점수 계산
  Object.entries(patterns).forEach(
    ([lang, { patterns: langPatterns, weight }]) => {
      let score = 0;
      for (const pattern of langPatterns) {
        if (pattern.test(codeStr)) {
          score += 1;
          // SQL 키워드 매칭시 추가 점수
          if (
            lang === "sql" &&
            ["select", "from", "where"].some((keyword) =>
              new RegExp(`\\b${keyword}\\b`, "i").test(codeStr)
            )
          ) {
            score += 2;
          }
        }
      }

      score *= weight;

      if (score > maxScore) {
        maxScore = score;
        detectedLang = lang;
      }
    }
  );

  return detectedLang;
}
