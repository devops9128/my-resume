// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initSkillBars();
    initScrollAnimations();
    initMobileMenu();
    initFormSubmission();
    initSmoothScrolling();
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

// 项目链接处理
document.addEventListener('click', (e) => {
    if (e.target.closest('.project-link')) {
        e.preventDefault();
        
        const link = e.target.closest('.project-link');
        const isGithub = link.querySelector('.fa-github');
        
        if (isGithub) {
            showNotification('GitHub链接功能待实现', 'info');
        } else {
            showNotification('项目预览功能待实现', 'info');
        }
    }
});

// 社交链接处理
document.addEventListener('click', (e) => {
    if (e.target.closest('.social-link')) {
        e.preventDefault();
        showNotification('社交媒体链接功能待实现', 'info');
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