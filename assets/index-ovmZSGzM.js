// 邮箱接收器 Vue 应用
import { createApp, ref, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import axios from 'https://unpkg.com/axios@1.6.0/dist/esm/axios.min.js';

const { createApp: createVueApp, ref, onMounted } = Vue;

const EmailReceiver = {
  setup() {
    const currentEmail = ref('');
    const emails = ref([]);
    const loading = ref(false);
    const copied = ref(false);
    
    // API基础URL配置
    const API_BASE_URL = window.location.hostname === 'localhost' 
      ? 'http://localhost:8080/api/emails'
      : 'https://6abab755eec440ef8dcc5521e894c16c.ap-singapore.myide.io/api/emails';
    
    // 生成随机邮箱
    const generateRandomEmail = () => {
      const randomString = Math.random().toString(36).substring(2, 10);
      currentEmail.value = `${randomString}@nailinai.site`;
    };
    
    // 复制邮箱地址
    const copyEmail = async () => {
      try {
        await navigator.clipboard.writeText(currentEmail.value);
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = currentEmail.value;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      }
    };
    
    // 获取邮件
    const fetchEmails = async () => {
      if (!currentEmail.value) {
        alert('请先生成邮箱地址');
        return;
      }
      
      loading.value = true;
      try {
        const response = await fetch(`${API_BASE_URL}?email=${encodeURIComponent(currentEmail.value)}`);
        if (response.ok) {
          const data = await response.json();
          emails.value = data || [];
        } else {
          console.error('获取邮件失败:', response.status);
          emails.value = [];
        }
      } catch (error) {
        console.error('网络错误:', error);
        // 模拟数据用于演示
        emails.value = [
          {
            subject: '欢迎使用邮箱接收器',
            from: 'system@nailinai.site',
            date: new Date().toLocaleString(),
            content: '这是一个演示邮件，实际邮件需要后端服务支持。'
          }
        ];
      } finally {
        loading.value = false;
      }
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      try {
        return new Date(dateString).toLocaleString('zh-CN');
      } catch {
        return dateString;
      }
    };
    
    // 组件挂载时生成默认邮箱
    onMounted(() => {
      generateRandomEmail();
    });
    
    return {
      currentEmail,
      emails,
      loading,
      copied,
      generateRandomEmail,
      copyEmail,
      fetchEmails,
      formatDate
    };
  },
  
  template: `
    <div class="container">
      <div class="header">
        <h1 class="title">
          <i class="fas fa-envelope"></i>
          邮箱接收器
        </h1>
        <p class="subtitle">@nailinai.site 域名邮件接收系统</p>
      </div>
      
      <div class="email-generator">
        <h3 style="margin-bottom: 20px; color: #2d3748;">
          <i class="fas fa-magic"></i>
          生成随机邮箱
        </h3>
        
        <div class="generated-email" v-if="currentEmail">
          {{ currentEmail }}
        </div>
        
        <div style="text-align: center;">
          <button class="btn" @click="generateRandomEmail">
            <i class="fas fa-refresh"></i>
            生成新邮箱
          </button>
          
          <button class="btn btn-success" @click="copyEmail" v-if="currentEmail">
            <i class="fas fa-copy"></i>
            {{ copied ? '已复制!' : '复制邮箱' }}
          </button>
          
          <button class="btn" @click="fetchEmails" :disabled="loading">
            <i class="fas fa-download"></i>
            {{ loading ? '获取中...' : '获取邮件' }}
          </button>
        </div>
      </div>
      
      <div class="email-list">
        <h3 style="margin-bottom: 20px; color: #2d3748;">
          <i class="fas fa-inbox"></i>
          收件箱
        </h3>
        
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          正在获取邮件...
        </div>
        
        <div v-else-if="emails.length === 0" class="no-emails">
          <i class="fas fa-inbox"></i>
          暂无邮件
        </div>
        
        <div v-else>
          <div v-for="email in emails" :key="email.id || email.subject" class="email-item">
            <div class="email-subject">{{ email.subject }}</div>
            <div class="email-from">
              <i class="fas fa-user"></i>
              发件人: {{ email.from }}
            </div>
            <div class="email-date">
              <i class="fas fa-clock"></i>
              {{ formatDate(email.date) }}
            </div>
            <div v-if="email.content" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e2e8f0; color: #4a5568;">
              {{ email.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};

// 创建并挂载应用
const app = createVueApp(EmailReceiver);
app.mount('#app');