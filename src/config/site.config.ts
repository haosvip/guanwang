
export interface TypographySettings {
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  marginBottom?: string;
}

export interface SiteConfig {
  navigation: {
    logo: string;
    logoImage?: string;
    links: Array<{
      text: string;
      href: string;
    }>;
    cta: {
      text: string;
      href: string;
    };
  };

  hero: {
    visible?: boolean;
    title: string;
    titleStyle?: TypographySettings;
    subtitle: string;
    subtitleStyle?: TypographySettings;
    coverImage?: string; 
    backgroundType?: 'image' | 'video';
    overlayOpacity?: number; 
    overlayColor?: string; 
    ctaButtons: Array<{
      text: string;
      link: string;
      primary: boolean;
      variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'shine' | 'glass';
      size?: 'sm' | 'md' | 'lg' | 'xl';
      color?: string; 
      textColor?: string;
    }>;
    trustBadges: Array<{ 
      text: string;
      number?: string; 
      icon?: string;
    }>;
    badgeLayout?: 'row' | 'column'; 
    badgePosition?: 'left' | 'center' | 'right' | 'grid-2' | 'grid-3' | 'grid-4'; // New: Position preset
    badgeStyle?: TypographySettings;
    badgeNumberStyle?: TypographySettings;
    showSeparator?: boolean;
  };

  carousel: {
    visible?: boolean;
    title: string;
    subtitle: string;
    categories: Array<{
      id: string;
      name: string;
    }>;
    images: Array<{
      src: string;
      alt: string;
      title?: string;
      categoryId?: string;
      isPrivate?: boolean; 
    }>;
    autoplayInterval: number;
    showIndicators: boolean;
    showArrows: boolean;
  };

  pricing: {
    visible?: boolean;
    title: string;
    subtitle: string;
    titleStyle?: TypographySettings;
    subtitleStyle?: TypographySettings;
    table: Array<{
      feature: string;
      basic: string | boolean;
      standard: string | boolean;
      premium: string | boolean;
      vip: string | boolean;
    }>;
    plans: Array<{
      name: string;
      price: string;
      description: string;
      highlight?: boolean;
      nameColor?: string;
      priceColor?: string;
    }>;
    notes: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };

  process: {
    visible?: boolean;
    title: string;
    subtitle: string;
    titleStyle?: TypographySettings;
    subtitleStyle?: TypographySettings;
    steps: Array<{
      number: number;
      icon: string;
      title: string;
      description: string;
      items: string[];
      titleStyle?: TypographySettings;
      descStyle?: TypographySettings;
      itemStyle?: TypographySettings;
      bulletColor?: string;
      numberPreset?: 'default' | 'circle' | 'outline' | 'gradient' | 'minimal' | 'floating';
    }>;
  };

  enterprise?: {
    visible: boolean;
    title: string;
    subtitle: string;
    mapImage?: string;
    gradientStart?: string;
    gradientEnd?: string;
    content?: string;
    contentStyle?: TypographySettings;
  };

  team?: {
    visible: boolean;
    title: string;
    subtitle: string;
    members: Array<{
      name: string;
      role: string;
      image: string;
      endorsement?: string;
    }>;
  };

  partners?: {
    visible: boolean;
    title: string;
    items: Array<{
      name: string;
      logo?: string;
    }>;
    textStyle?: TypographySettings;
    speed?: number;
  };

  footer: {
    copyright: string;
    links: Array<{
      text: string;
      href: string;
    }>;
    contact: {
      email: string;
      phone: string;
      address: string;
    };
    qrCode?: {
      visible: boolean;
      image: string;
      label?: string;
      align?: 'left' | 'center' | 'right'; // New
      titleStyle?: TypographySettings; // New
    };
  };

  accessControl: {
    codes: Array<{
      code: string;
      name: string;
      description?: string;
      permissions: {
        canViewPricing: boolean;
        canViewPrivateCases: boolean; 
        canViewTeam?: boolean;
        canViewEnterprise?: boolean;
        canDownloadSource?: boolean;
      };
    }>;
  };

  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string; 
      surface: string;
      text: string;
      textSecondary: string;
      textHeading?: string; 
      textMuted?: string;   
      textInverse?: string; 
    };
    fonts: {
      heading: string;
      body: string;
      headingSize?: string;
      headingWeight?: string;
      bodySize?: string;
      bodyWeight?: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
}

