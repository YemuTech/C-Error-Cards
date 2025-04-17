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