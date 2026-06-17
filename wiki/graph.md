---
title: 知识图谱
created: 2026-06-17
updated: 2026-06-17
type: graph
tags: [graph, visualization, 知识图谱, 交互式]
---

# 知识图谱

> 交互式可视化知识图谱，展示 AI 教育领域的概念、实体和关系网络。

## 使用说明

- **缩放**: 使用鼠标滚轮或触摸板缩放
- **拖拽**: 点击并拖拽画布移动
- **点击节点**: 点击节点跳转到对应页面
- **拖拽节点**: 点击并拖拽节点调整位置

## 图谱

<div id="graph-container" style="width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 8px;"></div>

<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
<script>
// 加载图谱数据
fetch('/assets/graph.json')
  .then(response => response.json())
  .then(graphData => {
    // 节点样式配置
    const nodeStyles = {
      concept: { color: '#4285F4', shape: 'dot', size: 20 },
      entity: { color: '#34A853', shape: 'diamond', size: 15 },
      paper: { color: '#9E9E9E', shape: 'square', size: 10 },
      timeline: { color: '#FF9800', shape: 'triangle', size: 12 },
      tutorial: { color: '#9C27B0', shape: 'star', size: 12 },
    };

    // 处理节点数据
    const nodes = graphData.nodes.map(node => ({
      id: node.id,
      label: node.label,
      color: nodeStyles[node.type]?.color || '#9E9E9E',
      shape: nodeStyles[node.type]?.shape || 'dot',
      size: nodeStyles[node.type]?.size || 10,
      title: ,
      font: { size: 14, color: '#333' },
      path: node.path,
    }));

    // 处理边数据
    const edges = graphData.edges.map(edge => ({
      from: edge.from,
      to: edge.to,
      color: { color: '#ccc', highlight: '#4285F4' },
      width: 1,
      smooth: { type: 'continuous' },
    }));

    // 创建 vis.js 数据集
    const nodesDataSet = new vis.DataSet(nodes);
    const edgesDataSet = new vis.DataSet(edges);

    // 配置选项
    const options = {
      nodes: {
        borderWidth: 2,
        borderWidthSelected: 3,
        font: {
          size: 14,
          face: 'Arial',
        },
      },
      edges: {
        smooth: {
          type: 'continuous',
        },
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08,
          damping: 0.4,
        },
        stabilization: {
          iterations: 1000,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
      },
    };

    // 创建网络图
    const container = document.getElementById('graph-container');
    const data = { nodes: nodesDataSet, edges: edgesDataSet };
    const network = new vis.Network(container, data, options);

    // 点击节点跳转
    network.on('click', function(params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = nodesDataSet.get(nodeId);
        if (node && node.path) {
          // 跳转到对应页面
          window.location.href = '/' + node.path.replace('.md', '/');
        }
      }
    });

    // 显示统计信息
    console.log('图谱加载完成:', graphData.stats);
  })
  .catch(error => {
    console.error('加载图谱数据失败:', error);
    document.getElementById('graph-container').innerHTML = '<p style="padding: 20px; color: #999;">图谱加载失败，请刷新页面重试。</p>';
  });
</script>

## 图例

| 颜色 | 形状 | 类型 |
|------|------|------|
| <span style="color: #4285F4;">●</span> 蓝色 | 圆形 | 概念 |
| <span style="color: #34A853;">◆</span> 绿色 | 菱形 | 实体 |
| <span style="color: #9E9E9E;">■</span> 灰色 | 方形 | 论文 |
| <span style="color: #FF9800;">▲</span> 橙色 | 三角形 | 时间线 |
| <span style="color: #9C27B0;">★</span> 紫色 | 星形 | 教程 |

## 统计信息

图谱数据由  自动生成，包含：

- **节点**: 概念、实体、论文、时间线、教程页面
- **边**: 页面之间的 wikilink 关系
- **更新频率**: 每次添加新页面后重新生成

## 相关页面

- [自适应学习系统](../concepts/自适应学习系统/) — 核心概念
- [知识追踪](../concepts/知识追踪/) — 核心技术
- [教学智能体](../concepts/教学智能体/) — AI 教学助手

---

*图谱数据自动生成，最后更新: 2026-06-17*
