/**
 * 郯城十里村田园综合体 - 地图功能
 */

// 地图实例
let map;
// 标记点数组
let markers = [];
// 当前路线
let currentRoute = null;
// 用户位置标记
let userMarker = null;
// 地图图层
let baseLayer, satelliteLayer;

// 景点数据
const poiData = [
    { id: 1, name: "游客服务中心", lat: 34.615, lng: 118.350, 
      desc: "景区入口处，提供游客咨询、导游服务", 
      img: "images/poi/visitor_center.jpg" },
    { id: 2, name: "银杏柳陶坊", lat: 34.617, lng: 118.353, 
      desc: "体验传统陶艺制作，感受非遗文化", 
      img: "images/poi/pottery.jpg" },
    { id: 3, name: "汤泉白果洞", lat: 34.618, lng: 118.355, 
      desc: "天然温泉SPA，放松身心的绝佳去处", 
      img: "images/poi/hotspring.jpg" },
    { id: 4, name: "观景台", lat: 34.619, lng: 118.357, 
      desc: "俯瞰整个田园风光的最佳位置", 
      img: "images/poi/viewpoint.jpg" },
    { id: 5, name: "生态农场", lat: 34.616, lng: 118.354, 
      desc: "体验采摘，了解有机种植过程", 
      img: "images/poi/farm.jpg" },
    { id: 6, name: "垂钓区", lat: 34.614, lng: 118.352, 
      desc: "休闲垂钓，品尝新鲜鱼获", 
      img: "images/poi/fishing.jpg" },
    { id: 7, name: "水上婚礼举办区", lat: 34.613, lng: 118.349, 
      desc: "举办传统水上婚礼仪式的场所", 
      img: "images/poi/wedding.jpg" },
    { id: 8, name: "龙舟赛道", lat: 34.617, lng: 118.348, 
      desc: "传统龙舟竞赛场地", 
      img: "images/poi/dragonboat.jpg" },
    { id: 9, name: "田园餐厅", lat: 34.620, lng: 118.351, 
      desc: "提供当地特色农家菜肴", 
      img: "images/poi/restaurant.jpg" },
    { id: 10, name: "民宿区", lat: 34.621, lng: 118.354, 
      desc: "特色农家住宿，体验乡村生活", 
      img: "images/poi/homestay.jpg" }
];

// 页面加载完成后初始化地图
document.addEventListener('DOMContentLoaded', initMap);

/**
 * 初始化地图
 */
function initMap() {
    // 创建地图实例
    map = L.map('map', {
        center: [34.617, 118.352], // 初始中心点
        zoom: 15, // 初始缩放级别
        minZoom: 14,
        maxZoom: 18
    });
    
    // 创建地图图层
    baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map); // 默认添加街道图层
    
    // 卫星图层
    satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri'
    });
    
    // 添加景区边界（假设数据）
    const scenicBoundary = [
        [34.610, 118.345],
        [34.625, 118.345],
        [34.625, 118.360],
        [34.610, 118.360]
    ];
    
    L.polygon(scenicBoundary, {
        color: '#3a8238',
        weight: 2,
        fillColor: '#3a8238',
        fillOpacity: 0.1
    }).addTo(map);
    
    // 添加景点标记
    addMarkers();
    
    // 初始化POI点击事件
    initPoiItemEvents();

    // 将地图和标记点暴露到全局，便于其他函数调用
    window.map = map;
    window.markers = markers;
}

/**
 * 添加景点标记到地图
 */
