# X Query Search - Implementation Plan

## Project Overview
A Chrome extension for advanced X.com search with templates and query builder.

## Tech Stack
- **Build**: Vite + @crxjs/vite-plugin
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Type**: TypeScript

## Project Structure
```
x-query-search/
├── package.json              ✅ Created
├── tsconfig.json             ✅ Created
├── tsconfig.node.json        ✅ Created
├── vite.config.ts            ✅ Created
├── tailwind.config.js        ✅ Created
├── postcss.config.js         ✅ Created
├── src/
│   ├── manifest.ts           ✅ Created
│   ├── types/index.ts        ✅ Created
│   ├── stores/useStore.ts    ✅ Created
│   ├── data/templates.ts     ✅ Created
│   ├── utils/
│   │   ├── queryBuilder.ts   ✅ Created
│   │   ├── queryBuilder.test.ts  ✅ Created
│   │   ├── xSearch.ts        ✅ Created
│   │   └── xSearch.test.ts   ✅ Created
│   ├── background/index.ts   ✅ Created
│   ├── content/
│   │   ├── index.tsx         ✅ Created
│   │   └── Sidebar.tsx       ✅ Created
│   ├── components/
│   │   ├── Header.tsx        ✅ Created
│   │   ├── TabNav.tsx        ✅ Created
│   │   ├── TemplateList.tsx  ✅ Created
│   │   ├── TemplateCard.tsx  ✅ Created
│   │   ├── QueryBuilder.tsx  ❌ TODO
│   │   ├── FavoritesList.tsx ❌ TODO
│   │   └── QueryPreview.tsx  ❌ TODO
│   ├── styles/sidebar.css    ✅ Created
│   └── test/setup.ts         ✅ Created
└── public/icons/             ❌ TODO (need icon files)
```

## Remaining Work

### Phase 3: Templates (mostly done)
- [x] Template data file
- [x] Region selector
- [x] Template list/cards
- [ ] Add "save as favorite" button on template cards

### Phase 4: Query Builder
- [ ] QueryBuilder.tsx - main form component
- [ ] Basic params: keywords, language, time range, min likes
- [ ] Advanced params (collapsible): media type, exclude filters
- [ ] QueryPreview.tsx - real-time query preview
- [ ] Search button + Save to favorites button

### Phase 5: Favorites
- [ ] FavoritesList.tsx - display saved queries
- [ ] Edit favorite (rename/modify query)
- [ ] Delete favorite with confirmation
- [ ] Ensure chrome.storage persistence works

### Phase 6: Final Polish
- [ ] Create icon files (16/48/128px)
- [ ] Test on actual Chrome with x.com
- [ ] Verify sidebar slide animation
- [ ] Run `pnpm install && pnpm dev`
- [ ] Load unpacked extension in chrome://extensions

## Key Files Reference

### QueryBuilder Component Structure
```tsx
// Basic params (always visible)
- KeywordsInput (tag-like input for multiple keywords)
- LanguageSelect (zh-cn/ja/es/en/all)
- TimeRangeSelect (1h/4h/12h/24h/7d/all)
- MinFavesSlider (100/500/1000/5000/10000)

// Advanced params (collapsible)
- MediaTypeCheckboxes (images/videos)
- ExcludeCheckboxes (retweets/replies/links)

// Actions
- QueryPreview (live preview of generated query)
- SearchButton
- SaveToFavoritesButton
```

### FavoritesList Component Structure
```tsx
// For each favorite:
- Name
- Query preview
- Created date
- Actions: Search, Edit, Delete
```

## Commands to Run
```bash
cd /Users/jarodise/Documents/GitHub/XQuery
pnpm install
pnpm dev
# Then load dist/ folder as unpacked extension in Chrome
```

## UI Theme
- Background: #000000 (pure black)
- Elevated: #16181c
- Surface: #202327
- Border: #2f3336
- Text: #e7e9ea
- Secondary: #71767b
- Accent (X Blue): #1d9bf0
- Font: JetBrains Mono
