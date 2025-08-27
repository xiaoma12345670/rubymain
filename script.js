// script.js

document.addEventListener('DOMContentLoaded', function() {
    // 获取窗口元素
    const windowElement = document.querySelector('.win98-window');
    const titleBar = document.querySelector('.title-bar');
    const closeButton = document.querySelector('.title-bar-controls button[aria-label="Close"]');

    // 1. 实现关闭按钮功能
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            // 简单做法：直接隐藏窗口
            // windowElement.style.display = 'none';

            // 炫酷做法：添加一个消失的动画
            windowElement.style.animation = 'fadeOut 0.2s forwards';
            setTimeout(() => { windowElement.style.display = 'none'; }, 200);
        });
    }

    // 2. 实现窗口拖动功能 (这是一个简化版)
    let isDragging = false;
    let startX, startY, initialX, initialY;

    titleBar.addEventListener('mousedown', function(e) {
        isDragging = true;
        // 记录鼠标按下时的初始位置和窗口的初始位置
        startX = e.clientX;
        startY = e.clientY;
        initialX = windowElement.offsetLeft;
        initialY = windowElement.offsetTop;

        // 防止拖动过程中选中文字
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            // 计算鼠标移动的距离
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            // 设置窗口的新位置
            windowElement.style.left = (initialX + dx) + 'px';
            windowElement.style.top = (initialY + dy) + 'px';
            // 将定位方式改为absolute，否则left/top不生效
            windowElement.style.position = 'absolute';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

});

// 可选的CSS动画：用于关闭窗口
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
    }
`;
document.head.appendChild(style);