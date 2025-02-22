<script setup>
  import { ref } from 'vue'

  import LanguageMeta from '../meta.json'
  import { renderMessage } from './render'
  import { Dialog } from '@varlet/ui'

  const is_translate = ref(false)
  const queryString = ref('云堇')
  const queryLanguage = ref('CHS')
  const queryTranslateLanguage = ref('EN')
  const result = ref()
  const timeUse = ref(0)
  const result_display = ref([])
  const querying = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  function reduceResult(current, size) {
    result_display.value = result.value.slice(
      (current - 1) * size,
      current * size
    )
  }

  let apiHost = '//127.0.0.1:3000/api/query'
  console.log(import.meta.env)
  if (import.meta.env.PROD) {
    apiHost = '/api/query'
  }

  async function query() {
    querying.value = true
    fetch('//127.0.0.1:3000/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: queryString.value,
        lang: queryLanguage.value,
        translate: is_translate.value ? queryTranslateLanguage.value : 'none'
      })
    })
      .then(res => res.json())
      .then(data => {
        result.value = data.data
        timeUse.value = data.time
        querying.value = false
        currentPage.value = 1
        reduceResult(currentPage.value, pageSize.value)
      })
      .catch(err => {
        querying.value = false
      })
  }

  Dialog(
    '当前版本不支持查询阅读物和过场动画字母等（所以比如「希巴拉克的道路」之类的话查询不了），后续版本会支持'
  )
</script>

<template>
  <div class="__container">
    <div id="bar">
      <h1>原神文本速查速译</h1>
      <h3>
        Genshin Impact Text Quick Reference & Translate
      </h3>
      <var-input
        variant="outlined"
        v-model="queryString"
        placeholder="请输入关键词"></var-input>
      <var-select
        variant="outlined"
        v-model="queryLanguage"
        placeholder="请选择查询语言">
        <var-option
          v-for="item in LanguageMeta"
          :key="item.lang"
          :value="item.lang"
          :label="item.name"></var-option>
      </var-select>
      <var-select
        variant="outlined"
        v-model="queryTranslateLanguage"
        :disabled="!is_translate"
        placeholder="要翻译的语言">
        <var-option
          v-for="item in LanguageMeta"
          :key="item.lang"
          :value="item.lang"
          :label="item.name"></var-option>
      </var-select>
      <var-checkbox disabled>正则表达式(后续版本支持)</var-checkbox>
      <var-checkbox v-model="is_translate">翻译模式</var-checkbox>
      <var-button
        block
        type="primary"
        :loading="querying"
        @click="query()"
        :disabled="!queryString">
        查找
      </var-button>
      <div>耗时 {{ timeUse || 0 }} 毫秒</div>
      <p>注：内容来自于解包文件，更新至 5.3</p>
      <p>
        <var-link href="https://github.com/Kuriyota/GTQRT/" target="_blank">
          GitHub
        </var-link>
        <span> | </span>
        <var-link href="https://space.bilibili.com/650631530" target="_blank">
          作者的 Bilibili 主页
        </var-link>
      </p>
    </div>
    <div id="main">
      <var-pagination
        v-model:current="currentPage"
        v-model:size="pageSize"
        :total="result?.length || 0"
        :show-total="total => `共 ${total} 条`"
        @change="reduceResult" />
      <div>
        <var-cell v-for="item in result_display" :key="item.id" border>
          <div style="display: flex; flex-direction: row">
            <div
              v-html="renderMessage(item.text)"
              class="text"
              :style="{ width: is_translate ? '50%' : '100%' }"></div>
            <div
              v-if="is_translate"
              v-html="renderMessage(item.translate)"
              class="text"
              style="width: 50%"></div>
          </div>
        </var-cell>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .__container {
    display: flex;
    height: 100%;
    #bar {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 300px;
      min-width: 300px;
    }
    #main {
      overflow-y: auto;
    }
  }

  .text {
    padding: 5px;
    font-size: 16px;
    line-height: 24px;
  }

  .ruby {
    .height {
      width: 0px;
      height: 28px;
      display: inline-block;
    }
    span {
      position: absolute;
      font-size: 12px;
      line-height: 12px;
      transform: translate(-50%, 0px);
      width: max-content;
    }
  }
</style>
