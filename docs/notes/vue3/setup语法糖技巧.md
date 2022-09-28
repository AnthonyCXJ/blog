
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
       // 可以自定义文件生成的位置，默认是根目录下，使用ts的建议放src目录下
      //  除了vue的你也可以根据文档导入其他的如vue-router、vue-use等
      dts: 'src/auto-imports.d.ts',
      imports: ['vue']
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

  ## 3、ref 告别.value
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