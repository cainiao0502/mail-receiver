// 邮箱接收器 Vue 应用 - 已修复API连接
import { createApp, ref, computed, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import axios from 'https://unpkg.com/axios@1.6.0/dist/esm/axios.min.js';

const EmailReceiver = {
  setup() {
    // 响应式数据
    const generatedEmail = ref('');
    const emails = ref([]);
    const loading = ref(false);
    const loadingMessage = ref('');
    const error = ref('');
    const successMessage = ref('');
    const selectedEmail = ref(null);
    const showHelp = ref(false);
    const searchQuery = ref('');
    const connectionStatus = ref('unknown');
    const contentView = ref('text');

    // API基础URL配置 - 支持多种部署方案
    const getApiBaseUrl = () => {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      
      // 本地开发环境
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080';
      }
      
      // GitHub Pages部署 - 使用之前的CloudStudio后端
      if (hostname === 'cainiao0502.github.io' || hostname === 'mail.nailinai.site') {
        // 使用之前部署的CloudStudio后端服务
        return 'https://6abab755eec440ef8dcc5521e894c16c.ap-singapore.myide.io';
      }
      
      // 默认后端地址
      return 'http://localhost:8080';
    };

    const API_BASE_URL = getApiBaseUrl();
    console.log('当前API地址:', API_BASE_URL);

    // 计算属性
    const filteredEmails = computed(() => {
      if (!searchQuery.value) return emails.value;
      
      const query = searchQuery.value.toLowerCase();
      return emails.value.filter(email => 
        (email.subject && email.subject.toLowerCase().includes(query)) ||
        (email.from && email.from.toLowerCase().includes(query)) ||
        (email.textContent && email.textContent.toLowerCase().includes(query))
      );
    });

    const connectionStatusClass = computed(() => {
      return {
        'status-connected': connectionStatus.value === 'connected',
        'status-disconnected': connectionStatus.value === 'disconnected',
        'status-unknown': connectionStatus.value === 'unknown'
      };
    });

    const connectionStatusText = computed(() => {
      switch (connectionStatus.value) {
        case 'connected': return '已连接';
        case 'disconnected': return '未连接';
        default: return '未知';
      }
    });

    // 生成随机邮箱
    const generateRandomEmail = () => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const length = Math.floor(Math.random() * 10) + 1;
      let prefix = '';
      
      for (let i = 0; i < length; i++) {
        prefix += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      generatedEmail.value = `${prefix}@nailinai.site`;
      
      successMessage.value = `已生成邮箱: ${generatedEmail.value}`;
      setTimeout(() => { successMessage.value = ''; }, 3000);
    };

    // 复制到剪贴板
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(generatedEmail.value);
        successMessage.value = '邮箱地址已复制到剪贴板';
        setTimeout(() => { successMessage.value = ''; }, 3000);
      } catch (err) {
        error.value = '复制失败，请手动复制邮箱地址';
        setTimeout(() => { error.value = ''; }, 3000);
      }
    };

    // 获取邮件
    const fetchEmails = async () => {
      loading.value = true;
      loadingMessage.value = '正在连接服务器...';
      error.value = '';
      successMessage.value = '';

      try {
        loadingMessage.value = '正在获取邮件列表...';
        const response = await axios.get(`${API_BASE_URL}/api/emails/fetch-quick`, {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.data.success) {
          emails.value = response.data.emails || [];
          connectionStatus.value = 'connected';
          successMessage.value = `成功获取 ${emails.value.length} 封邮件`;
          setTimeout(() => { successMessage.value = ''; }, 3000);
        } else {
          connectionStatus.value = 'disconnected';
          error.value = response.data.message || '获取邮件失败';
          setTimeout(() => { error.value = ''; }, 5000);
        }
      } catch (err) {
        console.error('获取邮件错误:', err);
        connectionStatus.value = 'disconnected';
        
        let errorMessage = '获取邮件失败';
        if (err.code === 'ECONNABORTED') {
          errorMessage = '请求超时，请检查后端服务';
        } else if (err.response) {
          errorMessage = `服务器错误: ${err.response.data?.message || err.response.statusText}`;
        } else if (err.request) {
          errorMessage = '无法连接到服务器，请检查后端服务是否启动';
        } else {
          errorMessage = `网络错误: ${err.message}`;
        }
        
        error.value = errorMessage;
        setTimeout(() => { error.value = ''; }, 5000);
      } finally {
        loading.value = false;
        loadingMessage.value = '';
      }
    };

    // 其他功能函数
    const selectEmail = (email) => {
      selectedEmail.value = email;
      contentView.value = 'text';
    };

    const deleteEmail = (email) => {
      const index = emails.value.findIndex(e => e.messageId === email.messageId);
      if (index > -1) {
        emails.value.splice(index, 1);
        successMessage.value = '邮件已从列表中移除';
        setTimeout(() => { successMessage.value = ''; }, 3000);
      }
    };

    const isNailinaiEmail = (email) => {
      if (email.originalRecipient && email.originalRecipient.includes('@nailinai.site')) {
        return true;
      }
      if (email.to && email.to.some && email.to.some(addr => addr.includes('@nailinai.site'))) {
        return true;
      }
      return false;
    };

    const formatTime = (dateString) => {
      if (!dateString) return '未知时间';
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
        
        return date.toLocaleDateString('zh-CN');
      } catch {
        return '时间格式错误';
      }
    };

    // 组件挂载时的初始化
    onMounted(() => {
      generateRandomEmail();
      fetchEmails();
      
      // 定期检查连接状态
      setInterval(async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/emails/test-connection`, { 
            timeout: 5000,
            headers: {
              'Content-Type': 'application/json',
            }
          });
          connectionStatus.value = response.data.success ? 'connected' : 'disconnected';
        } catch {
          connectionStatus.value = 'disconnected';
        }
      }, 30000);
    });

    return {
      generatedEmail,
      emails,
      loading,
      loadingMessage,
      error,
      successMessage,
      selectedEmail,
      showHelp,
      searchQuery,
      connectionStatus,
      contentView,
      filteredEmails,
      connectionStatusClass,
      connectionStatusText,
      generateRandomEmail,
      copyToClipboard,
      fetchEmails,
      selectEmail,
      deleteEmail,
      isNailinaiEmail,
      formatTime
    };
  },
  
  template: `
    <div class="email-receiver">
      <!-- 应用模板内容 -->
      <div class="container">
        <h1>邮箱接收器已加载，API已配置</h1>
        <p>当前API地址: {{ API_BASE_URL }}</p>
        <p>连接状态: {{ connectionStatusText }}</p>
      </div>
    </div>
  `
};

// 创建并挂载应用
const app = createApp(EmailReceiver);
app.mount('#app');

console.log('邮箱接收器应用已启动，API配置完成');