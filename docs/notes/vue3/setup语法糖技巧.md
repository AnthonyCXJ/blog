
  ### 1、setup name 增强
    
  #### 安装
  ```
    yarn add vite-plugin-vue-setup-extend -D
  ```

  ### 配置
  ```typescript
  // vite.config.ts
  import { defineConfig } from 'vite'
  import VueSetupExtend from 'vite-plugin-vue-setup-extend'

  export default defineConfig({
    plugins: [
      VueSetupExtend()
    ]
  })
  ```

  ### 使用
  > 直接在script标签上写name
  ```typescript
  <script lang="ts" setup name="ComponentName">
  </script>
  ```

  ## 2、API自动导入

  #### 安装
  ```
    yarn add unplugin-auto-import -D
  ```

   ### 配置
  ```typescript
  // vite.config.ts
  import { defineConfig } from 'vite'
  import AutoImport from 'unplugin-auto-import/vite'  

  export default defineConfig({
    plugins: [
      AutoImport({
        // 需要去解析的文件
        include: [
          /\.[tj]sx?$/,     // .ts, .tsx, .js, .jsx
          /\.vue$/,         
          /\.vue\?vue/,     // .vue
          /\.md$/           // .md
        ],
        // 可以自定义文件生成的位置，默认是根目录下，使用ts的建议放src目录下
        //  除了vue的你也可以根据文档导入其他的如pinia、vue-router、vue-use等
        dts: 'src/auto-imports.d.ts',
         // imports 指定自动引入的包位置（名）
        imports: ['vue', 'pinia', 'vue-router'],
        // 生成相应的自动导入json文件
        eslintrc: {
          enabled: true,  // 启用
          filepath: './.eslintrc-auto-import.json',  // 生成自动导入json文件位置
          globalsPropValue: true     // 全局属性值
        }
      })
    ]
  })
  ```

  ### 使用
  > 不用import，直接使用ref
  ```typescript
    <script lang="ts" setup name="ComponentName">
    // 不用import，直接使用ref
    const count = ref(0)

    onMounted(() => {
      console.log('mounted===')
    })
    </script>
  ```

  ## 3、Component自动引入

  #### 安装
  ```
    yarn add unplugin-vue-components -D
  ```

  ### 配置
  ```typescript
  // vite.config.ts
  import { defineConfig } from 'vite'
  import Components from 'unplugin-vue-components/vite'
  import { ArcoResolver } from 'unplugin-vue-components/resolvers'
  export default defineConfig({
    plugins: [
      Components({
        // imports 指定组件所在目录，默认为 src/components
        dirs: ['src/components/', 'src/view/'],
        // 需要去解析的文件
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ArcoResolver({
            sideEffect: true
          })
        ]
      })
    ]
  })
  ```


  ## 4、ref 告别.value
  ### 配置
  ```typescript
    // vite.config.ts
  import { defineConfig } from 'vite'
  import vue from '@vitejs/plugin-vue'  

  export default defineConfig({
    plugins: [
      vue({
        refTransform: true // 开启ref转换
      })
    ]
  })
  ```

  ### 使用
  > 使用 $ref 语法定义ref变量、不需要使用.value、该属性仍处于实验性阶段，谨慎使用！！！

  ```typescript
    <script lang="ts" setup name="ComponentName">
      let count = $ref(1)

      const addCount = () => count++
    </script>
  ```