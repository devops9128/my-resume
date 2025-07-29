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
    
    // 异步获取信息
    updateGitHubInfo();
    updateLinkedInInfo();
    
    // 验证配置
    validateLinkedInConfig();
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
    const animatedElements = document.querySelectorAll('.stat-card, .timeline-item, .education-card, .project-card');
    
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
    username: 'devops9128', // 替换为您的GitHub用户名
    repositories: {
        'E-commerce Platform': 'ecommerce-platform',
        'Task Management App': 'task-management-app', 
        'Weather Dashboard': 'weather-dashboard'
    }
};

// LinkedIn配置
const LINKEDIN_CONFIG = {
    profileUrl: 'https://www.linkedin.com/in/tkgoh9128/', // 替换为您的LinkedIn个人资料URL
    companyName: 'Tech Solutions Inc.', // 当前公司名称
    position: 'Senior Frontend Developer', // 当前职位
    location: 'San Francisco, CA', // 所在地区
    connections: '500+', // 联系人数量
    skills: [
        'JavaScript', 'React', 'Node.js', 'TypeScript', 
        'Vue.js', 'Python', 'AWS', 'Docker'
    ]
};

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
    
    // 初始化LinkedIn信息切换功能
    initLinkedInToggle();
}

// 初始化LinkedIn信息切换功能
function initLinkedInToggle() {
    const toggleBtn = document.getElementById('linkedin-toggle-btn');
    const linkedinInfo = document.getElementById('linkedin-info');
    
    if (toggleBtn && linkedinInfo) {
        toggleBtn.addEventListener('click', () => {
            const isVisible = linkedinInfo.style.display !== 'none';
            
            if (isVisible) {
                // 隐藏LinkedIn信息
                linkedinInfo.classList.remove('show');
                setTimeout(() => {
                    linkedinInfo.style.display = 'none';
                }, 300);
                
                toggleBtn.classList.remove('active');
                toggleBtn.querySelector('span').textContent = 'View Professional Profile';
            } else {
                // 显示LinkedIn信息
                linkedinInfo.style.display = 'block';
                setTimeout(() => {
                    linkedinInfo.classList.add('show');
                }, 50);
                
                toggleBtn.classList.add('active');
                toggleBtn.querySelector('span').textContent = 'Hide Professional Profile';
            }
        });
    }
}

// 处理LinkedIn按钮点击
function handleLinkedInClick(element) {
    openLinkedInProfile();
}

// 打开LinkedIn个人资料
function openLinkedInProfile() {
    const linkedinUrl = LINKEDIN_CONFIG.profileUrl;
    
    // 显示加载提示
    showNotification('正在跳转到LinkedIn个人资料...', 'info');
    
    // 延迟跳转，让用户看到提示
    setTimeout(() => {
        window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
        showNotification('已在新标签页打开LinkedIn个人资料', 'success');
    }, 500);
}

// 验证LinkedIn配置
function validateLinkedInConfig() {
    if (!LINKEDIN_CONFIG.profileUrl || LINKEDIN_CONFIG.profileUrl === 'https://www.linkedin.com/in/john-smith-developer') {
        console.warn('请在LINKEDIN_CONFIG中配置您的LinkedIn个人资料URL');
        return false;
    }
    
    try {
        new URL(LINKEDIN_CONFIG.profileUrl);
        return true;
    } catch (error) {
        console.error('LinkedIn URL格式不正确:', error);
        return false;
    }
}

// 更新LinkedIn信息显示
function updateLinkedInInfo() {
    // 更新LinkedIn链接的tooltip
    const linkedinLinks = document.querySelectorAll('.social-link[data-tooltip="LinkedIn"]');
    linkedinLinks.forEach(link => {
        const tooltipText = `LinkedIn - ${LINKEDIN_CONFIG.position} at ${LINKEDIN_CONFIG.companyName}`;
        link.setAttribute('data-tooltip', tooltipText);
    });
    
    // 准备LinkedIn信息卡片数据（不自动显示）
    prepareLinkedInCard();
    
    console.log('LinkedIn信息已更新');
}

