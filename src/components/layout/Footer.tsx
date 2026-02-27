
import React from "react";
import { useSiteConfig } from "../../store/useSiteConfig";
import { Container } from "../ui/Container";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const { config } = useSiteConfig();
  const { footer, navigation } = config;

  const getAlignClass = (align?: string) => {
    switch(align) {
      case 'center': return 'items-center text-center';
      case 'right': return 'items-end text-right';
      default: return 'items-start text-left';
    }
  };

  return (
    <footer id="contact" className="bg-[var(--color-surface)] text-[var(--color-text-secondary)] py-16 border-t border-white/5">
      <Container>
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4">{navigation.logo}</h3>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              专注为高端客户提供卓越的演示定制服务，助力每一次关键表达。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[var(--color-text)] font-bold mb-4">快速链接</h4>
            <ul className="space-y-2">
              {navigation.links.map((link) => (
                <li key={link.text}>
                  <a href={link.href} className="hover:text-[var(--color-primary)] transition-colors text-sm">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="text-[var(--color-text)] font-bold mb-4">联系我们</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[var(--color-primary)]" />
                <a href={`mailto:${footer.contact.email}`} className="hover:text-[var(--color-text)] transition-colors">
                  {footer.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[var(--color-primary)]" />
                <a href={`tel:${footer.contact.phone}`} className="hover:text-[var(--color-text)] transition-colors">
                  {footer.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[var(--color-primary)] mt-1" />
                <span>{footer.contact.address}</span>
              </li>
            </ul>
          </div>
          
          {/* QR Code (Optional) */}
          {footer.qrCode && footer.qrCode.visible && (
            <div className={`flex flex-col ${getAlignClass(footer.qrCode.align)}`}>
               <h4 
                 className="text-[var(--color-text)] font-bold mb-4"
                 style={{
                   fontSize: footer.qrCode.titleStyle?.fontSize,
                   fontWeight: footer.qrCode.titleStyle?.fontWeight,
                   color: footer.qrCode.titleStyle?.color
                 }}
               >
                 {footer.qrCode.label || "关注我们"}
               </h4>
               <div className="bg-white p-2 rounded-lg shadow-sm">
                 {footer.qrCode.image ? (
                   <img src={footer.qrCode.image} alt="QR Code" className="w-24 h-24 object-contain" />
                 ) : (
                   <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-500 text-center p-1">
                     暂无二维码
                   </div>
                 )}
               </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--color-text-secondary)]">{footer.copyright}</p>
          <div className="flex gap-6">
            {footer.links.map((link) => (
              <a
                key={link.text}
                href={link.href}
                className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};
