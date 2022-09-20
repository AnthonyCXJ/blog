import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '张无忌的Blog',
  description: '张无忌的Blog',
  appearance: true,
  base: '/blog/',
  lastUpdated: '上次更新',
  themeConfig: {
    siteTitle: '张无忌的博客',
    logo: '/logo.svg',
     // 顶部菜单
    nav: [
      { text: '首页', link: '/index.md' },
      { text: '我的笔记', link: '/daily/index.md' },
      { text: '前端总结', link: '/javascript' },
      { text: '生活感悟', link: '/life/index.md' },
      { text: '我的掘金', link: 'https://juejin.cn/user/1926000101300776' },
      { text: '关于我', link: '/me/index.md' }
    ],
    // 社交链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/AnthonyCXJ' }],

    // 侧边栏 Sidebar
    sidebar: {
      // 我的笔记
      '/daily/': [
        {
          text: 'vue3',
          items: [{ text: '子菜单', link: '/daily/vue3.md' }]
        }
      ],
      // 生活感悟
      '/life/': [
        {
          text: '生活感悟',
          items: [{ text: '子菜单', link: '/life/' }]
        }
      ]
    }
  },
  vite: {
    server: {
      host: true,
      port: 3000,
      // open: true
    }
  }
})
