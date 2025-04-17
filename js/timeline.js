// 模拟时间数据（需根据实际数据扩展）
function generateTimelineData(data) {
    return data.nodes.map((node, i) => ({
        ...node,
        timestamp: new Date(2024, 0, i + 1) // 模拟时间戳
    }));
}

// 初始化时间轴
document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.getElementById('timeline');
    
    fetch('./graph.json')
        .then(res => res.json())
        .then(data => {
            const timeNodes = generateTimelineData(data);
            const maxTime = timeNodes.length - 1;
            timeline.max = maxTime;
            
            timeline.addEventListener('input', () => {
                const idx = parseInt(timeline.value);
                const filteredData = {
                    nodes: timeNodes.slice(0, idx + 1),
                    links: data.links.filter(link => 
                        link.source <= idx && link.target <= idx
                    )
                };
                
                graphInstance.graphData(filteredData);
            });
        });
});