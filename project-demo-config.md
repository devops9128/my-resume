# 项目演示按钮功能配置指南

## 功能概述

项目演示按钮功能为履历网页中的每个项目提供在线演示链接，用户可以直接点击查看项目的实际运行效果。该功能包括状态指示器、加载动画、可用性检查和访问统计等特性。

## 配置步骤

### 1. 基础配置

在 `script.js` 文件中找到 `PROJECT_DEMO_CONFIG` 对象：

```javascript
const PROJECT_DEMO_CONFIG = {
    // 项目演示链接映射
    demoUrls: {
        'E-commerce Platform': 'https://ecommerce-demo.netlify.app',
        'Task Management App': 'https://taskmanager-demo.vercel.app',
        'Weather Dashboard': 'https://weather-dashboard-demo.surge.sh'
    },
    
    // 演示环境信息
    environments: {
        'E-commerce Platform': {
            status: 'live',
            lastUpdated: '2024-12-15',
            technologies: ['React', 'Node.js', 'MongoDB'],
            features: ['用户认证', '购物车', '支付集成', '订单管理']
        }
    }
};
```

### 2. 添加新项目演示

要为新项目添加演示功能：

1. **添加演示URL**：
   ```javascript
   demoUrls: {
       '你的项目名称': 'https://your-demo-url.com'
   }
   ```

2. **配置环境信息**：
   ```javascript
   environments: {
       '你的项目名称': {
           status: 'live',           // 状态：live, preparing, offline
           lastUpdated: '2024-12-15', // 最后更新日期
           technologies: ['React', 'Node.js'], // 使用的技术
           features: ['功能1', '功能2'] // 主要功能
       }
   }
   ```

### 3. 项目名称匹配

确保配置中的项目名称与HTML中的项目标题完全一致：

```html
<h3 class="project-title">E-commerce Platform</h3>
```

## 功能说明

### 状态指示器

每个项目卡片会显示状态指示器：

- **绿色圆点 + "在线演示"**：项目演示可用
- **黄色圆点 + "准备中"**：演示环境准备中
- **红色圆点 + "离线"**：演示暂不可用

### 演示按钮行为

1. **点击演示按钮**：
   - 显示加载动画（旋转图标）
   - 显示"正在启动演示环境..."提示
   - 检查演示站点可用性
   - 在新窗口打开演示链接

2. **加载状态**：
   - 按钮暂时禁用，防止重复点击
   - 3秒后自动恢复正常状态

3. **成功打开**：
   - 显示"演示已在新窗口中打开"提示
   - 记录访问统计

### 访问统计

系统会自动记录每个项目的演示访问次数，存储在浏览器本地存储中。

## 使用方法

### 基本使用

1. 用户点击项目卡片上的演示按钮（外链图标）
2. 系统显示加载状态和提示信息
3. 演示站点在新窗口中打开
4. 记录访问统计

### 开发者工具

在浏览器控制台中可以使用以下命令：

```javascript
// 获取演示访问统计
getDemoStats()

// 验证配置
validateProjectDemoConfig()

// 手动打开演示
openProjectDemo('E-commerce Platform', buttonElement)
```

## 自定义样式

### 状态指示器样式

```css
.project-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.5rem 0.75rem;
    background: rgba(231, 126, 34, 0.1);
    border-radius: 20px;
}

.status-dot.live {
    background-color: #27AE60;
    animation: pulse 2s infinite;
}
```

### 自定义状态颜色

修改 `styles.css` 中的状态点颜色：

```css
.status-dot.live { background-color: #27AE60; }    /* 绿色 - 在线 */
.status-dot.preparing { background-color: #F39C12; } /* 黄色 - 准备中 */
.status-dot.offline { background-color: #E74C3C; }   /* 红色 - 离线 */
```

## 注意事项

### 1. 项目名称匹配
- 配置中的项目名称必须与HTML中的完全一致
- 区分大小写
- 包括空格和特殊字符

### 2. 演示URL要求
- 必须是完整的HTTP/HTTPS URL
- 建议使用HTTPS协议
- 确保演示站点支持跨域访问

### 3. 浏览器兼容性
- 需要支持ES6+语法
- 需要支持localStorage
- 需要支持fetch API

### 4. 性能考虑
- 演示站点检查有3秒超时
- 避免频繁点击演示按钮
- 大型项目建议使用CDN加速

## 故障排除

### 常见问题

1. **演示按钮无响应**
   - 检查项目名称是否匹配
   - 确认配置中有对应的URL
   - 查看浏览器控制台错误信息

2. **演示站点无法打开**
   - 检查URL是否正确
   - 确认演示站点是否在线
   - 检查浏览器弹窗设置

3. **状态指示器不显示**
   - 确认环境配置是否正确
   - 检查CSS样式是否加载
   - 验证JavaScript是否正常执行

### 调试方法

1. **开启控制台日志**：
   ```javascript
   console.log('项目演示配置验证通过');
   ```

2. **检查配置**：
   ```javascript
   validateProjectDemoConfig();
   ```

3. **查看访问统计**：
   ```javascript
   console.log(getDemoStats());
   ```

## 高级功能

### 1. 自定义加载时间

修改 `PROJECT_DEMO_CONFIG.loadingTimeout` 值：

```javascript
loadingTimeout: 5000  // 5秒加载时间
```

### 2. 添加演示预览

可以扩展功能添加演示预览图：

```javascript
environments: {
    'Project Name': {
        status: 'live',
        previewImage: 'path/to/preview.jpg',
        // ... 其他配置
    }
}
```

### 3. 演示站点健康检查

可以添加真实的健康检查端点：

```javascript
async function checkDemoHealth(url) {
    try {
        const response = await fetch(`${url}/health`);
        return response.ok;
    } catch (error) {
        return false;
    }
}
```

## 分析和跟踪

### 访问统计

系统自动跟踪以下数据：
- 每个项目的演示访问次数
- 存储在浏览器本地存储中
- 可通过 `getDemoStats()` 获取

### 扩展分析

可以集成第三方分析工具：

```javascript
function recordDemoAccess(projectTitle) {
    // 本地统计
    const accessKey = `demo_access_${projectTitle.replace(/\s+/g, '_')}`;
    const currentCount = parseInt(localStorage.getItem(accessKey) || '0');
    localStorage.setItem(accessKey, (currentCount + 1).toString());
    
    // Google Analytics (示例)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'demo_access', {
            'project_name': projectTitle,
            'access_count': currentCount + 1
        });
    }
}
```

---

## 总结

项目演示按钮功能提供了完整的项目展示解决方案，包括：

- ✅ 智能状态指示
- ✅ 流畅的用户体验
- ✅ 访问统计跟踪
- ✅ 配置化管理
- ✅ 错误处理机制
- ✅ 响应式设计

通过合理配置和使用，可以大大提升履历网页的专业性和用户体验。