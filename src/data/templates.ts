import type { SearchTemplate, Region } from '@/types'

export const templates: Record<Region, SearchTemplate[]> = {
  zh: [
    {
      id: 'zh-4h-hot',
      name: '4小时热议',
      description: '4小时内300赞以上的中文讨论',
      query: 'lang:zh-cn min_faves:300 within_time:4h',
      region: 'zh',
    },
    {
      id: 'zh-10k-post',
      name: '万赞神贴',
      description: '10000赞以上的中文原创内容',
      query: 'lang:zh-cn min_faves:10000 -is:retweet',
      region: 'zh',
    },
    {
      id: 'zh-ai-viral',
      name: 'AI爆款',
      description: 'AI、提示词、大模型相关热门内容',
      query: '"AI" OR "提示词" OR "大模型" lang:zh-cn min_faves:500',
      region: 'zh',
    },
    {
      id: 'zh-hot-images',
      name: '热门图文',
      description: '12小时内500赞以上的图片内容',
      query: 'filter:images lang:zh-cn min_faves:500 within_time:12h',
      region: 'zh',
    },
    {
      id: 'zh-deep-original',
      name: '深度原创',
      description: '排除回复和转发的高质量原创',
      query: '-filter:replies -is:retweet min_faves:100',
      region: 'zh',
    },
  ],
  ja: [
    {
      id: 'ja-1h-trend',
      name: '1時間急上昇',
      description: '1時間以内に500いいね以上のツイート',
      query: 'lang:ja min_faves:500 within_time:1h -is:retweet',
      region: 'ja',
    },
    {
      id: 'ja-visual-hot',
      name: '視覚的トレンド',
      description: '4時間以内に2000いいね以上の画像',
      query: 'lang:ja min_faves:2000 filter:images within_time:4h',
      region: 'ja',
    },
    {
      id: 'ja-social',
      name: '社会・生活',
      description: '社会的話題のトレンド投稿',
      query: '"なにか" OR "最高" lang:ja min_faves:3000',
      region: 'ja',
    },
    {
      id: 'ja-anime',
      name: 'アニメ・イラスト',
      description: '二次元関連の人気投稿',
      query: '#ポケモン OR #イラスト lang:ja min_faves:5000 within_time:24h',
      region: 'ja',
    },
    {
      id: 'ja-invest',
      name: '投資・資産運用',
      description: '投資・新NISA関連の人気投稿',
      query: '"資産運用" OR "新NISA" lang:ja min_faves:500',
      region: 'ja',
    },
  ],
  es: [
    {
      id: 'es-12h-hot',
      name: '12 horas caliente',
      description: 'Publicaciones populares en español',
      query: 'lang:es min_faves:5000 within_time:12h',
      region: 'es',
    },
    {
      id: 'es-viral-video',
      name: 'Video viral',
      description: 'Videos populares en español',
      query: 'lang:es min_faves:1000 filter:native_video within_time:4h',
      region: 'es',
    },
    {
      id: 'es-10k-post',
      name: '10K likes',
      description: 'Publicaciones con más de 10000 likes',
      query: 'lang:es min_faves:10000 -is:retweet',
      region: 'es',
    },
  ],
  en: [
    {
      id: 'en-ai-top',
      name: 'AI Top Posts',
      description: 'Top AI/ChatGPT posts in 12 hours',
      query: '"AI" OR "ChatGPT" lang:en min_faves:5000 within_time:12h',
      region: 'en',
    },
    {
      id: 'en-viral-video',
      name: 'Viral Videos',
      description: 'Popular videos in 4 hours',
      query: 'lang:en min_faves:1000 filter:native_video within_time:4h',
      region: 'en',
    },
    {
      id: 'en-invest',
      name: 'Investment Views',
      description: 'Investment and trading discussions',
      query: '"Investing" OR "SPY" lang:en min_faves:2000',
      region: 'en',
    },
    {
      id: 'en-tech',
      name: 'Tech Deep Dives',
      description: 'Technical content without links',
      query: 'lang:en min_faves:10000 -filter:links within_time:12h',
      region: 'en',
    },
  ],
  global: [
    {
      id: 'global-viral',
      name: 'Global Viral',
      description: 'Worldwide viral content',
      query: '"the" OR "の" OR "了" min_faves:5000 -is:retweet within_time:12h',
      region: 'global',
    },
  ],
}

export const regionLabels: Record<Region, string> = {
  zh: '中文圈',
  ja: '日本',
  es: 'Español',
  en: 'English',
  global: '全球',
}

export const allTemplates = Object.values(templates).flat()
