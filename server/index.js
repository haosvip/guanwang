
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOAD_DIR = path.join(__dirname, '../public/uploads');
const STATIC_DIR = path.join(__dirname, '../dist');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Keep original extension
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());

// Serve static files from dist directory
app.use(express.static(STATIC_DIR));
app.use('/uploads', express.static(UPLOAD_DIR));

// Initialize data file if not exists
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    navigation: {
      logo: "高端PPT定制",
      links: [
        { text: "案例展示", href: "#cases" },
        { text: "服务价格", href: "#pricing" },
        { text: "服务流程", href: "#process" },
      ],
      cta: {
        text: "立即咨询",
        href: "#contact",
      },
    },
    hero: {
      title: "高端PPT定制服务",
      subtitle: "专业设计团队，为您打造卓越的演示体验，助力每一次关键演讲。",
      ctaButtons: [
        { text: "立即咨询", link: "#contact", primary: true },
        { text: "查看案例", link: "#cases", primary: false },
      ],
      trustBadges: ["1000+ 成功案例", "10年 专业经验", "98% 客户满意度", "500强 合作首选"],
    },
    carousel: {
      title: "精选案例展示",
      subtitle: "每一个作品都是精心打磨的艺术品",
      images: Array.from({ length: 19 }).map((_, i) => ({
        src: `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
          "Professional business presentation slide design, modern minimalist style, high quality, 4k"
        )}&image_size=landscape_16_9`,
        alt: `高端PPT案例展示 ${i + 1}`,
        title: `案例 ${i + 1}`,
      })),
      autoplayInterval: 3000,
      showIndicators: true,
      showArrows: true,
    },
    pricing: {
      title: "服务价格体系",
      subtitle: "透明合理的报价，满足不同层次的定制需求",
      plans: [
        { name: "基础版", price: "¥50/页", description: "适合内部汇报、简单演示" },
        { name: "标准版", price: "¥100/页", description: "适合对外发布、一般会议" },
        { name: "高级版", price: "¥200/页", description: "适合大型发布会、路演", highlight: true },
        { name: "VIP定制", price: "¥500/页", description: "顶级设计师一对一服务" },
      ],
      table: [
        { feature: "设计风格", basic: "现有模板", standard: "定制风格", premium: "创意设计", vip: "顶级创意" },
        { feature: "排版美化", basic: "基础排版", standard: "精细排版", premium: "高级排版", vip: "极致排版" },
        { feature: "图表制作", basic: "基础图表", standard: "美化图表", premium: "创意图表", vip: "数据可视化" },
        { feature: "动画效果", basic: "无", standard: "简单切换", premium: "页面动画", vip: "高级动效" },
        { feature: "修改次数", basic: "1次", standard: "3次", premium: "5次", vip: "不限次数" },
        { feature: "交付格式", basic: "PPTX", standard: "PPTX/PDF", premium: "全套源文件", vip: "全套+字体包" },
      ],
      notes: [
        {
          icon: "Clock",
          title: "加急服务",
          description: "如需24小时内交付，需加收50%加急费。",
        },
        {
          icon: "FileText",
          title: "文案策划",
          description: "如需提供文案梳理与策划服务，费用另计。",
        },
      ],
    },
    process: {
      title: "服务流程",
      subtitle: "标准化的服务流程，确保高品质交付",
      steps: [
        {
          number: 1,
          icon: "MessageSquare",
          title: "需求沟通",
          description: "了解您的演示场景、受众及具体需求",
          items: ["明确风格偏好", "确定页数规模", "商定交付时间"],
        },
        {
          number: 2,
          icon: "FileText",
          title: "资料梳理",
          description: "整理文案内容，构建演示逻辑框架",
          items: ["文案逻辑梳理", "框架结构搭建", "确定关键页面"],
        },
        {
          number: 3,
          icon: "Palette",
          title: "风格提案",
          description: "设计初稿样张，确定整体视觉风格",
          items: ["首页风格设计", "内页版式设计", "配色方案确认"],
        },
        {
          number: 4,
          icon: "Layout",
          title: "全案制作",
          description: "展开全部页面的设计制作与排版",
          items: ["内容可视化", "图表设计美化", "动画效果制作"],
        },
        {
          number: 5,
          icon: "CheckCircle",
          title: "审核修改",
          description: "提交初稿，根据反馈进行细节调整",
          items: ["细节完善", "内容校对", "效果优化"],
        },
        {
          number: 6,
          icon: "Send",
          title: "定稿交付",
          description: "确认最终效果，交付全套源文件",
          items: ["PPT源文件", "PDF预览版", "使用字体包"],
        },
      ],
    },
    footer: {
      copyright: "© 2024 高端PPT定制服务. All rights reserved.",
      links: [
        { text: "关于我们", href: "#" },
        { text: "服务条款", href: "#" },
        { text: "隐私政策", href: "#" },
      ],
      contact: {
        email: "contact@example.com",
        phone: "400-123-4567",
        address: "上海市浦东新区陆家嘴金融中心",
      },
    },
    theme: {
      colors: {
        primary: "#165DFF",
        secondary: "#36BFFA",
        accent: "#FF9F1C",
      },
    },
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Get config
app.get('/api/config', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read config' });
  }
});

// Update config
app.post('/api/config', (req, res) => {
  try {
    const newData = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
    res.json({ success: true, message: 'Config updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return relative path for frontend to use
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// Login (Mock)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Hardcoded credentials for demo purposes
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'mock-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Handle all other routes by serving index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
