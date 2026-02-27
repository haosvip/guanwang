
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteConfig } from '../store/useSiteConfig';
import { TextInput, TextArea, SelectInput } from '../components/admin/FormFields';
import { ImageUpload } from '../components/admin/ImageUpload';
import { ArrayField } from '../components/admin/ArrayField';
import { 
  Layout, Monitor, Layers, DollarSign, PenTool, Image as ImageIcon, 
  Save, LogOut, Lock, Users, Key, Briefcase, UserPlus, Handshake, QrCode, Copy,
  Palette
} from 'lucide-react';
import { IconPicker } from '../components/admin/IconPicker';
import { SiteConfig, TypographySettings } from '../config/site.config';

// Options Constants
const fontSizeOptions = [
  { label: '默认 (Default)', value: '' },
  { label: '12px (XS)', value: '0.75rem' },
  { label: '14px (SM)', value: '0.875rem' },
  { label: '16px (Base)', value: '1rem' },
  { label: '18px (LG)', value: '1.125rem' },
  { label: '20px (XL)', value: '1.25rem' },
  { label: '24px (2XL)', value: '1.5rem' },
  { label: '30px (3XL)', value: '1.875rem' },
  { label: '36px (4XL)', value: '2.25rem' },
  { label: '48px (5XL)', value: '3rem' },
  { label: '60px (6XL)', value: '3.75rem' },
  { label: '72px (7XL)', value: '4.5rem' },
  { label: '96px (Huge)', value: '6rem' },
];

