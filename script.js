// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initSkillBars();
    initScrollAnimations();
    initMobileMenu();
    initFormSubmission();
    initSmoothScrolling();
    initGitHubFeatures(); // 初始化GitHub功能
    initLinkedInFeatures(); // 初始化LinkedIn功能
    initProjectDemoFeatures(); // 初始化项目演示功能
    initCertificationFeatures(); // 初始化认证功能
    
    // 异步获取信息
    updateGitHubInfo();
    updateLinkedInInfo();
    
    // 验证配置
    validateLinkedInConfig();
    validateProjectDemoConfig();
});

// 导航功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // 监听滚动事件，更新活跃导航项
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// 技能条动画
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !bar.classList.contains('animated')) {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
                bar.classList.add('animated');
            }
        });
    };
    
    // 初始检查
    animateSkillBars();
    
    // 滚动时检查
    window.addEventListener('scroll', animateSkillBars);
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有卡片元素
    const animatedElements = document.querySelectorAll('.stat-card, .timeline-item, .certification-card, .project-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 移动端菜单
function initMobileMenu() {
    // 创建移动端菜单按钮
    if (window.innerWidth <= 1024) {
        createMobileMenuButton();
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 1024) {
            createMobileMenuButton();
        } else {
            removeMobileMenuButton();
            document.querySelector('.sidebar').classList.remove('active');
        }
    });
}

function createMobileMenuButton() {
    if (document.querySelector('.mobile-menu-btn')) return;
    
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    menuBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1001;
        background: #E67E22;
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;
    
    menuBtn.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('active');
        
        // 更新按钮图标
        const icon = menuBtn.querySelector('i');
        if (sidebar.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    document.body.appendChild(menuBtn);
    
    // 点击侧边栏外部关闭菜单
    document.addEventListener('click', (e) => {
        const sidebar = document.querySelector('.sidebar');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
            menuBtn.querySelector('i').className = 'fas fa-bars';
        }
    });
}

function removeMobileMenuButton() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
        menuBtn.remove();
    }
}

// 表单提交
function initFormSubmission() {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;
            
            // 简单验证
            if (!name || !email || !message) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }
            
            // 模拟发送
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '发送中...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('消息发送成功！我会尽快回复您。', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 通知功能
function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    };
    
    // 根据类型设置颜色
    if (type === 'success') {
        styles.background = '#27AE60';
    } else if (type === 'error') {
        styles.background = '#E74C3C';
    } else {
        styles.background = '#3498DB';
    }
    
    Object.assign(notification.style, styles);
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// 平滑滚动
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 在移动端关闭菜单
                if (window.innerWidth <= 1024) {
                    const sidebar = document.querySelector('.sidebar');
                    const menuBtn = document.querySelector('.mobile-menu-btn');
                    
                    sidebar.classList.remove('active');
                    if (menuBtn) {
                        menuBtn.querySelector('i').className = 'fas fa-bars';
                    }
                }
            }
        });
    });
}

// GitHub配置
const GITHUB_CONFIG = {
    username: 'devops9128' // 替换为您的GitHub用户名
};

// LinkedIn配置
const LINKEDIN_CONFIG = {
    profileUrl: 'https://www.linkedin.com/in/tkgoh9128', // 替换为您的LinkedIn个人资料URL
    companyName: 'Tech Solutions Inc.', // 当前公司名称
    position: 'Senior Frontend Developer', // 当前职位
    location: 'San Francisco, CA', // 所在地区
    connections: '500+' // 联系人数量
};

// 项目演示配置
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
        },
        'Task Management App': {
            status: 'live',
            lastUpdated: '2024-12-10',
            technologies: ['Vue.js', 'Socket.io', 'Firebase'],
            features: ['实时协作', '拖拽功能', '团队管理', '任务分配']
        },
        'Weather Dashboard': {
            status: 'live',
            lastUpdated: '2024-12-08',
            technologies: ['JavaScript', 'Chart.js', 'Weather API'],
            features: ['位置定位', '天气预报', '交互图表', '响应式设计']
        }
    },
    
    // 默认设置
    defaultMessage: '演示环境正在准备中...',
    loadingTimeout: 3000
};

// 项目演示功能
function initProjectDemoFeatures() {
    // 为所有演示链接添加功能
    document.addEventListener('click', (e) => {
        const demoLink = e.target.closest('.project-link[data-type="demo"]');
        
        if (demoLink) {
            e.preventDefault();
            handleProjectDemoClick(demoLink);
        }
    });
    
    // 添加项目状态指示器
    addProjectStatusIndicators();
}

