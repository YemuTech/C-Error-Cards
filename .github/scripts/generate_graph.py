import os
import re
from markdown_link_extractor import extract_links

def generate_knowledge_graph():
    nodes = []
    links = []
    
    # 遍历所有Markdown文件
    for root, _, files in os.walk("."):
        for file in files:
            if file.endswith(".md"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                    # 提取双链 [[...]]
                    matches = re.findall(r"\[\[(.*?)\]\]", content)
                    nodes.append(file)
                    for match in matches:
                        links.append({"source": file, "target": f"{match}.md"})
    
    # 生成HTML可视化文件
    html = f"""
    <!DOCTYPE html>
    <html>
    <body>
        <div id="graph"></div>
        <script src="https://cdn.jsdelivr.net/npm/force-graph"></script>
        <script>
            const data = {{
                nodes: { [{"id": node} for node in nodes] },
                links: { links }
            }};
            ForceGraph()
                .graphData(data)
                .nodeLabel('id')
                .linkDirectionalArrowLength(6)
                .linkDirectionalArrowRelPos(1)
                (#graph");
        </script>
    </body>
    </html>
    """
    
    with open("graph.html", "w") as f:
        f.write(html)

if __name__ == "__main__":
    generate_knowledge_graph()