# 邮箱接收器 - @nailinai.site 域名邮件系统

一个现代化的临时邮箱接收器，支持 @nailinai.site 域名邮件的接收和管理。

## ✨ 功能特性

- 🎲 **随机邮箱生成** - 一键生成 @nailinai.site 域名邮箱
- 📧 **实时邮件接收** - 自动获取发送到生成邮箱的邮件
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🎨 **现代化界面** - 简洁美观的用户界面
- 📋 **一键复制** - 快速复制邮箱地址
- 🔄 **实时刷新** - 手动获取最新邮件

## 🚀 在线访问

- **GitHub仓库**: https://github.com/cainiao0502/mail-receiver
- **在线演示**: 即将部署到 Vercel

## 🛠️ 技术栈

- **前端**: Vue 3 + Vanilla JavaScript
- **样式**: CSS3 + FontAwesome 图标
- **部署**: Vercel
- **后端**: Spring Boot (独立部署)

## 📦 项目结构

```
mail-receiver/
├── index.html          # 主页面文件
├── assets/             # 静态资源
│   ├── index-B5aoBy1v.css  # 样式文件
│   └── index-ovmZSGzM.js   # JavaScript 应用
├── vercel.json         # Vercel 部署配置
├── package.json        # 项目配置
└── README.md          # 项目说明
```

## 🔧 本地开发

1. 克隆仓库
```bash
git clone https://github.com/cainiao0502/mail-receiver.git
cd mail-receiver
```

2. 启动本地服务器
```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx serve .
```

3. 访问 http://localhost:8000

## 🌐 部署到 Vercel

1. Fork 此仓库到您的 GitHub 账户
2. 访问 [Vercel](https://vercel.com) 并登录
3. 点击 "New Project" 并选择您的仓库
4. 点击 "Deploy" 完成部署

## 🔗 自定义域名

部署完成后，您可以在 Vercel 项目设置中添加自定义域名：

1. 进入项目设置 → Domains
2. 添加您的域名（如：mail.yourdomain.com）
3. 按照提示配置 DNS 记录

## 🔧 后端配置

前端应用需要配合后端 API 服务使用：

- 开发环境：`http://localhost:8080/api/emails`
- 生产环境：需要配置实际的后端服务地址

## 📝 使用说明

1. **生成邮箱**：点击"生成新邮箱"按钮创建随机邮箱地址
2. **复制邮箱**：点击"复制邮箱"按钮将地址复制到剪贴板
3. **接收邮件**：使用生成的邮箱地址接收邮件
4. **查看邮件**：点击"获取邮件"按钮查看收到的邮件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

- GitHub: [@cainiao0502](https://github.com/cainiao0502)
- 邮箱: 1025717965@qq.com

---

⭐ 如果这个项目对您有帮助，请给个 Star！