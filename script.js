// script.js
let currentZIndex = 100;
let openWindows = {};
let activeWindowId = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    updateClock();
    setInterval(updateClock, 60000); // 每分钟更新一次时间
});

// 更新时间显示
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = 
        now.getHours().toString().padStart(2, '0') + ':' + 
        now.getMinutes().toString().padStart(2, '0');
}

// 切换开始菜单
function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// 点击桌面其他地方关闭开始菜单
document.addEventListener('click', function(e) {
    if (!e.target.closest('.start-button') && !e.target.closest('.start-menu')) {
        document.getElementById('start-menu').style.display = 'none';
    }
});

// 打开窗口
function openWindow(type) {
    const windowId = type + '-' + Date.now();
    
    // 创建窗口HTML
    const windowHtml = `
        <div class="win98-window active" id="${windowId}" style="left: 100px; top: 100px;">
            <div class="title-bar" onmousedown="startDrag('${windowId}', event)">
                <div class="title-bar-text">${getWindowTitle(type)}</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize" onclick="minimizeWindow('${windowId}')">_</button>
                    <button aria-label="Maximize" onclick="maximizeWindow('${windowId}')">□</button>
                    <button aria-label="Close" onclick="closeWindow('${windowId}')">X</button>
                </div>
            </div>
            <div class="window-content">
                ${getWindowContent(type)}
            </div>
        </div>
    `;
    
    // 添加到页面
    document.getElementById('window-container').insertAdjacentHTML('beforeend', windowHtml);
    
    // 添加到任务栏
    addToTaskbar(windowId, getWindowTitle(type));
    
    // 设置为活动窗口
    setActiveWindow(windowId);
    
    // 存储窗口信息
    openWindows[windowId] = { type, minimized: false, maximized: false };
}

// 根据类型返回窗口标题
function getWindowTitle(type) {
    const titles = {
        'notepad': '记事本 - 欢迎.txt',
        'mods': '我们的模组',
        'about': '关于MC模组工作室'
    };
    return titles[type] || '未知程序';
}

// 根据类型返回窗口内容
function getWindowContent(type) {
    const contents = {
        'notepad': `
            <p>欢迎来到我们的工作室！</p>
            <p>我们专注于创作有趣、高质量的模组和游戏。</p>
            <p>当前项目：ruby官网</p>
            <p>状态：开发中...</p>
            <p>想要回到旧网站吗？</p><a href = "https://rubystudio.dpdns.org/oldmain">点击这里</a><p>。</p>
        `,
        'mods': `
            <h3>我们的模组与游戏作品</h3>
            <ul>
                <li>红宝石与新世界</li>
                <li>狗猫的世界</li>
            </ul>
            <p>双击模组名称查看详情...</p>
        `,
        'about': `
            <h3>关于我们</h3>
            <p>我们是一群热爱Minecraft与独立游戏的开发者，</p>
            <p>致力于为社区创造精彩的游戏体验。</p>
            <br>
            <p>成立时间：2024年</p>
            <p>成员：5人</p>
            <p>已发布作品：2个</p>
        `
    };
    return contents[type] || '<p>内容加载中...</p>';
}

// 关闭窗口
function closeWindow(windowId) {
    document.getElementById(windowId).remove();
    removeFromTaskbar(windowId);
    delete openWindows[windowId];
}

// 最大化窗口
function maximizeWindow(windowId) {
    const window = document.getElementById(windowId);
    const isMaximized = window.classList.contains('maximized');
    
    if (isMaximized) {
        window.classList.remove('maximized');
        openWindows[windowId].maximized = false;
    } else {
        window.classList.add('maximized');
        openWindows[windowId].maximized = true;
    }
}

// 最小化窗口
function minimizeWindow(windowId) {
    document.getElementById(windowId).style.display = 'none';
    openWindows[windowId].minimized = true;
}

// 添加到任务栏
function addToTaskbar(windowId, title) {
    const taskbarItem = document.createElement('div');
    taskbarItem.className = 'taskbar-item';
    taskbarItem.textContent = title;
    taskbarItem.onclick = () => toggleWindow(windowId);
    taskbarItem.id = 'taskbar-' + windowId;
    
    document.getElementById('taskbar-items').appendChild(taskbarItem);
}

// 从任务栏移除
function removeFromTaskbar(windowId) {
    const item = document.getElementById('taskbar-' + windowId);
    if (item) item.remove();
}

// 切换窗口显示/隐藏
function toggleWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window.style.display === 'none') {
        window.style.display = 'block';
        openWindows[windowId].minimized = false;
        setActiveWindow(windowId);
    } else {
        window.style.display = 'none';
        openWindows[windowId].minimized = true;
    }
}

// 设置活动窗口
function setActiveWindow(windowId) {
    // 重置所有窗口的z-index
    document.querySelectorAll('.win98-window').forEach(win => {
        win.style.zIndex = '10';
    });
    
    // 设置当前窗口为最高
    const window = document.getElementById(windowId);
    window.style.zIndex = currentZIndex++;
    activeWindowId = windowId;
    
    // 更新任务栏状态
    document.querySelectorAll('.taskbar-item').forEach(item => {
        item.classList.remove('active');
    });
    const taskbarItem = document.getElementById('taskbar-' + windowId);
    if (taskbarItem) taskbarItem.classList.add('active');
}

// 拖动功能（简化版）
function startDrag(windowId, e) {
    setActiveWindow(windowId);
    const window = document.getElementById(windowId);
    if (window.classList.contains('maximized')) return;
    
    let startX = e.clientX;
    let startY = e.clientY;
    let startLeft = parseInt(window.style.left);
    let startTop = parseInt(window.style.top);
    
    function onDrag(e) {
        window.style.left = (startLeft + e.clientX - startX) + 'px';
        window.style.top = (startTop + e.clientY - startY) + 'px';
    }
    
    function stopDrag() {
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
    }
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    e.preventDefault();
}

// 关机功能（彩蛋）
function shutdown() {
    if (confirm('确实要关闭计算机吗？')) {
        document.body.innerHTML = `
            <div style="
                background-color: #000080;
                color: white;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: 'Microsoft Sans Serif';
            ">
                <h2>现在可以安全地关闭计算机了。</h2>
                <p style="margin-top: 20px;">要重新启动，请刷新页面。</p>
            </div>
        `;
    }

}
