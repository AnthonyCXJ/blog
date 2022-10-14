
## 一、el-table和el-pagination结合

  #### 封装
  ```javascript
<template>
  <div class="table-container">
    <el-table
      :data="tableData"
      :height="height"
      :max-height="maxHeight"
      :span-method="spanMethod"
      :row-class-name="handleRowClassName"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      border
      ref="tableRef"
      size="small"
      style="width: 100%"
      v-loading="loading"
    >
      <!-- 多选 -->
      <el-table-column
        :selectable="isDisabled"
        type="selection"
        v-if="isSelection"
        width="55"
      ></el-table-column>
      <!-- 单选 -->
      <el-table-column
        align="center"
        v-if="hasOpenRadio"
        width="35"
      >
        <template slot-scope="scope">
          <el-radio
            :label="scope.row[keyLabel]"
            @change.native="getCurrentRow(scope.row)"
            v-model="selectedRadio"
          ></el-radio>
        </template>
      </el-table-column>
      <!-- 序号 -->
      <el-table-column
        label="序号"
        type="index"
        v-if="hasIndex"
        width="55"
      ></el-table-column>
      <template v-for="column in columns">
        <!-- 可以使用formatter -->
        <el-table-column
          :fixed="column.fixed"
          :formatter="column.formatter"
          :key="column.label"
          :label="column.label"
          :sort-method="column.sortMethod"
          :sortable="column.sortable"
          :width="column.width"
          align="center"
          show-overflow-tooltip
          v-if="column.formatter"
        ></el-table-column>
        <!-- 插槽显示 -->
        <el-table-column
          :fixed="column.fixed"
          :key="`${column.label}-else`"
          :label="column.label"
          :sort-method="column.sortMethod"
          :sortable="column.sortable"
          :width="column.width"
          align="center"
          show-overflow-tooltip
          v-else
        >
          <template slot-scope="scope">
            <!-- 作用域插槽， 在父组件使用方式是 template标签 使用 v-slot:slotName="scope" -->
            <!-- 调用字段方法是 {{ scope.row.propertyName }} -->
            <slot
              :index="scope.$index"
              :name="column.slotName"
              :row="scope.row"
              v-if="column.slotName"
            ></slot>
            <span v-else>{{ scope.row[column.prop] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <el-pagination
      :current-page="pagination.page"
      :page-size="pagination.size"
      :page-sizes="[10, 20, 30]"
      :total="pagination.total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper"
      v-if="pagination.total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'CommonTable',
  props: {
    // loading
    loading: {
      type: Boolean,
      default: false
    },
    // 高度
    height: {
      type: Number
    },
    // 最大高度
    maxHeight: {
      type: Number
    },
    // 单元格合并
    spanMethod: {
      type: Function
    },
    // 是否开启单选
    hasOpenRadio: {
      type: Boolean,
      default: false
    },
    // 取的属性值，默认为id
    keyLabel: {
      type: String,
      default: 'id'
    },
    // 数据
    tableData: {
      type: Array,
      default: () => []
    },
    // 获取数据的方法（用于翻页调用刷新）
    getData: {
      type: Function
    },
    // 列配置
    columns: {
      type: Array,
      default: () => []
    },
    // 是否开启多选
    isSelection: {
      type: Boolean,
      default: false
    },
    // 分页
    pagination: {
      type: Object,
      default: () => ({
        page: 1,
        size: 10,
        total: 0
      })
    },
    // 是否显示序号
    hasIndex: {
      type: Boolean,
      default: false
    },
    // 自定义行class
    handleRowClassName: {
      type: Function
    }
  },
  data() {
    return {
      selectedRadio: '',
      selectedRadioData: null
    }
  },
  methods: {
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange', selection)
    },

    handleCurrentChange(currentPage) {
      this.pagination.page = currentPage
      this.getData()
    },

    handleSizeChange(pageSize) {
      this.pagination.page = 0
      this.pagination.size = pageSize
      this.getData()
    },

    isDisabled(row) {
      return !row.isDisabled
    },

    getCurrentRow(row) {
      this.$emit('handle-selected-radio', row)
    },
    handleClearSelection() {
      this.$refs.tableRef.clearSelection()
    },

    // 点击当前行
    handleRowClick(row, column, event) {
      this.$emit('handleRowClick', row, column, event)
    }
  }
}
</script>
```
  
  #### 使用方法
  ```javascript
  <template>
    <CommonTable 
      :columns="columns"
      :tableData="tableData"
      :pagination="pagination"
    />
  </template>

  import CommonTable from '@/components/CommonTable'
  export default {
    name: 'page',
    components: { CommonTable }
  }

  ```

