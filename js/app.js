const engine = new AudioEngine();
const matrixContainer = document.getElementById('matrix');
const statusText = document.getElementById('statusText');
const playBtn = document.getElementById('playBtn');
const audioUpload = document.getElementById('audioUpload');

let currentActiveCell = null;

// 1. 动态生成 9x9 = 81 个格子
for (let y = 0; y < 9; y++) {
  for (let x = 0; x < 9; x++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.x = x;
    cell.dataset.y = y;

    cell.addEventListener('click', () => {
      if (!engine.isPlaying) return;
      
      // 更新激活样式高亮
      if (currentActiveCell) currentActiveCell.classList.remove('active');
      cell.classList.add('active');
      currentActiveCell = cell;

      // 调度音频变调
      engine.updateParams(x, y);
      statusText.innerText = `当前听法坐标：[X: ${x}, Y: ${y}]`;
    });

    matrixContainer.appendChild(cell);
  }
}

// 2. 监听文件上传
audioUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const fileUrl = URL.createObjectURL(file);
    engine.init(fileUrl);
    playBtn.disabled = false;
    playBtn.innerText = '开始播放';
  }
});

// 3. 播放/暂停控制
playBtn.addEventListener('click', () => {
  const isPlaying = engine.togglePlay();
  playBtn.innerText = isPlaying ? '暂停' : '继续播放';
  
  // 首次播放默认激活中心格子 (4,4)
  if (isPlaying && !currentActiveCell) {
    const defaultCell = document.querySelector('.cell[data-x="4"][data-y="4"]');
    if (defaultCell) defaultCell.click();
  }
});
