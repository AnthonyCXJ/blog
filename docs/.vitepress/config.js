import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '张无忌的Blog',
  description: '张无忌的Blog',
  appearance: true,
  base: '/blog/',
  head: [['link', { rel: 'icon', href: '/logo.svg' }]],
  lastUpdated: '上次更新',
  themeConfig: {
    // siteTitle: '张无忌的博客',
    logo: '/logo.svg',
    // 顶部菜单
    nav: [
      { text: '首页', link: '/index.md' },
      { text: '我的笔记', link: '/notes/vue3/setup语法糖技巧.md' },
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
      '/notes/': [
        {
          text: 'Vue3',
          items: [
            { text: 'API解析', link: '/notes/vue3/index.md' },
            { text: 'setup语法糖技巧', link: '/notes/vue3/setup语法糖技巧.md' }
          ]
        },
        {
          text: 'Vite',
          items: [
            { text: 'Vite配置解析', link: '/notes/vite/vite配置解析.md' }
          ]
        },
        {
          text: 'Typescript',
          items: [{ text: '泛型', link: '/notes/typescript/index.md' }]
        },
        {
          text: 'Echarts',
          items: [{ text: '物料', link: '/notes/echarts/echarts物料.md' }]
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
      port: 3000
      // open: true
    }
  }
})