## 二、el-dialog通用封装

  #### 封装
  ```javascript
  <template>
    <el-dialog
      appendToBody
      :title="title"
      :visible.sync="visible"
      :closeOnClickModal="closeOnClickModal"
      :width="width"
      lockScroll
      @open="handleOpen"
      destroyOnClose
      :beforeClose="handleBeforeClose">
      <div class="dialog-content" v-loading="loading">
        <!-- 默认插槽 -->
        <slot></slot>
        <div class="footer" slot="footer" v-if="showFooter">
          <el-button @click="handleCancel">{{ cancelText }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{ confirmText }}</el-button>
        </div>
      </div>
      
    </el-dialog>
  </template>

  <script>
  export default {
    name: 'CommonDialog',
    props: {
      // loading
      loading: {
        type: Boolean,
        default: false
      },
      // 点击遮罩是否关闭modal
      closeOnClickModal: {
        type: Boolean,
        default: false
      },
      // 标题
      title: {
        type: String,
        default: ''
      },
      // 宽度
      width: {
        type: String,
        default: '50%'
      },
      // 关闭前是否需要回调
      isBeforeClose: {
        type: Boolean,
        default: false
      },
      // 是否显示弹窗
      visible: {
        type: Boolean,
        default: false
      },
      // 是否显示footer
      showFooter: {
        type: Boolean,
        default: true
      },
      // 取消text
      cancelText: {
        type: String,
        default: '取 消'
      },
      // 确定text
      confirmText: {
        type: String,
        default: '确 定'
      }
    },
    methods: {
      // 打开之前操作（初始化操作）
      handleOpen() {
        this.$emit('open')
      },

      // 编辑
      handleConfirm() {
        this.$emit('confirm')
      },

      // 关闭前
      handleBeforeClose() {
        if (this.isBeforeClose) {
          this.$emit('before-close')
          return
        }
        this.handleCancel()
      },

      // 关闭弹窗
      handleCancel() {
        this.$emit('cancel')
      },
    }
  }
  </script>

  <style lang="less" scoped>
  /deep/ .el-dialog__body {
    max-height: 700px;
    overflow-y: scroll;
  }
  .footer {
    margin-top: 30px;
  }
  </style>
  ```

  #### 使用方法
  ```javascript
  <template>
    // 封装功能弹窗 子组件
    <CommonDialog
      :loading="loading"
      :visible.sync="showConfigDialog"
      @cancel="handleCancel"
      @confirm="handleConfirm"
      @open="handleOpen"
      title="资源配置"
      width="70%"
    >
      // 内容插槽
      <div>我是内容</div>
    </CommonDialog>
  </template>

  import CommonDialog from '@/components/CommonDialog'
  export default {
    name: 'ListDialog',
    components: { CommonDialog },
    props: {
      // 是否打开弹窗
      showConfigDialog: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        loading: false,
      }
    },
    methods: {
      // 初始化操作
      handleOpen() { },

      handleConfirm() {
        // 确定操作、关闭弹窗
        this.handleCancel()
      },


      // 关闭弹窗 （使用sync语法）
      handleCancel() {
        this.$emit('update:showConfigDialog', false)
      }
    }
  }

  // 父组件调用
  <template>
    <ListDialog 
      :showConfigDialog.sync="showConfigDialog"
    />
  </template>

  import ListDialog from './components/ListDialog'
  export default {
    name: 'Page',
    components: { ListDialog },
    data() {
      return {
        showConfigDialog: false
      }
    }
  }
  ```