/**
 * 郯城十里村田园综合体网站 - 主JavaScript文件
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏滚动效果
    initNavbarScroll();
    
    // 初始化POI点击事件（如果在地图页面）
    if (document.querySelector('.poi-item')) {
        initPoiClicks();
    }
    
    // 初始化日期选择器（如果在预订页面）
    if (document.querySelector('.date-picker')) {
        initDatePickers();
    }
    
    // 初始化图片延迟加载
    initLazyLoading();
    
    // 初始化天气API（模拟）
    initWeatherAPI();
    
    // 初始化VR全景（如果在VR页面）
    if (document.querySelector('.vr-panorama-container')) {
        initVRPanorama();
    }

    // 初始化AOS动画库
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // 页面滚动时添加背景
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.glassmorphism-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 滚动指示器平滑滚动
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const target = document.querySelector('.py-6');
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // 更新页面导航激活状态
    updateActiveNavLink();
});

/**
 * 导航栏滚动效果
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
            navbar.classList.add('bg-white');
        } else {
            if (!document.querySelector('.navbar-collapse.show')) {
                navbar.classList.remove('shadow-sm');
            }
        }
    });
}

/**
 * 兴趣点点击事件处理
 */
function initPoiClicks() {
    const poiItems = document.querySelectorAll('.poi-item');
    
    poiItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他激活状态
            poiItems.forEach(poi => poi.classList.remove('active'));
            
            // 添加当前激活状态
            this.classList.add('active');
            
            // 获取POI坐标
            const lat = this.getAttribute('data-lat');
            const lng = this.getAttribute('data-lng');
            
            // 如果地图已初始化
            if (window.map) {
                // 移动地图到该位置
                window.map.panTo([lat, lng]);
                
                // 打开相应的标记信息窗口
                const poiId = this.getAttribute('data-id');
                window.markers.forEach(marker => {
                    if (marker.options.id === poiId) {
                        marker.openPopup();
                    }
                });
            }
        });
    });
}

/**
 * 初始化日期选择器
 */
function initDatePickers() {
    const datePickers = document.querySelectorAll('.date-picker');
    
    datePickers.forEach(picker => {
        // 这里使用原生日期选择器，实际项目中应使用更好的第三方库
        picker.addEventListener('focus', function() {
            this.type = 'date';
        });
        
        picker.addEventListener('blur', function() {
            if (!this.value) {
                this.type = 'text';
            }
        });
    });
    
    // 检查入住日期和退房日期的逻辑
    const checkInDate = document.querySelector('#check-in-date');
    const checkOutDate = document.querySelector('#check-out-date');
    
    if (checkInDate && checkOutDate) {
        checkInDate.addEventListener('change', function() {
            const minCheckOutDate = new Date(this.value);
            minCheckOutDate.setDate(minCheckOutDate.getDate() + 1);
            
            // 设置退房日期最小值为入住日期+1天
            const month = String(minCheckOutDate.getMonth() + 1).padStart(2, '0');
            const day = String(minCheckOutDate.getDate()).padStart(2, '0');
            checkOutDate.min = `${minCheckOutDate.getFullYear()}-${month}-${day}`;
            
            // 如果当前选择的退房日期早于最小退房日期，则更新退房日期
            if (new Date(checkOutDate.value) <= new Date(this.value)) {
                checkOutDate.value = `${minCheckOutDate.getFullYear()}-${month}-${day}`;
            }
        });
    }
}

/**
 * 初始化图片延迟加载
 */
function initLazyLoading() {
    // 如果浏览器支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 如果浏览器不支持，则立即加载所有图片
        const lazyImages = document.querySelectorAll('.lazy-image');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy-image');
        });
    }
}

/**
 * 初始化天气API（模拟）
 */