// 处理项目演示按钮点击
function handleProjectDemoClick(element) {
    const projectCard = element.closest('.project-card');
    const projectTitle = projectCard.querySelector('.project-title').textContent;
    
    openProjectDemo(projectTitle, element);
}

// 打开项目演示
function openProjectDemo(projectTitle, buttonElement) {
    const demoUrl = PROJECT_DEMO_CONFIG.demoUrls[projectTitle];
    const environment = PROJECT_DEMO_CONFIG.environments[projectTitle];
    
    if (demoUrl && environment && environment.status === 'live') {
        // 显示加载状态
        showDemoLoadingState(buttonElement, projectTitle);
        
        // 检查演示站点可用性
        checkDemoAvailability(demoUrl, projectTitle, buttonElement);
    } else {
        showNotification(PROJECT_DEMO_CONFIG.defaultMessage, 'info');
    }
}

// 显示演示加载状态
function showDemoLoadingState(buttonElement, projectTitle) {
    const originalIcon = buttonElement.querySelector('i').className;
    const iconElement = buttonElement.querySelector('i');
    
    // 更改为加载图标
    iconElement.className = 'fas fa-spinner fa-spin';
    buttonElement.style.pointerEvents = 'none';
    
    // 显示加载提示
    showNotification(`正在启动 ${projectTitle} 演示环境...`, 'info');
    
    // 设置超时恢复
    setTimeout(() => {
        iconElement.className = originalIcon;
        buttonElement.style.pointerEvents = 'auto';
    }, PROJECT_DEMO_CONFIG.loadingTimeout);
}

// 检查演示站点可用性
async function checkDemoAvailability(url, projectTitle, buttonElement) {
    try {
        // 模拟检查（实际项目中可以使用真实的健康检查端点）
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 打开演示站点
        const demoWindow = window.open(url, '_blank', 'noopener,noreferrer');
        
        if (demoWindow) {
            showNotification(`${projectTitle} 演示已在新窗口中打开`, 'success');
            
            // 记录访问统计
            recordDemoAccess(projectTitle);
        } else {
            showNotification('请允许弹窗以查看演示', 'warning');
        }
        
    } catch (error) {
        console.error('演示站点检查失败:', error);
        showNotification('演示站点暂时不可用，请稍后再试', 'error');
    }
}

// 添加项目状态指示器
function addProjectStatusIndicators() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const projectTitle = card.querySelector('.project-title').textContent;
        const environment = PROJECT_DEMO_CONFIG.environments[projectTitle];
        
        if (environment) {
            // 创建状态指示器
            const statusIndicator = document.createElement('div');
            statusIndicator.className = 'project-status';
            statusIndicator.innerHTML = `
                <span class="status-dot ${environment.status}"></span>
                <span class="status-text">${environment.status === 'live' ? '在线演示' : '准备中'}</span>
            `;
            
            // 添加到项目内容区域
            const projectContent = card.querySelector('.project-content');
            projectContent.insertBefore(statusIndicator, projectContent.querySelector('.project-tech'));
            
            // 更新演示按钮的tooltip
            const demoButton = card.querySelector('.project-link[data-type="demo"]');
            if (demoButton && environment.status === 'live') {
                demoButton.setAttribute('data-tooltip', '查看在线演示');
            }
        }
    });
}

// 记录演示访问统计
function recordDemoAccess(projectTitle) {
    const accessKey = `demo_access_${projectTitle.replace(/\s+/g, '_')}`;
    const currentCount = parseInt(localStorage.getItem(accessKey) || '0');
    localStorage.setItem(accessKey, (currentCount + 1).toString());
    
    console.log(`${projectTitle} 演示访问次数: ${currentCount + 1}`);
}

// 获取项目演示统计信息
function getDemoStats() {
    const stats = {};
    
    Object.keys(PROJECT_DEMO_CONFIG.demoUrls).forEach(projectTitle => {
        const accessKey = `demo_access_${projectTitle.replace(/\s+/g, '_')}`;
        stats[projectTitle] = parseInt(localStorage.getItem(accessKey) || '0');
    });
    
    return stats;
}

// 验证项目演示配置
function validateProjectDemoConfig() {
    const issues = [];
    
    Object.keys(PROJECT_DEMO_CONFIG.demoUrls).forEach(projectTitle => {
        const url = PROJECT_DEMO_CONFIG.demoUrls[projectTitle];
        const environment = PROJECT_DEMO_CONFIG.environments[projectTitle];
        
        if (!url || !url.startsWith('http')) {
            issues.push(`${projectTitle}: 无效的演示URL`);
        }
        
        if (!environment) {
            issues.push(`${projectTitle}: 缺少环境配置`);
        }
    });
    
    if (issues.length > 0) {
        console.warn('项目演示配置问题:', issues);
    } else {
        console.log('项目演示配置验证通过');
    }
    
    return issues.length === 0;
}

