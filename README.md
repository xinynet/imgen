 把https://github.com/CookSleep/gpt_image_playground                                                               
  下载到我的项目文件夹整合到我的项目里，该项目的playground显示在导航栏下方


  Step 1: Install dependencies

 cd /home/silas/开发/awesome-gpt-image-2
 npm install zustand fflate @fal-ai/client
 npm install -D tailwindcss@^3.4.17 postcss autoprefixer typescript @types/react @types/react-dom

 Step 2: Create config files

 tsconfig.json (project root) — TypeScript config targeting ES2020, JSX react-jsx, strict, noEmit, moduleResolution
  bundler, include src/playground.

 tailwind.config.js (project root) — important: '#playground-root', corePlugins: { preflight: false }, darkMode:
 'media', content: ['./src/playground/**/*.{js,ts,jsx,tsx}'], colors gray→zinc, custom sans/mono font families.

 postcss.config.js (project root) — tailwindcss + autoprefixer plugins.

 src/vite-env.d.ts — Vite client types + __APP_VERSION__ and __DEV_PROXY_CONFIG__ declarations.

 Step 3: Copy playground source files

 Create directories:
 mkdir -p src/playground/components src/playground/hooks src/playground/lib

 Copy all .ts and .tsx files from /tmp/gpt_image_playground/src/ to src/playground/, preserving directory
 structure. Skip:
 - Header.tsx (gallery's topbar replaces it)
 - useVersionCheck.ts, useDockerApiUrlMigrationNotice.ts (irrelevant to embedded use)
 - All *.test.ts/*.test.tsx files (no test infra)
Files being copied (~50 total):
 - Core: types.ts, store.ts, vite-env.d.ts
 - Components: All except Header.tsx (17 files: InputBar, SettingsModal, TaskGrid, TaskCard, DetailModal, Lightbox,
  SearchBar, Toast, ConfirmDialog, Select, Checkbox, SizePickerModal, MaskEditorModal, HelpModal,
 SupportPromptModal, ImageContextMenu, ViewportTooltip, icons)
 - Lib: All non-test .ts/.tsx files (18 files)
 - Hooks: useCloseOnEscape.ts, usePreventBackgroundScroll.ts, useTooltip.ts

 Step 4: Create playground wrapper

 src/playground/App.tsx — Adapted from original App.tsx:
 - Removes <Header /> import/render (gallery provides navigation)
 - Removes useDockerApiUrlMigrationNotice
 - Wraps output in <div id="playground-root"> for Tailwind scoping
 - Passes Tailwind body-equivalent classes (bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100
 min-h-screen)
 - Keeps all modals (DetailModal, Lightbox, SettingsModal, etc.), initStore(), search params handling

 src/playground/index.css — Adapted from original src/index.css:
 - Tailwind directives (@tailwind base/components/utilities)
 - CDN font imports kept
 - :root → #playground-root for custom properties (--font-ui-sans, --font-mono, safe-area vars)
 - All unscoped selectors moved under #playground-root
 - Animation keyframes, mention-tag styles, collapse-section preserved

Step 5: Modify gallery src/main.jsx

 Changes to App component (line ~2928):

 1. Add imports (near top):
 import PlaygroundApp from './playground/App';
 import './playground/index.css';

 2. Add navPlayground to both en and zh copy objects (~line 45-450).
 3. Add page state: const [currentPage, setCurrentPage] = useState('gallery');
 4. Add scrollToSection helper to restore hash-based navigation when switching back to gallery.
 5. In the topbar <nav> — add Playground button with active styling.
 6. Wrap gallery content (Hero, hotStrip, gallerySection, TemplateSection, SkillSection, modals) in conditional:
 {currentPage === 'playground' ? <PlaygroundApp /> : (<>gallery content</>)}
     6. Wrap gallery content (Hero, hotStrip, gallerySection, TemplateSection, SkillSection, modals) in conditional:
      {currentPage === 'playground' ? <PlaygroundApp /> : (<>gallery content</>)}
     7. Topbar always renders regardless of page.

     Step 6: Modify vite.config.js

     Add define block:
     define: {
       __APP_VERSION__: JSON.stringify('0.3.5'),
       __DEV_PROXY_CONFIG__: JSON.stringify(null),
     },

     Verification


     1. npm run dev starts without errors
     2. Gallery renders identically to before integration
     3. Click "Playground" nav link → playground renders below topbar with its own theme
     4. CSS NOT leaking: gallery elements don't get Tailwind classes; playground Tailwind works correctly
     5. Playground works: API key config persists in IndexedDB, image generation works
     6. Switch back to Gallery → sections reappear, scroll-to-section works
     7. No console errors
     8. Both gallery and playground show/hide work responsively

   
  已创建/修改的文件：

  ┌──────┬──────────────────────────────────────────────────────┐
  │ 新增 │ src/vite-env.d.ts                                    │
  ├──────┼──────────────────────────────────────────────────────┤
  │ 新增 │ src/playground/ 目录（~50 个 TS/TSX 文件）           │
  ├──────┼──────────────────────────────────────────────────────┤
  │ 新增 │ src/playground/App.tsx（包装组件，无 Header）        │
  ├──────┼──────────────────────────────────────────────────────┤
  │ 新增 │ src/playground/index.css（Tailwind + scoped 样式）   │
  ├──────┼──────────────────────────────────────────────────────┤
  │ 修改 │ src/main.jsx（引入 Playground、导航按钮、页面切换）  │
  ├──────┼──────────────────────────────────────────────────────┤
  │ 修改 │ vite.config.js（添加 __APP_VERSION__ 定义）          │
  └──────┴──────────────────────────────────────────────────────┘

  关键设计：
  - CSS 隔离：Tailwind 使用 important: '#playground-root' + preflight: false，不会污染画廊现有样式
  - 导航栏始终可见，点击"Playground"后的主要内容区切换为 playground 组件
  - 点击画廊导航（Cases/Templates/Skill）自动切回画廊并滚动到对应区域
  - Playground 的 API 配置、任务历史保存在浏览器 IndexedDB（独立于画廊后端）
  - 集成方式通过 ?apiUrl=...&apiKey=... 等 URL 参数支持快速配置

  运行 npm run dev 即可看到效果，点击导航栏的 "Playground" 按钮即可进入生图演练场。