function initWeatherAPI() {
    const weatherTemp = document.getElementById('temperature');
    const weatherCondition = document.getElementById('weather-condition');
    
    if (weatherTemp && weatherCondition) {
        // 在实际项目中，这里应该调用真实的天气API
        // 这里使用模拟数据
        const weather = {
            temperature: 25,
            condition: '晴'
        };
        
        weatherTemp.textContent = `${weather.temperature}°C`;
        weatherCondition.textContent = weather.condition;
    }
}

/**
 * 初始化VR全景（模拟）
 */
function initVRPanorama() {
    // 在实际项目中，应该使用全景库如Pannellum或Three.js
    console.log('VR全景初始化');
    
    // 模拟VR加载完成
    const vrContainer = document.querySelector('.vr-panorama-container');
    if (vrContainer) {
        const loadingElement = vrContainer.querySelector('.loading');
        if (loadingElement) {
            setTimeout(() => {
                loadingElement.style.display = 'none';
            }, 1500);
        }
    }
}

/**
 * 预订表单验证
 */
function validateBookingForm(form) {
    const name = form.querySelector('#name').value;
    const phone = form.querySelector('#phone').value;
    const checkInDate = form.querySelector('#check-in-date').value;
    const checkOutDate = form.querySelector('#check-out-date').value;
    
    if (!name || !phone || !checkInDate || !checkOutDate) {
        alert('请填写所有必填字段');
        return false;
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        alert('请输入有效的手机号码');
        return false;
    }
    
    // 验证日期逻辑
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkIn < today) {
        alert('入住日期不能早于今天');
        return false;
    }
    
    if (checkOut <= checkIn) {
        alert('退房日期必须晚于入住日期');
        return false;
    }
    
    return true;
}

/**
 * 活动预订表单验证
 */
function validateActivityForm(form) {
    const name = form.querySelector('#name').value;
    const phone = form.querySelector('#phone').value;
    const activityDate = form.querySelector('#activity-date').value;
    const participants = form.querySelector('#participants').value;
    
    if (!name || !phone || !activityDate || !participants) {
        alert('请填写所有必填字段');
        return false;
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        alert('请输入有效的手机号码');
        return false;
    }
    
    // 验证日期逻辑
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activity = new Date(activityDate);
    
    if (activity < today) {
        alert('活动日期不能早于今天');
        return false;
    }
    
    // 验证参与人数
    if (participants < 1) {
        alert('参与人数必须大于0');
        return false;
    }
    
    return true;
}

/**
 * 提交表单并显示确认信息
 */
function submitBooking(formId) {
    const form = document.getElementById(formId);
    
    if (formId === 'room-booking-form') {
        if (!validateBookingForm(form)) {
            return;
        }
    } else if (formId === 'activity-booking-form') {
        if (!validateActivityForm(form)) {
            return;
        }
    }
    
    // 在实际项目中，这里应该进行AJAX提交
    // 这里仅作模拟
    const confirmationContainer = document.querySelector('.booking-confirmation');
    if (confirmationContainer) {
        // 隐藏表单
        form.style.display = 'none';
        
        // 显示确认信息
        confirmationContainer.style.display = 'block';
        confirmationContainer.scrollIntoView({ behavior: 'smooth' });
        
        // 生成订单编号（仅作演示）
        const orderNumber = document.getElementById('order-number');
        if (orderNumber) {
            const randomOrderId = 'TC' + Date.now().toString().slice(-8);
            orderNumber.textContent = randomOrderId;
        }
    }
}

// 更新导航链接激活状态
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath.endsWith(href) || 
            (currentPath.endsWith('/') && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 获取当前天气（模拟）
function updateWeather() {
    const temperatures = [22, 23, 24, 25, 26, 27, 28];
    const conditions = ['晴', '多云', '小雨', '阵雨', '晴转多云'];
    
    const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    const tempElement = document.getElementById('temperature');
    const conditionElement = document.getElementById('weather-condition');
    
    if (tempElement) tempElement.textContent = `${randomTemp}°C`;
    if (conditionElement) conditionElement.textContent = randomCondition;
}

// 页面加载完成后更新天气
document.addEventListener('DOMContentLoaded', updateWeather); 