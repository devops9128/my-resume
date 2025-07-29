# GitHub 按钮配置说明

## 📋 配置概述

本履历网站已集成完整的GitHub功能，包括：
- 个人GitHub主页链接
- 项目仓库链接
- 自动获取GitHub用户信息

## ⚙️ 配置步骤

### 1. 修改GitHub用户名

在 `script.js` 文件中找到以下配置：

```javascript
const GITHUB_CONFIG = {
    username: 'johnsmith-dev', // 替换为您的GitHub用户名
    repositories: {
        'E-commerce Platform': 'ecommerce-platform',
        'Task Management App': 'task-management-app', 
        'Weather Dashboard': 'weather-dashboard'
    }
};
```

将 `username` 替换为您的实际GitHub用户名。

### 2. 配置项目仓库

在 `repositories` 对象中，键是项目标题（必须与HTML中的项目标题完全匹配），值是对应的GitHub仓库名称。

例如：
```javascript
repositories: {
    'E-commerce Platform': 'my-ecommerce-project',
    'Task Management App': 'task-manager', 
    'Weather Dashboard': 'weather-app'
}
```

### 3. 添加新项目

如果您要添加新项目，需要：

1. 在HTML中添加项目卡片
2. 在 `repositories` 配置中添加对应的仓库映射

## 🔧 功能说明

### GitHub按钮类型

1. **侧边栏GitHub按钮** - 跳转到个人GitHub主页
2. **项目GitHub按钮** - 跳转到具体项目仓库
3. **页脚GitHub按钮** - 跳转到个人GitHub主页

### 自动功能

- 自动验证GitHub用户是否存在
- 自动获取用户的公开仓库数量
- 更新GitHub链接的tooltip显示仓库数量

## 🚀 使用方法

1. 修改配置后保存文件
2. 刷新网页
3. 点击任意GitHub按钮测试功能

## 📝 注意事项

- 确保GitHub用户名正确
- 仓库名称必须与实际GitHub仓库名称匹配
- 项目标题必须与HTML中的标题完全一致
- 所有GitHub链接都会在新标签页中打开

## 🔍 故障排除

如果GitHub按钮不工作：

1. 检查浏览器控制台是否有错误
2. 确认GitHub用户名拼写正确
3. 确认仓库名称存在且公开
4. 检查网络连接是否正常

## 🎯 高级配置

您可以进一步自定义：

- 修改通知消息文本
- 调整跳转延迟时间
- 添加更多GitHub API功能
- 自定义错误处理逻辑