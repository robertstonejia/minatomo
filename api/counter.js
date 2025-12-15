import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  try {
    // カウンターをインクリメントして現在値を取得
    const count = await kv.incr('page_views');

    res.status(200).json({
      count: count,
      show: count > 1000  // 1000回超えたら表示フラグをtrue
    });
  } catch (error) {
    console.error('Counter error:', error);
    res.status(500).json({ error: 'Failed to update counter' });
  }
}