function addMarkers() {
    // 定义不同类型POI的图标
    const poiIcons = {
        default: L.icon({
            iconUrl: 'images/icons/marker-default.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        }),
        attraction: L.icon({
            iconUrl: 'images/icons/marker-attraction.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        }),
        service: L.icon({
            iconUrl: 'images/icons/marker-service.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        }),
        food: L.icon({
            iconUrl: 'images/icons/marker-food.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        }),
        accommodation: L.icon({
            iconUrl: 'images/icons/marker-accommodation.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        })
    };
    
    // 为每个POI选择图标
    function getIconForPOI(poiId) {
        switch(poiId) {
            case 1: return poiIcons.service;
            case 9: return poiIcons.food;
            case 10: return poiIcons.accommodation;
            default: return poiIcons.attraction;
        }
    }
    
    // 添加每个POI的标记
    poiData.forEach(poi => {
        // 创建标记
        const marker = L.marker([poi.lat, poi.lng], {
            icon: getIconForPOI(poi.id),
            id: poi.id
        }).addTo(map);
        
        // 创建弹出窗口内容
        const popupContent = `
            <div class="map-popup">
                <h5>${poi.name}</h5>
                <div class="popup-image">
                    <img src="${poi.img}" alt="${poi.name}" onerror="this.src='images/placeholder.jpg';">
                </div>
                <p>${poi.desc}</p>
                <div class="popup-actions">
                    <a href="attractions.html#poi-${poi.id}" class="btn btn-sm btn-outline-primary">详情</a>
                    <button class="btn btn-sm btn-outline-success" onclick="selectDestination(${poi.id})">导航</button>
                </div>
            </div>
        `;
        
        // 绑定弹出窗口
        marker.bindPopup(popupContent);
        
        // 存储到标记数组
        markers.push(marker);
    });
}

/**
 * 初始化POI列表项点击事件
 */
function initPoiItemEvents() {
    const poiItems = document.querySelectorAll('.poi-item');
    
    poiItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有项的激活状态
            poiItems.forEach(poi => {
                poi.classList.remove('active');
            });
            
            // 添加当前项的激活状态
            this.classList.add('active');
            
            // 获取数据属性
            const id = parseInt(this.getAttribute('data-id'));
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lng = parseFloat(this.getAttribute('data-lng'));
            
            // 移动地图到选定位置
            map.setView([lat, lng], 16);
            
            // 打开标记的弹出窗口
            markers.forEach(marker => {
                if (marker.options.id === id) {
                    marker.openPopup();
                }
            });
        });
    });
}

/**
 * 切换地图图层
 */
function toggleMapLayer(layerType) {
    if (layerType === 'satellite') {
        map.removeLayer(baseLayer);
        satelliteLayer.addTo(map);
    } else {
        map.removeLayer(satelliteLayer);
        baseLayer.addTo(map);
    }
}

/**
 * 定位用户位置
 */
function locateUser() {
    if (navigator.geolocation) {
        // 显示定位中提示
        showNotification('正在获取您的位置...');
        
        navigator.geolocation.getCurrentPosition(
            // 成功回调
            function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // 如果已有用户标记，移除它
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                
                // 创建用户位置标记
                userMarker = L.marker([userLat, userLng], {
                    icon: L.icon({
                        iconUrl: 'images/icons/user-location.png',
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                    })
                }).addTo(map);
                
                // 添加精度半径圈
                L.circle([userLat, userLng], {
                    radius: position.coords.accuracy,
                    color: '#4A89DC',
                    fillColor: '#4A89DC',
                    fillOpacity: 0.2
                }).addTo(map);
                
                // 移动地图到用户位置
                map.setView([userLat, userLng], 16);
                
                showNotification('已定位到您的位置', 'success');
            },
            // 错误回调
            function(error) {
                let errorMessage;
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "用户拒绝了位置请求";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "位置信息不可用";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "获取用户位置超时";
                        break;
                    case error.UNKNOWN_ERROR:
                        errorMessage = "发生未知错误";
                        break;
                }
                showNotification(errorMessage, 'error');
            }
        );
    } else {
        showNotification('您的浏览器不支持位置服务', 'error');
    }
}

/**
 * 规划路线
 */
function planRoute() {
    // 获取表单值
    const startPointValue = document.getElementById('start-point').value;
    const endPointValue = document.getElementById('end-point').value;
    const transportMode = document.getElementById('transport-mode').value;
    
    // 移除现有路线
    if (currentRoute) {
        map.removeLayer(currentRoute);
    }
    
    // 获取起点坐标
    let startCoords;
    if (startPointValue === '0') {
        // 当前位置
        if (!userMarker) {
            showNotification('请先获取您的位置', 'warning');
            return;
        }
        startCoords = userMarker.getLatLng();
    } else {
        // 选择的POI
        const startPoi = poiData.find(poi => poi.id.toString() === startPointValue);
        startCoords = { lat: startPoi.lat, lng: startPoi.lng };
    }
    
    // 获取终点坐标
    const endPoi = poiData.find(poi => poi.id.toString() === endPointValue);
    const endCoords = { lat: endPoi.lat, lng: endPoi.lng };
    
    // 在实际项目中，应该调用路线规划API
    // 这里使用模拟路线
    simulateRoute(startCoords, endCoords, transportMode);
}

/**
 * 模拟路线（在实际项目中应调用路线API）
 */
function simulateRoute(start, end, mode) {
    // 模拟路线点
    const routePoints = generateSimulatedRoute(start, end);
    
    // 根据交通模式设置路线样式
    let routeStyle;
    switch(mode) {
        case 'walking':
            routeStyle = {
                color: '#3388ff',
                weight: 4,
                opacity: 0.8,
                dashArray: '10, 10'
            };
            break;
        case 'cycling':
            routeStyle = {
                color: '#ff6b6b',
                weight: 4,
                opacity: 0.8
            };
            break;
        case 'driving':
            routeStyle = {
                color: '#3a8238',
                weight: 5,
                opacity: 0.8
            };
            break;
    }
    
    // 创建路线图层
    currentRoute = L.polyline(routePoints, routeStyle).addTo(map);
    
    // 调整地图视图以适应路线
    map.fitBounds(currentRoute.getBounds(), {
        padding: [50, 50]
    });
    
    // 显示路线信息
    showRouteInfo(mode, routePoints);
}

/**
 * 生成模拟路线点
 */
function generateSimulatedRoute(start, end) {
    // 这里是简单的模拟，实际项目中会使用真实的路线规划API
    const points = [];
    const steps = 8; // 路线点数量
    
    for (let i = 0; i <= steps; i++) {
        const factor = i / steps;
        
        // 线性插值基本路线
        let lat = start.lat + (end.lat - start.lat) * factor;
        let lng = start.lng + (end.lng - start.lng) * factor;
        
        // 添加一些随机偏移来模拟真实路线（除了起点和终点）
        if (i > 0 && i < steps) {
            lat += (Math.random() - 0.5) * 0.002;
            lng += (Math.random() - 0.5) * 0.002;
        }
        
        points.push([lat, lng]);
    }
    
    return points;
}

/**
 * 显示路线信息
 */
function showRouteInfo(mode, routePoints) {
    // 计算路线距离（米）
    let distance = 0;
    for (let i = 1; i < routePoints.length; i++) {
        distance += map.distance(routePoints[i-1], routePoints[i]);
    }
    
    // 转换为公里并四舍五入到一位小数
    distance = Math.round(distance / 100) / 10;
    
    // 估算时间（分钟）
    let timeEstimate;
    switch(mode) {
        case 'walking':
            timeEstimate = Math.round(distance * 15); // 假设步行速度约为4km/h
            break;
        case 'cycling':
            timeEstimate = Math.round(distance * 5); // 假设自行车速度约为12km/h
            break;
        case 'driving':
            timeEstimate = Math.round(distance * 3); // 假设景区观光车速度约为20km/h
            break;
    }
    
    // 根据交通模式获取对应的名称
    let modeName;
    switch(mode) {
        case 'walking':
            modeName = '步行';
            break;
        case 'cycling':
            modeName = '自行车';
            break;
        case 'driving':
            modeName = '观光车';
            break;
    }
    
    // 创建消息内容
    const message = `
        <div class="route-info">
            <div><i class="bi bi-signpost-2"></i> 路线长度: ${distance} 公里</div>
            <div><i class="bi bi-clock"></i> 预计耗时: ${timeEstimate} 分钟 (${modeName})</div>
        </div>
    `;
    
    // 显示通知
    showNotification(message, 'info', 10000); // 显示10秒
}

/**
 * 选择目的地（供弹出窗口中的导航按钮使用）
 */
function selectDestination(poiId) {
    // 关闭弹出窗口
    map.closePopup();
    
    // 设置目的地下拉框
    const endPointSelect = document.getElementById('end-point');
    endPointSelect.value = poiId;
    
    // 将页面滚动到路线规划区域
    document.querySelector('.card.mt-4').scrollIntoView({
        behavior: 'smooth'
    });
    
    // 高亮显示规划路线按钮
    const routeButton = document.querySelector('.card.mt-4 .btn-success');
    routeButton.classList.add('btn-pulse');
    
    // 一段时间后移除高亮效果
    setTimeout(() => {
        routeButton.classList.remove('btn-pulse');
    }, 3000);
}

/**
 * 显示通知消息
 */
function showNotification(message, type = 'info', duration = 3000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `map-notification ${type}`;
    notification.innerHTML = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 设置自动关闭
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
} 