export const siteConfig: SiteConfig = {
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
    visible: true,
    title: "高端PPT定制服务",
    subtitle: "专业设计团队，为您打造卓越的演示体验，助力每一次关键演讲。",
    backgroundType: 'image',
    overlayOpacity: 0.6,
    ctaButtons: [
      { text: "立即咨询", link: "#contact", primary: true, variant: 'primary', size: 'lg' },
      { text: "查看案例", link: "#cases", primary: false, variant: 'outline', size: 'lg' },
    ],
    trustBadges: [
      { text: "成功案例", number: "1000+" },
      { text: "专业经验", number: "10年" },
      { text: "客户满意度", number: "98%" },
      { text: "合作首选", number: "500强" },
    ],
    badgeLayout: 'row',
    badgePosition: 'center',
  },

  carousel: {
    visible: true,
    title: "精选案例展示",
    subtitle: "每一个作品都是精心打磨的艺术品",
    categories: [
      { id: "business", name: "商业计划书" },
      { id: "report", name: "工作汇报" },
      { id: "launch", name: "发布会" },
    ],
    images: Array.from({ length: 19 }).map((_, i) => ({
      src: `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
        "Professional business presentation slide design, modern minimalist style, high quality, 4k"
      )}&image_size=landscape_16_9`,
      alt: `高端PPT案例展示 ${i + 1}`,
      title: `案例 ${i + 1}`,
      categoryId: i % 3 === 0 ? "business" : i % 3 === 1 ? "report" : "launch",
      isPrivate: i % 5 === 0, 
    })),
    autoplayInterval: 3000,
    showIndicators: true,
    showArrows: true,
  },

  pricing: {
    visible: true,
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
    visible: true,
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

  enterprise: {
    visible: true,
    title: "企业介绍",
    subtitle: "以专业铸就品质，以创新引领未来",
    gradientStart: "#1e293b",
    gradientEnd: "#0f172a",
    content: "我们是一家专注于高端PPT定制的设计机构，致力于为企业和个人提供卓越的演示解决方案。我们的团队由资深设计师、文案策划师和动画特效师组成，拥有丰富的行业经验和无限的创意激情。",
  },

  team: {
    visible: true,
    title: "核心团队",
    subtitle: "汇聚行业精英，打造顶尖设计力量",
    members: [
      { name: "Alex Chen", role: "设计总监", image: "", endorsement: "10年设计经验，红点奖得主" },
      { name: "Sarah Wu", role: "资深策划", image: "", endorsement: "前4A广告公司创意总监" },
      { name: "Mike Zhang", role: "动画专家", image: "", endorsement: "精通AE/C4D，视觉特效专家" },
    ],
  },

  partners: {
    visible: true,
    title: "合作伙伴",
    speed: 20,
    items: [
      { name: "阿里巴巴" },
      { name: "腾讯" },
      { name: "字节跳动" },
      { name: "华为" },
      { name: "京东" },
      { name: "美团" },
      { name: "百度" },
      { name: "网易" },
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
    qrCode: {
      visible: true,
      image: "",
      label: "扫码咨询客服",
      align: 'center'
    }
  },

  accessControl: {
    codes: [
      {
        code: "vip888",
        name: "尊享VIP",
        description: "最高权限，可查看所有内容",
        permissions: { canViewPricing: true, canViewPrivateCases: true, canViewTeam: true, canViewEnterprise: true, canDownloadSource: true },
      },
      {
        code: "guest",
        name: "普通访客",
        description: "默认访客权限",
        permissions: { canViewPricing: true, canViewPrivateCases: false, canViewTeam: true, canViewEnterprise: true, canDownloadSource: false },
      },
      {
        code: "preview",
        name: "预览用户",
        description: "仅供预览，限制部分功能",
        permissions: { canViewPricing: false, canViewPrivateCases: false, canViewTeam: false, canViewEnterprise: false, canDownloadSource: false },
      },
      {
        code: "partner",
        name: "合作伙伴",
        description: "合作伙伴权限",
        permissions: { canViewPricing: true, canViewPrivateCases: true, canViewTeam: true, canViewEnterprise: true, canDownloadSource: false },
      }
    ]
  },

  theme: {
    colors: {
      primary: "#165DFF",
      secondary: "#36BFFA",
      accent: "#FF9F1C",
      background: "#0F172A",
      surface: "#1E293B",
      text: "#F8FAFC",
      textSecondary: "#94A3B8",
      textHeading: "#FFFFFF",
      textMuted: "#64748B",
      textInverse: "#FFFFFF",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
      headingSize: "1rem",
      headingWeight: "700",
      bodySize: "1rem",
      bodyWeight: "400",
    },
    borderRadius: {
      sm: "0.25rem",
      md: "0.5rem",
      lg: "1rem",
      xl: "1.5rem",
    },
  },
};