// 准备LinkedIn信息卡片数据
function prepareLinkedInCard() {
    const linkedinInfo = document.getElementById('linkedin-info');
    
    if (linkedinInfo) {
        // 更新职业信息
        const positionElement = document.getElementById('linkedin-position');
        const companyElement = document.getElementById('linkedin-company');
        const locationElement = document.getElementById('linkedin-location');
        const connectionsElement = document.getElementById('linkedin-connections');
        
        if (positionElement) positionElement.textContent = LINKEDIN_CONFIG.position;
        if (companyElement) companyElement.textContent = LINKEDIN_CONFIG.companyName;
        if (locationElement) locationElement.textContent = LINKEDIN_CONFIG.location;
        if (connectionsElement) connectionsElement.textContent = `${LINKEDIN_CONFIG.connections} connections`;
        
        // 更新技能标签
        updateLinkedInSkillsTags();
    }
}

// 显示LinkedIn信息卡片
function displayLinkedInCard() {
    const linkedinInfo = document.getElementById('linkedin-info');
    
    if (linkedinInfo) {
        // 更新职业信息
        const positionElement = document.getElementById('linkedin-position');
        const companyElement = document.getElementById('linkedin-company');
        const locationElement = document.getElementById('linkedin-location');
        const connectionsElement = document.getElementById('linkedin-connections');
        
        if (positionElement) positionElement.textContent = LINKEDIN_CONFIG.position;
        if (companyElement) companyElement.textContent = LINKEDIN_CONFIG.companyName;
        if (locationElement) locationElement.textContent = LINKEDIN_CONFIG.location;
        if (connectionsElement) connectionsElement.textContent = `${LINKEDIN_CONFIG.connections} connections`;
        
        // 更新技能标签
        updateLinkedInSkillsTags();
        
        // 显示卡片
        linkedinInfo.style.display = 'block';
        
        // 添加动画效果
        setTimeout(() => {
            linkedinInfo.classList.add('show');
        }, 100);
    }
}

// 更新LinkedIn技能标签
function updateLinkedInSkillsTags() {
    const skillsContainer = document.getElementById('linkedin-skills-tags');
    
    if (skillsContainer) {
        skillsContainer.innerHTML = '';
        
        // 获取前5个技能
        const topSkills = getLinkedInSkills();
        
        topSkills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            skillsContainer.appendChild(skillTag);
        });
    }
}

// 获取LinkedIn技能标签
function getLinkedInSkills() {
    return LINKEDIN_CONFIG.skills.slice(0, 5); // 返回前5个技能
}

// 显示LinkedIn连接信息
function showLinkedInConnectionInfo() {
    const connectionInfo = {
        company: LINKEDIN_CONFIG.companyName,
        position: LINKEDIN_CONFIG.position,
        location: LINKEDIN_CONFIG.location,
        connections: LINKEDIN_CONFIG.connections
    };
    
    return connectionInfo;
}
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
        // 项目中的GitHub按钮
        const projectCard = element.closest('.project-card');
        const projectTitle = projectCard.querySelector('.project-title').textContent;
        
        openGitHubRepository(projectTitle);
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

// 打开GitHub项目仓库
function openGitHubRepository(projectTitle) {
    const repoName = GITHUB_CONFIG.repositories[projectTitle];
    
    if (repoName) {
        const repoUrl = `https://github.com/${GITHUB_CONFIG.username}/${repoName}`;
        
        showNotification(`正在跳转到 ${projectTitle} 项目仓库...`, 'info');
        
        setTimeout(() => {
            window.open(repoUrl, '_blank', 'noopener,noreferrer');
        }, 500);
    } else {
        showNotification('项目仓库链接暂未配置', 'error');
    }
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

// 项目链接处理（更新后的版本）
document.addEventListener('click', (e) => {
    const projectLink = e.target.closest('.project-link[data-type="demo"]');
    
    if (projectLink) {
        e.preventDefault();
        
        const projectCard = projectLink.closest('.project-card');
        const projectTitle = projectCard.querySelector('.project-title').textContent;
        
        showNotification(`${projectTitle} 在线演示功能待实现`, 'info');
    }
});

// 其他社交链接处理
document.addEventListener('click', (e) => {
    const socialLink = e.target.closest('.social-link');
    
    if (socialLink && socialLink.getAttribute('data-type') !== 'github' && socialLink.getAttribute('data-type') !== 'linkedin') {
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