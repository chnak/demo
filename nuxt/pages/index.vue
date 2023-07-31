<template>
  <div class="fk-main">
    <div v-loading="loading">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="left" label-width="150px" style="width: 100%; ">
        <el-form-item label="公司名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="公司名称"
          />
        </el-form-item>
        <el-form-item label="所属行业" prop="industry">
          <el-select
            v-model="form.industry"
            filterable
            allow-create
            default-first-option
            placeholder="请选择标签"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div>
        <h3>结果反馈：</h3>
        <el-alert
          v-if="support"
          title="可以获得政策支持"
          type="success"
          :closable="false"
        />
        <el-alert
          v-else
          title="不可获得政策支持"
          type="info"
          :closable="false"
        />
      </div>

      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleSubmit('dataForm')">
          提交
        </el-button>
      </div> -->
    </div>
  </div>
</template>
<style>
.fk-main{min-width: 300px; width: 90%; max-width: 1024px; margin: 0 auto; margin-top: 40px;}
</style>
<script>

export default {
  name: 'CreateForm',
  components: { },
  data() {
    return {
      visible: false,
      loading: false,
      status: 'create',
      textMap: {
        update: '修改状态',
        create: '修改状态'
      },
      options: [],
      status_options: [],
      form: {
        name: '',
        industry: '综合'
        // support: false
      },
      timer: null,
      support: false,
      rules: {
        detail_memo: [{ required: true, message: '备注是必填项', trigger: ['blur', 'change'] }]
      }
    }
  },
  computed: {
    change: {
      get() {
        // 定义触发改变的规则
        const { name, industry } = this.form
        return { name: name, industry: industry }
      }
    }
  },
  watch: {
    change: function(value) {
      if (!value.name || !value.industry) {
        this.support = false
        return
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.apiSupport(value)
      }, 500)
      // this.throttleInput(this.form)
    }
  },
  async mounted() {
    this.loading = true
    await this.getIndustry()
    this.loading = false
  },
  methods: {
    async getIndustry() {
      const { data: res } = await this.$axios.get('/industry', { params: { limit: 100 }})

      this.options = res.data.items.map(item => {
        return { value: item.CSRC_NAME, label: item.CSRC_NAME }
      })
    },
    async apiSupport(form) {
      this.loading = true
      try {
        var data = { COMPANY_NAME: form.name, CSRC_NAME: form.industry }
        const { data: res } = await this.$axios.post('/support', data)
        this.loading = false
        if (res.code === 200) {
          this.support = res.data.SUPPORT || false
          if (!this.form.name) this.support = false
        } else {
          this.support = false
        }
      } catch (err) {
        this.loading = false
        this.$message.error('接口出错了！')
      }
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.loading = true
          try {
            var form = { rows: [{ detail_id: this.form.detail_id, detail_operator_time: this.form.detail_operator_time }] }
            form.detail_status = this.form.detail_status
            form.detail_memo = this.form.detail_memo
            var data = null // await purchase.status(form)
            this.loading = false
            this.visible = false
            this.$emit('callback', data)
          } catch (err) {
            this.loading = false
            // this.$message.error(err.message || '服务器错误！')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clear() {
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    }
  }
}

</script>

<style></style>
