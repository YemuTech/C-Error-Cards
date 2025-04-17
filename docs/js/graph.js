// 初始化图谱
const container = document.getElementById('graph-container');
const searchInput = document.querySelector('.search-box');

fetch('./graph.json')
  .then(res => res.json())
  .then(data => {
    // 预处理数据：计算节点关联度
    data.nodes.forEach(node => {
      node.linkCount = data.links.filter(
        link => link.source === node.id || link.target === node.id
      ).length;
    });

    // 创建图谱实例
    const graph = ForceGraph()
      .graphData(data)
      .nodeId('id')
      // 节点配置
      .nodeLabel(node => `${node.id} (关联错误数: ${node.linkCount})`)
      .nodeVal(node => Math.sqrt(node.linkCount) * 8)
      .nodeColor(node => colorScale(node.group))
      // 连线配置
      .linkDirectionalArrowLength(8)
      .linkDirectionalParticles(link => link.value * 2)
      .linkColor(() => 'rgba(255, 255, 255, 0.3)')
      // 交互配置
      .onNodeHover(handleNodeHover)
      (container);

    // 颜色映射函数
    function colorScale(group) {
      const hue = group * 120 % 360;
      return `hsl(${hue}, 70%, 50%)`;
    }

    // 节点悬停交互
    function handleNodeHover(node) {
      graph.linkVisibility(link => 
        !node || link.source === node || link.target === node
      );
    }

    // 搜索功能
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      graph.nodeVisibility(node => 
        node.id.toLowerCase().includes(searchTerm)
      );
    });
  });
  let graphInstance = null;
let currentMode = '3d';

// 初始化3D图谱
function init3DGraph(container, data) {
    return new ThreeForceGraph()
        .graphData(data)
        .nodeThreeObject(node => {
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(5),
                new THREE.MeshPhongMaterial({
                    color: new THREE.Color(`hsl(${node.group * 120}, 70%, 50%)`),
                    transparent: true,
                    opacity: 0.8
                })
            );
            sphere.userData = node;
            return sphere;
        })
        .linkColor(() => new THREE.Color(0xffffff))
        .linkOpacity(0.2)
        .linkWidth(1)
        .onNodeHover(handleNodeHover)
        (container);
}

// 初始化2D图谱
function init2DGraph(container, data) {
    return ForceGraph()
        .graphData(data)
        .nodeLabel(node => `${node.id} (关联数: ${node.linkCount})`)
        .nodeVal(node => Math.sqrt(node.linkCount) * 8)
        .nodeColor(node => `hsl(${node.group * 120}, 70%, 50%)`)
        .linkDirectionalArrowLength(8)
        .linkDirectionalParticles(2)
        .onNodeHover(handleNodeHover)
        (container);
}

// 模式切换
function switchMode(mode) {
    currentMode = mode;
    const container = document.getElementById('graph-container');
    container.innerHTML = ''; // 清空旧实例
    
    fetch('./graph.json')
        .then(res => res.json())
        .then(data => {
            graphInstance = currentMode === '3d' 
                ? init3DGraph(container, data)
                : init2DGraph(container, data);
        });
}

// 初始化加载
document.addEventListener('DOMContentLoaded', () => {
    const statusBar = document.querySelector('.status-bar');
    const searchInput = document.querySelector('.search-box');
    
    fetch('./graph.json')
        .then(res => {
            if (!res.ok) throw new Error('数据加载失败');
            return res.json();
        })
        .then(data => {
            statusBar.textContent = `已加载 ${data.nodes.length} 个节点`;
            switchMode('3d'); // 默认3D模式
            
            searchInput.addEventListener('input', () => {
                const term = searchInput.value.toLowerCase();
                const hasMatch = data.nodes.some(node => 
                    node.id.toLowerCase().includes(term)
                );
                
                graphInstance.nodeVisibility(node =>
                    node.id.toLowerCase().includes(term)
                );
                
                statusBar.textContent = hasMatch 
                    ? `找到 ${graphInstance.nodeVisibility().length} 个匹配项`
                    : "无匹配结果";
            });
        })
        .catch(err => {
            statusBar.textContent = `错误: ${err.message}`;
            statusBar.style.color = 'red';
        });
});