## 错误：未检查malloc返回值
**错误代码**：
```c
LNode* s = malloc(sizeof(LNode));
s->data = 10; // 危险！
```

###### 修正方法

`if (s == NULL) exit(1);`