// LinkedIn功能
function initLinkedInFeatures() {
    // 为所有LinkedIn链接添加功能
    document.addEventListener('click', (e) => {
        const clickedElement = e.target.closest('[data-type="linkedin"]');
        
        if (clickedElement) {
            e.preventDefault();
            handleLinkedInClick(clickedElement);
        }
    });
    
    // 为LinkedIn分享按钮添加功能
    document.addEventListener('click', (e) => {
        const shareBtn = e.target.closest('.linkedin-share-btn');
        
        if (shareBtn) {
            e.preventDefault();
            const action = shareBtn.getAttribute('data-action');
            
            if (action === 'share-resume') {
                shareResumeOnLinkedIn();
            }
        }
    });
}

// 处理LinkedIn按钮点击
function handleLinkedInClick(element) {
    openLinkedInProfile();
}

// 打开LinkedIn个人资料
function openLinkedInProfile() {
    // 显示加载提示
    showNotification('正在跳转到LinkedIn个人资料...', 'info');
    
    // 延迟跳转，让用户看到提示
    setTimeout(() => {
        window.open(LINKEDIN_CONFIG.profileUrl, '_blank', 'noopener,noreferrer');
        showNotification('已在新标签页打开LinkedIn个人资料', 'success');
    }, 500);
}

// 验证LinkedIn配置
function validateLinkedInConfig() {
    if (!LINKEDIN_CONFIG.profileUrl || LINKEDIN_CONFIG.profileUrl === 'https://www.linkedin.com/in/johnsmith-dev') {
        console.warn('请在LINKEDIN_CONFIG中配置您的LinkedIn个人资料URL');
        return false;
    }
    
    // 检查URL格式
    const linkedinUrlPattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-]+\/?$/;
    if (!linkedinUrlPattern.test(LINKEDIN_CONFIG.profileUrl)) {
        console.warn('LinkedIn URL格式不正确，请检查配置');
        return false;
    }
    
    return true;
}

// 更新LinkedIn信息显示
function updateLinkedInInfo() {
    try {
        // 更新LinkedIn链接的tooltip
        const linkedinLinks = document.querySelectorAll('.social-link[data-tooltip="LinkedIn"]');
        linkedinLinks.forEach(link => {
            const tooltipText = `LinkedIn - ${LINKEDIN_CONFIG.position} at ${LINKEDIN_CONFIG.companyName}`;
            link.setAttribute('data-tooltip', tooltipText);
        });
        
        console.log('LinkedIn信息已更新');
    } catch (error) {
        console.warn('更新LinkedIn信息时出错:', error);
    }
}

// 获取LinkedIn分享功能
function shareOnLinkedIn(title, url, summary) {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
    
    showNotification('正在打开LinkedIn分享...', 'info');
    
    setTimeout(() => {
        window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    }, 500);
}

// 分享履历到LinkedIn
function shareResumeOnLinkedIn() {
    const currentUrl = window.location.href;
    const title = 'Check out my professional resume';
    const summary = `I'm ${LINKEDIN_CONFIG.position} at ${LINKEDIN_CONFIG.companyName}, based in ${LINKEDIN_CONFIG.location}. Take a look at my professional background, skills, and recent projects. I'm always open to new opportunities and collaborations!`;
    
    shareOnLinkedIn(title, currentUrl, summary);
}

// GitHub功能
function initGitHubFeatures() {
    // 为所有GitHub链接添加功能
    document.addEventListener('click', (e) => {
        const clickedElement = e.target.closest('[data-type="github"]');
        
        if (clickedElement) {
            e.preventDefault();
            handleGitHubClick(clickedElement);
        }
    });
}

// 处理GitHub按钮点击
function handleGitHubClick(element) {
    const isProjectLink = element.classList.contains('project-link');
    
    if (isProjectLink) {
        // 项目中的GitHub按钮已移除，不再处理
        showNotification('GitHub按钮已移除', 'info');
        return;
    } else {
        // 社交链接中的GitHub按钮
        openGitHubProfile();
    }
}

// 打开GitHub个人主页
function openGitHubProfile() {
    const githubUrl = `https://github.com/${GITHUB_CONFIG.username}`;
    
    // 显示加载提示
    showNotification('正在跳转到GitHub主页...', 'info');
    
    // 延迟跳转，让用户看到提示
    setTimeout(() => {
        window.open(githubUrl, '_blank', 'noopener,noreferrer');
    }, 500);
}

