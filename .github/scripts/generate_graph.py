import os
import json
from glob import glob

def build_graph():
    nodes = []
    links = []
    
    # 遍历所有Markdown文件
    md_files = glob("**/*.md", recursive=True)
    for file in md_files:
        node_id = os.path.splitext(file)[0]
        nodes.append({"id": node_id, "group": 1})
        
        # 提取双链 [[...]]
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
            links_in_file = set(re.findall(r"\[\[(.*?)\]\]", content))
            for target in links_in_file:
                links.append({"source": node_id, "target": target, "value": 1})
    
    # 生成图谱数据
    graph = {"nodes": nodes, "links": links}
    with open("graph.json", "w") as f:
        json.dump(graph, f, ensure_ascii=False)

if __name__ == "__main__":
    build_graph()