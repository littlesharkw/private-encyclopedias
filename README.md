# 私人百科图鉴

按领域分类的百科图鉴系列。网站版：https://littlesharkw.github.io/private-encyclopedias/

## 结构

```
docs/
├── index.md            首页总览表
├── tags.md             标签索引
├── nature/             🌿 自然
├── body/               🫀 身体
├── mind/               🧠 心灵
└── world/              ✈️ 世界（洲 › 国家 › 省／大区 › 城市，按需要分层）
    └── <图鉴>/
        ├── index.md          图鉴简介（版本、状态、免责声明）
        ├── master-index.md   Master Index（唯一正本）
        └── pages/ch01/001.md 正文，文件名 = 页码
templates/              新图鉴、新页面模板
```

## 首次上线（新仓库）

1. 在 GitHub 新建 **public** 仓库，名称必须是 `private-encyclopedias`，不要勾选 Add a README
2. 在仓库首页点 Add file → Upload files，把本文件夹里的**全部内容**拖进去（包括隐藏的 `.github` 文件夹），点 Commit changes
3. 打开 **Actions**，等待「部署网站」出现绿色勾
4. 进入 **Settings → Pages**，Source 选 `Deploy from a branch`，分支选 `gh-pages`、`/ (root)`，点 Save
5. 新建 Release：tag 填 `pdf-library`，上传下方列表中的 13 个 PDF，点 Publish release
6. 一两分钟后打开 https://littlesharkw.github.io/private-encyclopedias/

之后每次推送到 `main`，网站都会自动更新。

### PDF 文件名（必须完全一致，全部小写并以 .pdf 结尾）

arles.pdf、avignon.pdf、basel.pdf、cassis.pdf、eze.pdf、iceland.pdf、lyon.pdf、marseille.pdf、menton.pdf、monaco.pdf、nice.pdf、villefranche-sur-mer.pdf、woodstock.pdf

## 新增一本图鉴

1. 在对应领域下新建文件夹，例如 `docs/nature/mushrooms/`
2. 复制 `templates/new-book-index.md` 作为 `index.md`，再新建 `master-index.md`
3. 在 `mkdocs.yml` 的 `nav` 中添加一行
4. 在 `docs/index.md` 的总览表中添加一行

## 新增一个领域

在 `docs/` 下新建文件夹（英文名），再在 `mkdocs.yml` 的 `nav` 中添加一个顶层分组（emoji + 中文名）。

## PDF

所有 PDF 放在同一个 Release（tag：`pdf-library`），文件名用英文小写，例如 `nice.pdf`。
页面里的下载链接格式：`https://github.com/littlesharkw/private-encyclopedias/releases/download/pdf-library/nice.pdf`
更新 PDF：在 Release 里删掉旧文件，再上传同名新文件，链接不变。
新增 PDF 后，需要同时更新：城市页、`docs/library.md`、首页书架（`docs/index.md` 中 `shelf:start` 与 `shelf:end` 之间），并把封面放进 `docs/images/covers/`（文件名与 PDF 相同，扩展名 .webp）。
首页书架的「最新上架」和 NEW 标记会自动读取 Release 的更新时间，无需手动修改。

## 常用标签

写新页面时从这里挑，保持写法一致：

- 系列：法国城市百科、瑞士城市百科、北欧旅行百科、加拿大城市百科
- 洲：亚洲、欧洲、北美洲
- 主题：海景、老城、中世纪、罗马遗迹、历史、城市史、建筑、教堂、世界遗产、艺术、博物馆、电影、丝绸、王室、赛车、香水、移民文化、美食、市集、葡萄酒、花园、自然、地质、徒步、自驾、摄影
- 其他：旅行、心理、PDF下载

## 版本管理

Master Index 定稿时打上 tag，例如 `sleep-v1.0`。旧版本保留在 Git 历史中，不要在仓库里保留作废文件。

## 授权

内容采用 [CC BY-NC 4.0](LICENSE) 授权。本系列为个人学习整理，不构成任何专业意见。