// 检查GitHub用户是否存在
async function validateGitHubUser() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_CONFIG.username}`);
        
        if (response.ok) {
            const userData = await response.json();
            console.log('GitHub用户验证成功:', userData.login);
            return true;
        } else {
            console.warn('GitHub用户不存在或API限制');
            return false;
        }
    } catch (error) {
        console.warn('GitHub API请求失败:', error);
        return false;
    }
}

// 获取GitHub用户信息并更新页面
async function updateGitHubInfo() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_CONFIG.username}`);
        
        if (response.ok) {
            const userData = await response.json();
            
            // 更新GitHub链接的tooltip
            const githubLinks = document.querySelectorAll('.social-link[data-tooltip="GitHub"]');
            githubLinks.forEach(link => {
                link.setAttribute('data-tooltip', `GitHub - ${userData.public_repos} repositories`);
            });
            
            console.log(`GitHub信息已更新: ${userData.public_repos} 个公开仓库`);
        }
    } catch (error) {
        console.warn('无法获取GitHub信息:', error);
    }
}

// 其他社交链接处理
document.addEventListener('click', (e) => {
    const socialLink = e.target.closest('.social-link');
    
    if (socialLink && 
        socialLink.getAttribute('data-type') !== 'github' && 
        socialLink.getAttribute('data-type') !== 'linkedin') {
        e.preventDefault();
        
        const linkType = socialLink.getAttribute('data-type');
        let platform = 'Social Media';
        
        switch(linkType) {
            case 'twitter':
                platform = 'Twitter';
                break;
            case 'email':
                platform = 'Email';
                break;
        }
        
        showNotification(`${platform} 链接功能待实现`, 'info');
    }
});

// 键盘导航支持
document.addEventListener('keydown', (e) => {
    // ESC键关闭移动端菜单
    if (e.key === 'Escape') {
        const sidebar = document.querySelector('.sidebar');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            if (menuBtn) {
                menuBtn.querySelector('i').className = 'fas fa-bars';
            }
        }
    }
});

// 页面加载完成后的初始化
window.addEventListener('load', () => {
    // 添加页面加载完成的类
    document.body.classList.add('loaded');
    
    // 触发技能条动画
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const rect = skillsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            initSkillBars();
        }
    }
});

// 性能优化：节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 应用节流到滚动事件
const throttledScroll = throttle(() => {
    // 滚动相关的性能敏感操作
}, 100);

window.addEventListener('scroll', throttledScroll);

// ===== 认证证书功能 =====

// 初始化认证功能
function initCertificationFeatures() {
    initCertificationAnimations();
    initCertificateModal();
    
    console.log('认证功能已初始化');
}

// 初始化认证卡片动画
function initCertificationAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察所有认证卡片
    const certificationCards = document.querySelectorAll('.certification-card');
    certificationCards.forEach(card => {
        observer.observe(card);
    });
}

// 初始化证书模态框
function initCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    
    if (modal) {
        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCertificate();
            }
        });
        
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeCertificate();
            }
        });
    }
}

// 显示证书
function showCertificate(certId) {
    const modal = document.getElementById('certificate-modal');
    const certificateImage = document.getElementById('certificate-image');
    const placeholder = document.querySelector('.certificate-placeholder');
    
    if (!modal) {
        console.error('证书模态框未找到');
        return;
    }
    
    // 查找对应的认证卡片
    const certificationCard = document.querySelector(`[onclick*="${certId}"]`).closest('.certification-card');
    const imageUrl = certificationCard ? certificationCard.getAttribute('data-certificate-image') : null;
    
    if (imageUrl) {
        certificateImage.src = imageUrl;
        certificateImage.style.display = 'block';
        placeholder.style.display = 'none';
        
        // 添加图片加载错误处理
        certificateImage.onerror = function() {
            certificateImage.style.display = 'none';
            placeholder.style.display = 'block';
        };
    } else {
        certificateImage.style.display = 'none';
        placeholder.style.display = 'block';
    }
    
    // 显示模态框
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    
    // 添加显示动画
    setTimeout(() => {
        modal.querySelector('.certificate-modal-content').style.transform = 'scale(1)';
        modal.querySelector('.certificate-modal-content').style.opacity = '1';
    }, 10);
}

// 关闭证书模态框
function closeCertificate() {
    const modal = document.getElementById('certificate-modal');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 恢复背景滚动
        
        // 重置模态框内容状态
        const modalContent = modal.querySelector('.certificate-modal-content');
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.opacity = '0';
    }
}

// 导出证书管理功能到全局作用域
window.showCertificate = showCertificate;
window.closeCertificate = closeCertificate;