const fontWeightOptions = [
  { label: '默认 (Default)', value: '' },
  { label: 'Thin (100)', value: '100' },
  { label: 'Light (300)', value: '300' },
  { label: 'Regular (400)', value: '400' },
  { label: 'Medium (500)', value: '500' },
  { label: 'SemiBold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'ExtraBold (800)', value: '800' },
  { label: 'Black (900)', value: '900' },
];

const fontFamilyOptions = [
  { label: '默认 (Default)', value: '' },
  { label: 'System Default', value: 'system-ui, sans-serif' },
  { label: 'Inter (Sans)', value: '"Inter", sans-serif' },
  { label: 'Roboto (Sans)', value: '"Roboto", sans-serif' },
  { label: 'Open Sans (Sans)', value: '"Open Sans", sans-serif' },
  { label: 'Playfair Display (Serif)', value: '"Playfair Display", serif' },
  { label: 'Merriweather (Serif)', value: '"Merriweather", serif' },
  { label: 'Fira Code (Mono)', value: '"Fira Code", monospace' },
];

const lineHeightOptions = [
  { label: '默认 (Default)', value: '' },
  { label: '紧凑 (1)', value: '1' },
  { label: '标准 (1.5)', value: '1.5' },
  { label: '宽松 (1.75)', value: '1.75' },
  { label: '双倍 (2)', value: '2' },
];

const spacingOptions = [
  { label: '默认 (Default)', value: '' },
  { label: '小 (0.5rem)', value: '0.5rem' },
  { label: '中 (1rem)', value: '1rem' },
  { label: '大 (1.5rem)', value: '1.5rem' },
  { label: '特大 (2rem)', value: '2rem' },
];

// Helper component for typography settings
const TypographyControl: React.FC<{
  label: string;
  value?: TypographySettings;
  onChange: (val: TypographySettings) => void;
  showSpacing?: boolean;
}> = ({ label, value = {}, onChange, showSpacing = false }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="颜色"
          value={value.color || ''}
          onChange={(val) => onChange({ ...value, color: val })}
          type="color"
          className="h-full"
        />
        <SelectInput
          label="字号"
          value={value.fontSize || ''}
          onChange={(val) => onChange({ ...value, fontSize: val })}
          options={fontSizeOptions}
        />
        <SelectInput
          label="字重"
          value={value.fontWeight || ''}
          onChange={(val) => onChange({ ...value, fontWeight: val })}
          options={fontWeightOptions}
        />
        <SelectInput
          label="字体"
          value={value.fontFamily || ''}
          onChange={(val) => onChange({ ...value, fontFamily: val })}
          options={fontFamilyOptions}
        />
        {showSpacing && (
          <>
            <SelectInput
              label="行高"
              value={value.lineHeight || ''}
              onChange={(val) => onChange({ ...value, lineHeight: val })}
              options={lineHeightOptions}
            />
            <SelectInput
              label="段间距"
              value={value.marginBottom || ''}
              onChange={(val) => onChange({ ...value, marginBottom: val })}
              options={spacingOptions}
            />
          </>
        )}
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{
  title: string;
  visible?: boolean;
  onVisibilityChange: (visible: boolean) => void;
}> = ({ title, visible, onVisibilityChange }) => (
  <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <label className="flex items-center gap-3 cursor-pointer group">
      <span className="text-sm text-slate-400 group-hover:text-white transition-colors">板块显示</span>
      <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${visible ? 'bg-green-600' : 'bg-slate-600'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${visible ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
      <input 
        type="checkbox" 
        checked={!!visible} 
        onChange={(e) => onVisibilityChange(e.target.checked)} 
        className="hidden" 
      />
    </label>
  </div>
);

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { config, fetchConfig, updateConfig } = useSiteConfig();
  const [localConfig, setLocalConfig] = useState<SiteConfig | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
    }
    fetchConfig();
  }, [navigate, fetchConfig]);

  useEffect(() => {
    if (config) {
      setLocalConfig(JSON.parse(JSON.stringify(config)));
    }
  }, [config]);

  const handleSave = async () => {
    if (!localConfig) return;
    try {
      setSaveStatus('saving');
      await updateConfig(localConfig);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      alert('保存失败');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const updateSection = <K extends keyof SiteConfig>(section: K, data: Partial<SiteConfig[K]>) => {
    if (!localConfig) return;
    setLocalConfig({
      ...localConfig,
      [section]: { ...localConfig[section], ...data }
    });
  };

  const handleApplyProcessStylesToAll = () => {
    if (!localConfig || !localConfig.process.steps.length) return;
    const firstStep = localConfig.process.steps[0];
    const updatedSteps = localConfig.process.steps.map(step => ({
      ...step,
      titleStyle: firstStep.titleStyle,
      descStyle: firstStep.descStyle,
      itemStyle: firstStep.itemStyle,
      bulletColor: firstStep.bulletColor,
      numberPreset: (firstStep as any).numberPreset // Sync preset too
    }));
    updateSection('process', { steps: updatedSteps });
    alert('样式已统一应用到所有步骤！');
  };

  const applyThemePreset = (presetName: string) => {
    if (!localConfig) return;
    
    let newColors = { ...localConfig.theme.colors };
    
    switch(presetName) {
      case 'Deep Blue':
        newColors = { ...newColors, primary: '#165DFF', secondary: '#36BFFA', accent: '#FF9F1C', background: '#0F172A', surface: '#1E293B', text: '#F8FAFC' };
        break;
      case 'Dark Purple':
        newColors = { ...newColors, primary: '#8B5CF6', secondary: '#D946EF', accent: '#F472B6', background: '#110F24', surface: '#201A38', text: '#FAF5FF' };
        break;
      case 'Midnight':
        newColors = { ...newColors, primary: '#38BDF8', secondary: '#818CF8', accent: '#FCD34D', background: '#000000', surface: '#111111', text: '#F0F9FF' };
        break;
      case 'Forest':
        newColors = { ...newColors, primary: '#10B981', secondary: '#34D399', accent: '#F59E0B', background: '#064E3B', surface: '#065F46', text: '#ECFDF5' };
        break;
      case 'Ocean':
        newColors = { ...newColors, primary: '#0EA5E9', secondary: '#7DD3FC', accent: '#F43F5E', background: '#0C4A6E', surface: '#075985', text: '#F0F9FF' };
        break;
      case 'Sunset':
        newColors = { ...newColors, primary: '#F97316', secondary: '#FB923C', accent: '#6366F1', background: '#431407', surface: '#7C2D12', text: '#FFF7ED' };
        break;
    }
    
    updateSection('theme', { colors: newColors });
    alert(`已应用主题: ${presetName}`);
  };

  if (!localConfig) return <div className="p-8 text-white">正在加载配置...</div>;

  const tabs = [
    { id: 'general', label: '通用设置', icon: Layout },
    { id: 'hero', label: '首屏区域', icon: Monitor },
    { id: 'carousel', label: '案例轮播', icon: ImageIcon },
    { id: 'enterprise', label: '企业介绍', icon: Briefcase },
    { id: 'pricing', label: '价格方案', icon: DollarSign },
    { id: 'process', label: '服务流程', icon: Layers },
    { id: 'team', label: '核心团队', icon: UserPlus },
    { id: 'partners', label: '合作单位', icon: Handshake },
    { id: 'accessControl', label: '访问权限', icon: Users },
    { id: 'theme', label: '主题设置', icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-[#1a202c] flex text-slate-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#111827] text-white flex flex-col fixed h-full border-r border-slate-800 overflow-y-auto z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">管理后台</h1>
          <p className="text-xs text-slate-400 mt-1">网站配置中心</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} />
            退出登录
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 bg-[#1a202c]">
        <header className="flex justify-between items-center mb-8 bg-[#1f2937] p-4 rounded-xl shadow-lg border border-slate-700/50 sticky top-4 z-20 backdrop-blur-sm bg-opacity-95">
          <h2 className="text-2xl font-bold text-white capitalize flex items-center gap-2">
            {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { size: 24 })}
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-slate-300 hover:text-white font-medium text-sm transition-colors"
            >
              预览网站
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-all shadow-md ${
                saveStatus === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : saveStatus === 'error'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-900/30'
              }`}
            >
              <Save size={18} />
              {saveStatus === 'saving' ? '正在保存...' : saveStatus === 'success' ? '已保存!' : '保存更改'}
            </button>
          </div>
        </header>

        <div className="bg-[#1f2937] rounded-xl shadow-lg p-8 min-h-[calc(100vh-10rem)] border border-slate-700/50 text-slate-200">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-8 max-w-3xl">
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">导航栏设置</h3>
                <TextInput
                  label="Logo 文字"
                  value={localConfig.navigation.logo}
                  onChange={(val) => updateSection('navigation', { logo: val })}
                />
                <ImageUpload
                  label="Logo 图片 (可选)"
                  value={localConfig.navigation.logoImage || ''}
                  onChange={(url) => updateSection('navigation', { logoImage: url })}
                />
                <TextInput
                  label="行动号召按钮文字"
                  value={localConfig.navigation.cta.text}
                  onChange={(val) => updateSection('navigation', { 
                    cta: { ...localConfig.navigation.cta, text: val } 
                  })}
                />
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">底部联系信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="电子邮箱"
                    value={localConfig.footer.contact.email}
                    onChange={(val) => updateSection('footer', { 
                      contact: { ...localConfig.footer.contact, email: val } 
                    })}
                  />
                  <TextInput
                    label="联系电话"
                    value={localConfig.footer.contact.phone}
                    onChange={(val) => updateSection('footer', { 
                      contact: { ...localConfig.footer.contact, phone: val } 
                    })}
                  />
                </div>
                <TextArea
                  label="公司地址"
                  value={localConfig.footer.contact.address}
                  onChange={(val) => updateSection('footer', { 
                    contact: { ...localConfig.footer.contact, address: val } 
                  })}
                />
                <TextInput
                  label="版权信息"
                  value={localConfig.footer.copyright}
                  onChange={(val) => updateSection('footer', { copyright: val })}
                />
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">二维码设置</h3>
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={localConfig.footer.qrCode?.visible}
                        onChange={(e) => updateSection('footer', { 
                          qrCode: { ...localConfig.footer.qrCode!, visible: e.target.checked } 
                        })}
                        className="w-4 h-4 text-green-600 rounded bg-slate-700 border-slate-600 focus:ring-green-500"
                      />
                    <span className="text-white">显示二维码</span>
                  </label>
                </div>
                {localConfig.footer.qrCode?.visible && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <TextInput
                        label="二维码标题"
                        value={localConfig.footer.qrCode.label || ''}
                        onChange={(val) => updateSection('footer', { 
                          qrCode: { ...localConfig.footer.qrCode!, label: val } 
                        })}
                      />
                      <SelectInput
                        label="对齐方式"
                        value={localConfig.footer.qrCode.align || 'center'}
                        onChange={(val) => updateSection('footer', { 
                          qrCode: { ...localConfig.footer.qrCode!, align: val as 'left'|'center'|'right' } 
                        })}
                        options={[
                          { label: '左对齐', value: 'left' },
                          { label: '居中', value: 'center' },
                          { label: '右对齐', value: 'right' }
                        ]}
                      />
                    </div>
                    <TypographyControl 
                      label="标题样式"
                      value={localConfig.footer.qrCode.titleStyle}
                      onChange={(val) => updateSection('footer', { 
                        qrCode: { ...localConfig.footer.qrCode!, titleStyle: val } 
                      })}
                    />
                    <ImageUpload
                      label="二维码图片"
                      value={localConfig.footer.qrCode.image || ''}
                      onChange={(url) => updateSection('footer', { 
                        qrCode: { ...localConfig.footer.qrCode!, image: url } 
                      })}
                    />
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Hero Tab */}
          {activeTab === 'hero' && (
            <div className="space-y-8 max-w-6xl">
              <SectionHeader 
                title="首屏设置" 
                visible={localConfig.hero.visible} 
                onVisibilityChange={(v) => updateSection('hero', { visible: v })} 
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Content & Styles */}
                <div className="space-y-6">
                  <div className="bg-[#1f2937] p-6 rounded-xl border border-slate-700 shadow-sm">
                    <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <Layers size={18} className="text-blue-400" />
                      内容与全局样式
                    </h4>
                    
                    <div className="space-y-4">
                      <TextInput
                        label="主标题"
                        value={localConfig.hero.title}
                        onChange={(val) => updateSection('hero', { title: val })}
                      />
                      <TypographyControl 
                        label="主标题样式"
                        value={localConfig.hero.titleStyle}
                        onChange={(val) => updateSection('hero', { titleStyle: val })}
                      />
                      <TextArea
                        label="副标题"
                        value={localConfig.hero.subtitle}
                        onChange={(val) => updateSection('hero', { subtitle: val })}
                      />
                      <TypographyControl 
                        label="副标题样式"
                        value={localConfig.hero.subtitleStyle}
                        onChange={(val) => updateSection('hero', { subtitleStyle: val })}
                      />
                      
                      <div className="border-t border-slate-700 my-4 pt-4">
                         <h5 className="text-sm font-bold text-white mb-2">信任背书全局设置</h5>
                         <SelectInput
                            label="布局位置预设"
                            value={localConfig.hero.badgePosition || 'center'}
                            onChange={(val) => updateSection('hero', { badgePosition: val as any })}
                            options={[
                              { label: '居中对齐 (Center)', value: 'center' },
                              { label: '左对齐 (Left)', value: 'left' },
                              { label: '右对齐 (Right)', value: 'right' },
                              { label: '两列网格 (Grid-2)', value: 'grid-2' },
                              { label: '三列网格 (Grid-3)', value: 'grid-3' },
                              { label: '四列网格 (Grid-4)', value: 'grid-4' },
                            ]}
                          />
                         <div className="mt-2">
                           <TypographyControl 
                            label="文字样式 (统一)"
                            value={localConfig.hero.badgeStyle}
                            onChange={(val) => updateSection('hero', { badgeStyle: val })}
                          />
                         </div>
                         <div className="mt-4">
                            <TypographyControl 
                              label="数字样式 (统一)"
                              value={localConfig.hero.badgeNumberStyle}
                              onChange={(val) => updateSection('hero', { badgeNumberStyle: val })}
                            />
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1f2937] p-6 rounded-xl border border-slate-700 shadow-sm">
                    <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                       <ImageIcon size={18} className="text-blue-400" />
                       背景与遮罩
                    </h4>
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                        <SelectInput
                          label="背景类型"
                          value={localConfig.hero.backgroundType || 'image'}
                          onChange={(val) => updateSection('hero', { backgroundType: val as 'image' | 'video' })}
                          options={[
                            { label: '图片', value: 'image' },
                            { label: '视频 (MP4/WebM)', value: 'video' }
                          ]}
                        />
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">遮罩不透明度 (0-1)</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={localConfig.hero.overlayOpacity ?? 0.6}
                            onChange={(e) => updateSection('hero', { overlayOpacity: parseFloat(e.target.value) })}
                            className="w-full accent-blue-600"
                          />
                          <div className="text-right text-xs text-slate-400">{localConfig.hero.overlayOpacity ?? 0.6}</div>
                        </div>
                      </div>
                      <ImageUpload
                        label="封面素材 (图片或视频链接)"
                        value={localConfig.hero.coverImage || ''}
                        onChange={(url) => updateSection('hero', { coverImage: url })}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Data Lists */}
                <div className="space-y-6">
                   <div className="bg-[#1f2937] p-6 rounded-xl border border-slate-700 shadow-sm">
                    <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <Monitor size={18} className="text-blue-400" />
                      按钮设置
                    </h4>
                     <ArrayField
                      label=""
                      items={localConfig.hero.ctaButtons as any[]}
                      onChange={(items) => updateSection('hero', { ctaButtons: items })}
                      onAdd={() => ({ text: '新按钮', link: '#', primary: false, variant: 'primary', size: 'lg' })}
                      renderItem={(item: any, index, handleChange) => (
                        <div className="grid grid-cols-2 gap-4">
                          <TextInput
                            label="按钮文字"
                            value={item.text}
                            onChange={(val) => handleChange({ ...item, text: val })}
                          />
                          <TextInput
                            label="链接地址"
                            value={item.link}
                            onChange={(val) => handleChange({ ...item, link: val })}
                          />
                          <SelectInput
                            label="样式预设"
                            value={item.variant || 'primary'}
                            onChange={(val) => handleChange({ ...item, variant: val })}
                            options={[
                              { label: 'Primary (渐变主色)', value: 'primary' },
                              { label: 'Secondary (实色次要)', value: 'secondary' },
                              { label: 'Outline (描边)', value: 'outline' },
                              { label: 'Ghost (幽灵)', value: 'ghost' },
                              { label: 'Shine (流光特效)', value: 'shine' },
                              { label: 'Glass (毛玻璃)', value: 'glass' },
                            ]}
                          />
                          <SelectInput
                            label="尺寸"
                            value={item.size || 'md'}
                            onChange={(val) => handleChange({ ...item, size: val })}
                            options={[
                              { label: '小', value: 'sm' },
                              { label: '中', value: 'md' },
                              { label: '大', value: 'lg' },
                              { label: '特大', value: 'xl' },
                            ]}
                          />
                        </div>
                      )}
                    />
                   </div>

                   <div className="bg-[#1f2937] p-6 rounded-xl border border-slate-700 shadow-sm">
                    <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <Briefcase size={18} className="text-blue-400" />
                      信任背书数据
                    </h4>
                    <div className="mb-4">
                       <label className="flex items-center gap-2 cursor-pointer mb-2">
                          <input
                            type="checkbox"
                            checked={localConfig.hero.showSeparator}
                            onChange={(e) => updateSection('hero', { showSeparator: e.target.checked })}
                            className="w-4 h-4 text-green-600 rounded bg-slate-700 border-slate-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-slate-300">显示分割线</span>
                        </label>
                    </div>
                    <ArrayField
                      label=""
                      items={localConfig.hero.trustBadges}
                      onChange={(items) => updateSection('hero', { trustBadges: items })}
                      onAdd={() => ({ text: '描述文字', number: '100+', icon: '' })}
                      renderItem={(item, index, handleChange) => {
                        const badge = typeof item === 'string' ? { text: item, number: '', icon: '' } : item;
                        return (
                          <div className="grid grid-cols-12 gap-4 items-start">
                            <div className="col-span-3">
                               <TextInput
                                label="数字"
                                value={badge.number || ''}
                                onChange={(val) => handleChange({ ...badge, number: val })}
                                placeholder="2007"
                              />
                            </div>
                            <div className="col-span-4">
                               <TextInput
                                label="描述"
                                value={badge.text}
                                onChange={(val) => handleChange({ ...badge, text: val })}
                                placeholder="成立时间"
                              />
                            </div>
                            <div className="col-span-5">
                              <IconPicker
                                label="图标"
                                value={badge.icon || ''}
                                onChange={(val) => handleChange({ ...badge, icon: val })}
                              />
                            </div>
                          </div>
                        );
                      }}
                    />
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Carousel Tab */}
          {activeTab === 'carousel' && (
            <div className="space-y-8">
              <SectionHeader 
                title="案例轮播设置" 
                visible={localConfig.carousel.visible} 
                onVisibilityChange={(v) => updateSection('carousel', { visible: v })} 
              />
              <div className="grid grid-cols-2 gap-8">
                <section className="space-y-4">
                  <TextInput
                    label="模块标题"
                    value={localConfig.carousel.title}
                    onChange={(val) => updateSection('carousel', { title: val })}
                  />
                  <TextArea
                    label="模块副标题"
                    value={localConfig.carousel.subtitle}
                    onChange={(val) => updateSection('carousel', { subtitle: val })}
                  />
                </section>
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                     <TextInput
                      label="自动播放间隔"
                      value={String(localConfig.carousel.autoplayInterval)}
                      onChange={(val) => updateSection('carousel', { autoplayInterval: Number(val) || 3000 })}
                      className="flex-1"
                    />
                    <span className="text-slate-400 text-sm mt-6">毫秒</span>
                  </div>
                  
                  <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.carousel.showArrows}
                        onChange={(e) => updateSection('carousel', { showArrows: e.target.checked })}
                        className="w-4 h-4 text-green-600 rounded bg-slate-700 border-slate-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-slate-300">显示箭头</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.carousel.showIndicators}
                        onChange={(e) => updateSection('carousel', { showIndicators: e.target.checked })}
                        className="w-4 h-4 text-green-600 rounded bg-slate-700 border-slate-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-slate-300">显示指示器</span>
                    </label>
                  </div>
                </section>
              </div>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">分类管理</h3>
                <ArrayField
                  label=""
                  items={localConfig.carousel.categories}
                  onChange={(items) => updateSection('carousel', { categories: items })}
                  onAdd={() => ({ id: `cat-${Date.now()}`, name: '新分类' })}
                  renderItem={(item, index, handleChange) => (
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        label="分类ID"
                        value={item.id}
                        onChange={(val) => handleChange({ ...item, id: val })}
                      />
                      <TextInput
                        label="分类名称"
                        value={item.name}
                        onChange={(val) => handleChange({ ...item, name: val })}
                      />
                    </div>
                  )}
                />
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">案例图片</h3>
                <ArrayField
                  label=""
                  items={localConfig.carousel.images}
                  onChange={(items) => updateSection('carousel', { images: items })}
                  onAdd={() => ({ src: '', alt: '案例图片', title: '新案例', categoryId: localConfig.carousel.categories[0]?.id || '', isPrivate: false })}
                  renderItem={(item, index, handleChange) => (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <TextInput
                          label="标题"
                          value={item.title || ''}
                          onChange={(val) => handleChange({ ...item, title: val })}
                        />
                        <SelectInput
                          label="所属分类"
                          value={item.categoryId || ''}
                          onChange={(val) => handleChange({ ...item, categoryId: val })}
                          options={localConfig.carousel.categories.map(c => ({ label: c.name, value: c.id }))}
                        />
                        <div className="pt-6">
                           <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isPrivate}
                              onChange={(e) => handleChange({ ...item, isPrivate: e.target.checked })}
                              className="w-4 h-4 text-amber-500 rounded bg-slate-700 focus:ring-amber-500"
                            />
                            <span className="text-sm text-amber-400">仅VIP可见</span>
                          </label>
                        </div>
                      </div>
                      <ImageUpload
                        label="图片链接"
                        value={item.src}
                        onChange={(url) => handleChange({ ...item, src: url })}
                      />
                    </div>
                  )}
                />
              </section>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
             <div className="space-y-8 max-w-4xl">
              <SectionHeader 
                title="价格方案设置" 
                visible={localConfig.pricing.visible} 
                onVisibilityChange={(v) => updateSection('pricing', { visible: v })} 
              />
              <section className="space-y-4">
                <TextInput
                  label="模块标题"
                  value={localConfig.pricing.title}
                  onChange={(val) => updateSection('pricing', { title: val })}
                />
                <TypographyControl 
                  label="标题样式" 
                  value={localConfig.pricing.titleStyle} 
                  onChange={(val) => updateSection('pricing', { titleStyle: val })} 
                />
                <TextArea
                  label="模块副标题"
                  value={localConfig.pricing.subtitle}
                  onChange={(val) => updateSection('pricing', { subtitle: val })}
                />
                <TypographyControl 
                  label="副标题样式" 
                  value={localConfig.pricing.subtitleStyle} 
                  onChange={(val) => updateSection('pricing', { subtitleStyle: val })} 
                />
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">价格方案</h3>
                <ArrayField
                  label="方案列表"
                  items={localConfig.pricing.plans}
                  onChange={(items) => updateSection('pricing', { plans: items })}
                  onAdd={() => ({ name: '新方案', price: '¥0/页', description: '描述信息', highlight: false })}
                  renderItem={(item, index, handleChange) => (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
                      <div className="space-y-2">
                        <TextInput
                          label="方案名称"
                          value={item.name}
                          onChange={(val) => handleChange({ ...item, name: val })}
                        />
                        <TextInput
                          label="名称颜色"
                          value={item.nameColor || ''}
                          onChange={(val) => handleChange({ ...item, nameColor: val })}
                          type="color"
                        />
                      </div>
                      <div className="space-y-2">
                        <TextInput
                          label="价格"
                          value={item.price}
                          onChange={(val) => handleChange({ ...item, price: val })}
                        />
                        <TextInput
                          label="价格颜色"
                          value={item.priceColor || ''}
                          onChange={(val) => handleChange({ ...item, priceColor: val })}
                          type="color"
                        />
                      </div>
                      <TextInput
                        label="描述"
                        value={item.description}
                        onChange={(val) => handleChange({ ...item, description: val })}
                      />
                      <div className="pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.highlight}
                            onChange={(e) => handleChange({ ...item, highlight: e.target.checked })}
                            className="w-4 h-4 text-green-600 rounded bg-slate-700 border-slate-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-slate-300">高亮推荐</span>
                        </label>
                      </div>
                    </div>
                  )}
                />
              </section>
            </div>
          )}

          {/* Process Tab */}
          {activeTab === 'process' && (
            <div className="space-y-8 max-w-4xl">
               <SectionHeader 
                title="服务流程设置" 
                visible={localConfig.process.visible} 
                onVisibilityChange={(v) => updateSection('process', { visible: v })} 
              />
               <section className="space-y-4">
                <TextInput
                  label="模块标题"
                  value={localConfig.process.title}
                  onChange={(val) => updateSection('process', { title: val })}
                />
                <TypographyControl 
                  label="标题样式" 
                  value={localConfig.process.titleStyle} 
                  onChange={(val) => updateSection('process', { titleStyle: val })} 
                />
                <TextArea
                  label="模块副标题"
                  value={localConfig.process.subtitle}
                  onChange={(val) => updateSection('process', { subtitle: val })}
                />
                <TypographyControl 
                  label="副标题样式" 
                  value={localConfig.process.subtitleStyle} 
                  onChange={(val) => updateSection('process', { subtitleStyle: val })} 
                />
              </section>

              <section className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                   <h3 className="text-lg font-semibold text-white">流程步骤</h3>
                   <button 
                    onClick={handleApplyProcessStylesToAll}
                    className="text-sm flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                   >
                     <Copy size={14} /> 一键应用首个样式到所有
                   </button>
                </div>
                
                <ArrayField
                  label="步骤列表"
                  items={localConfig.process.steps as any[]}
                  onChange={(items) => updateSection('process', { steps: items })}
                  onAdd={() => ({ 
                    number: localConfig.process.steps.length + 1,
                    icon: 'MessageSquare',
                    title: '新步骤',
                    description: '步骤描述',
                    items: ['详情点 1']
                  })}
                  renderItem={(item: any, index, handleChange) => (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-4">
                            <TextInput
                              label="步骤标题"
                              value={item.title}
                              onChange={(val) => handleChange({ ...item, title: val })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                               <TextInput
                                label="步骤序号"
                                value={String(item.number)}
                                onChange={(val) => handleChange({ ...item, number: Number(val) })}
                              />
                               <SelectInput
                                label="序号样式预设"
                                value={(item as any).numberPreset || 'default'}
                                onChange={(val) => handleChange({ ...item, numberPreset: val } as any)}
                                options={[
                                  { label: '默认方框 (Default)', value: 'default' },
                                  { label: '实心圆形 (Circle)', value: 'circle' },
                                  { label: '空心描边 (Outline)', value: 'outline' },
                                  { label: '渐变数字 (Gradient)', value: 'gradient' },
                                  { label: '极简下划线 (Minimal)', value: 'minimal' },
                                  { label: '背景浮动 (Floating)', value: 'floating' },
                                ]}
                              />
                            </div>
                         </div>
                         <div>
                            <IconPicker
                              label="图标"
                              value={item.icon}
                              onChange={(val) => handleChange({ ...item, icon: val })}
                            />
                         </div>
                      </div>
                      <TypographyControl 
                        label="步骤标题样式" 
                        value={item.titleStyle} 
                        onChange={(val) => handleChange({ ...item, titleStyle: val })} 
                      />
                      <TextArea
                        label="步骤描述"
                        value={item.description}
                        onChange={(val) => handleChange({ ...item, description: val })}
                      />
                      <TypographyControl 
                        label="描述样式" 
                        value={item.descStyle} 
                        onChange={(val) => handleChange({ ...item, descStyle: val })} 
                      />
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">详情列表</label>
                        <div className="mb-2">
                           <TextInput
                            label="项目符号颜色"
                            value={item.bulletColor || ''}
                            onChange={(val) => handleChange({ ...item, bulletColor: val })}
                            type="color"
                          />
                        </div>
                        <TypographyControl 
                          label="详情文字样式" 
                          value={item.itemStyle} 
                          onChange={(val) => handleChange({ ...item, itemStyle: val })} 
                        />
                        <ArrayField
                          label=""
                          items={item.items}
                          onChange={(newItems) => handleChange({ ...item, items: newItems })}
                          onAdd={() => '新详情点'}
                          renderItem={(point, i, handlePointChange) => (
                            <TextInput
                              label=""
                              value={point}
                              onChange={handlePointChange}
                              className="mb-0"
                            />
                          )}
                        />
                      </div>
                    </div>
                  )}
                />
              </section>
            </div>
          )}

          {/* Enterprise Tab */}
          {activeTab === 'enterprise' && (
            <div className="space-y-8 max-w-4xl">
              <SectionHeader 
                title="企业介绍设置" 
                visible={localConfig.enterprise?.visible} 
                onVisibilityChange={(v) => updateSection('enterprise', { visible: v })} 
              />
              <section className="space-y-4">
                <TextInput
                  label="标题"
                  value={localConfig.enterprise?.title || ''}
                  onChange={(val) => updateSection('enterprise', { title: val })}
                />
                <TextInput
                  label="副标题"
                  value={localConfig.enterprise?.subtitle || ''}
                  onChange={(val) => updateSection('enterprise', { subtitle: val })}
                />
                <TextArea
                  label="介绍内容"
                  value={localConfig.enterprise?.content || ''}
                  onChange={(val) => updateSection('enterprise', { content: val })}
                />
                <TypographyControl 
                  label="内容样式 (含行高/段距)" 
                  value={localConfig.enterprise?.contentStyle} 
                  onChange={(val) => updateSection('enterprise', { contentStyle: val })} 
                  showSpacing={true}
                />
                <ImageUpload
                  label="地图/展示图片"
                  value={localConfig.enterprise?.mapImage || ''}
                  onChange={(url) => updateSection('enterprise', { mapImage: url })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="渐变开始色"
                    value={localConfig.enterprise?.gradientStart || ''}
                    onChange={(val) => updateSection('enterprise', { gradientStart: val })}
                    type="color"
                  />
                  <TextInput
                    label="渐变结束色"
                    value={localConfig.enterprise?.gradientEnd || ''}
                    onChange={(val) => updateSection('enterprise', { gradientEnd: val })}
                    type="color"
                  />
                </div>
              </section>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-8 max-w-4xl">
              <SectionHeader 
                title="核心团队设置" 
                visible={localConfig.team?.visible} 
                onVisibilityChange={(v) => updateSection('team', { visible: v })} 
              />
              <section className="space-y-4">
                <TextInput
                  label="模块标题"
                  value={localConfig.team?.title || ''}
                  onChange={(val) => updateSection('team', { title: val })}
                />
                <TextArea
                  label="模块副标题"
                  value={localConfig.team?.subtitle || ''}
                  onChange={(val) => updateSection('team', { subtitle: val })}
                />
              </section>
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">团队成员</h3>
                <ArrayField
                  label=""
                  items={localConfig.team?.members || []}
                  onChange={(items) => updateSection('team', { members: items })}
                  onAdd={() => ({ name: '新成员', role: '职位', image: '', endorsement: '个人背书' })}
                  renderItem={(item, index, handleChange) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <TextInput
                          label="姓名"
                          value={item.name}
                          onChange={(val) => handleChange({ ...item, name: val })}
                        />
                        <TextInput
                          label="职位"
                          value={item.role}
                          onChange={(val) => handleChange({ ...item, role: val })}
                        />
                        <TextInput
                          label="背书/简介"
                          value={item.endorsement || ''}
                          onChange={(val) => handleChange({ ...item, endorsement: val })}
                        />
                      </div>
                      <ImageUpload
                        label="头像"
                        value={item.image}
                        onChange={(url) => handleChange({ ...item, image: url })}
                      />
                    </div>
                  )}
                />
              </section>
            </div>
          )}

          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div className="space-y-8 max-w-4xl">
              <SectionHeader 
                title="合作单位设置" 
                visible={localConfig.partners?.visible} 
                onVisibilityChange={(v) => updateSection('partners', { visible: v })} 
              />
              <section className="space-y-4">
                <TextInput
                  label="模块标题"
                  value={localConfig.partners?.title || ''}
                  onChange={(val) => updateSection('partners', { title: val })}
                />
                <TextInput
                  label="滚动速度 (越大越快)"
                  value={String(localConfig.partners?.speed || 20)}
                  onChange={(val) => updateSection('partners', { speed: Number(val) || 20 })}
                />
                <TypographyControl 
                  label="文字样式"
                  value={localConfig.partners?.textStyle}
                  onChange={(val) => updateSection('partners', { textStyle: val })}
                />
              </section>
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">合作伙伴列表</h3>
                <ArrayField
                  label=""
                  items={localConfig.partners?.items || []}
                  onChange={(items) => updateSection('partners', { items: items })}
                  onAdd={() => ({ name: '新合作伙伴', logo: '' })}
                  renderItem={(item, index, handleChange) => (
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        label="名称"
                        value={item.name}
                        onChange={(val) => handleChange({ ...item, name: val })}
                      />
                      <TextInput
                        label="Logo URL (可选)"
                        value={item.logo || ''}
                        onChange={(val) => handleChange({ ...item, logo: val })}
                      />
                    </div>
                  )}
                />
              </section>
            </div>
          )}

          {/* Access Control Tab */}
          {activeTab === 'accessControl' && (
            <div className="space-y-8 max-w-4xl">
              <h3 className="text-xl font-bold text-white mb-4">访问权限控制</h3>
              <p className="text-slate-400 mb-6">设置不同的访问密码，控制用户可以查看的内容板块。</p>
              
              <ArrayField
                label="访问密码组"
                items={localConfig.accessControl?.codes || []}
                onChange={(items) => updateSection('accessControl', { codes: items })}
                onAdd={() => ({ 
                  code: 'newcode', 
                  name: '新用户组', 
                  permissions: { 
                    canViewPricing: true, 
                    canViewPrivateCases: false,
                    canViewTeam: true,
                    canViewEnterprise: true,
                    canDownloadSource: false
                  } 
                })}
                renderItem={(item, index, handleChange) => (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        label="访问密码"
                        value={item.code}
                        onChange={(val) => handleChange({ ...item, code: val })}
                      />
                      <TextInput
                        label="组名称"
                        value={item.name}
                        onChange={(val) => handleChange({ ...item, name: val })}
                      />
                    </div>
                    <TextInput
                      label="描述"
                      value={item.description || ''}
                      onChange={(val) => handleChange({ ...item, description: val })}
                    />
                    
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <label className="block text-sm font-medium text-white mb-3">权限配置</label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.permissions.canViewPricing}
                            onChange={(e) => handleChange({ 
                              ...item, 
                              permissions: { ...item.permissions, canViewPricing: e.target.checked } 
                            })}
                            className="w-5 h-5 text-green-600 rounded bg-slate-700 focus:ring-green-500"
                          />
                          <span className="text-sm text-slate-300">查看价格方案</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.permissions.canViewPrivateCases}
                            onChange={(e) => handleChange({ 
                              ...item, 
                              permissions: { ...item.permissions, canViewPrivateCases: e.target.checked } 
                            })}
                            className="w-5 h-5 text-amber-500 rounded bg-slate-700 focus:ring-amber-500"
                          />
                          <span className="text-sm text-amber-400">查看私密案例</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.permissions.canViewTeam}
                            onChange={(e) => handleChange({ 
                              ...item, 
                              permissions: { ...item.permissions, canViewTeam: e.target.checked } 
                            })}
                            className="w-5 h-5 text-green-600 rounded bg-slate-700 focus:ring-green-500"
                          />
                          <span className="text-sm text-slate-300">查看核心团队</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.permissions.canViewEnterprise}
                            onChange={(e) => handleChange({ 
                              ...item, 
                              permissions: { ...item.permissions, canViewEnterprise: e.target.checked } 
                            })}
                            className="w-5 h-5 text-green-600 rounded bg-slate-700 focus:ring-green-500"
                          />
                          <span className="text-sm text-slate-300">查看企业介绍</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.permissions.canDownloadSource}
                            onChange={(e) => handleChange({ 
                              ...item, 
                              permissions: { ...item.permissions, canDownloadSource: e.target.checked } 
                            })}
                            className="w-5 h-5 text-green-600 rounded bg-slate-700 focus:ring-green-500"
                          />
                          <span className="text-sm text-slate-300">下载源文件</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          )}
          
          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-8 max-w-4xl">
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">主题预设</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Deep Blue', 'Dark Purple', 'Midnight', 'Forest', 'Ocean', 'Sunset'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => applyThemePreset(preset)}
                      className="flex items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 hover:bg-slate-750 transition-all text-left group"
                    >
                      <Palette size={20} className="text-slate-400 group-hover:text-blue-400" />
                      <span className="font-medium text-slate-200">{preset}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">全局字体设置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">标题字体</label>
                    <SelectInput
                      label=""
                      value={localConfig.theme.fonts.heading}
                      onChange={(val) => updateSection('theme', { 
                        fonts: { ...localConfig.theme.fonts, heading: val } 
                      })}
                      options={fontFamilyOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">正文字体</label>
                    <SelectInput
                      label=""
                      value={localConfig.theme.fonts.body}
                      onChange={(val) => updateSection('theme', { 
                        fonts: { ...localConfig.theme.fonts, body: val } 
                      })}
                      options={fontFamilyOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">默认标题字号</label>
                    <SelectInput
                      label=""
                      value={localConfig.theme.fonts.headingSize || '1.5rem'}
                      onChange={(val) => updateSection('theme', { 
                        fonts: { ...localConfig.theme.fonts, headingSize: val } 
                      })}
                      options={fontSizeOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">默认正文字号</label>
                    <SelectInput
                      label=""
                      value={localConfig.theme.fonts.bodySize || '1rem'}
                      onChange={(val) => updateSection('theme', { 
                        fonts: { ...localConfig.theme.fonts, bodySize: val } 
                      })}
                      options={fontSizeOptions}
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">默认标题字重</label>
                    <SelectInput
                      label=""
                      value={localConfig.theme.fonts.headingWeight || '700'}
                      onChange={(val) => updateSection('theme', { 
                        fonts: { ...localConfig.theme.fonts, headingWeight: val } 
                      })}
                      options={fontWeightOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">默认正文字重</label>
                    <SelectInput
                      label=""
                      value={localConfig.theme.fonts.bodyWeight || '400'}
                      onChange={(val) => updateSection('theme', { 
                        fonts: { ...localConfig.theme.fonts, bodyWeight: val } 
                      })}
                      options={fontWeightOptions}
                    />
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
