// Vercel 서버리스 함수: 브라우저 대신 시세·뉴스를 가져와 CORS를 해결합니다.
const ALLOW = ["query1.finance.yahoo.com", "query2.finance.yahoo.com", "news.google.com", "finance.yahoo.com", "ac.stock.naver.com"];

export default async function handler(req, res) {
  try {
    const target = new URL(req.query.url);
    if (!ALLOW.includes(target.hostname)) throw new Error("blocked host");
    const r = await fetch(target, { headers: { "User-Agent": "Mozilla/5.0 (compatible; StockAIApp/0.1)" } });
    res.status(r.status);
    res.setHeader("content-type", r.headers.get("content-type") || "text/plain");
    res.setHeader("cache-control", "s-maxage=300, stale-while-revalidate=600");
    res.send(Buffer.from(await r.arrayBuffer()));
  } catch (e) {
    res.status(502).send(String(e.message));
  }
}
