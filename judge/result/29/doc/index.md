---
layout: page
title: 文档：29 队
---

一、思路

1、靠边走，既沿着右手边或者左手边走，一定能到达目标点。

2、对每个地精，在当前位置对可能走到的边界点进行评价，选取最优评价方向走。评价包括：距离地精的最短路和到达目标点的曼哈顿距离。也可以考虑对方走的记录等。

二、算法

1、bfs广度优先搜索求出最短路

2、评价函数：线性评价函数，val = dis[x][y] * a + (abs(x - finalX) + abs(y - finlY)) * b，对a\b进行调参

三、改进

1、分析对方的路径，尽量避免很长的死胡同。

2、对3只地精进行不同的参数
