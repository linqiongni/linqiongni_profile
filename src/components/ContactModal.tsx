import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { X, Mail, Copy, Check, QrCode, Send, MessageCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedWechat, setCopiedWechat] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleCopy = (text: string, type: 'email' | 'wechat') => {
    navigator.clipboard?.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedWechat(true);
      setTimeout(() => setCopiedWechat(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#FDFCF9] dark:bg-[#1C1C1E] border border-[#E8E8E6] dark:border-[#2C2C2E] rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-[#E8E8E6]/60 dark:hover:bg-[#2C2C2E]/60 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-[1px] w-4 bg-[#B89F6B]" />
                  <span className="text-xs uppercase tracking-widest text-[#86868B]">
                    Get In Touch / 业务与专业交流
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
                  联系法律顾问
                </h3>
                <p className="text-xs sm:text-sm text-[#86868B] mt-1.5 font-normal">
                  欢迎就商业合同审查、广告与新零售合规、争议解决策略或行业研究进行深入交流。
                </p>
              </div>

              {/* Direct Quick Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Card */}
                <div className="p-4 rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/60 dark:bg-[#242426]/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#B89F6B]/15 text-[#B89F6B] flex items-center justify-center">
                      <Mail size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] text-[#86868B]">工作电子邮箱</div>
                      <div className="text-xs font-mono text-[#1D1D1F] dark:text-[#F5F5F7]">
                        {PERSONAL_INFO.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(PERSONAL_INFO.email, 'email')}
                    className="p-2 text-[#86868B] hover:text-[#B89F6B] transition-colors"
                    title="复制邮箱"
                  >
                    {copiedEmail ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>

                {/* WeChat Card */}
                <div className="p-4 rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/60 dark:bg-[#242426]/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#B89F6B]/15 text-[#B89F6B] flex items-center justify-center">
                      <MessageCircle size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] text-[#86868B]">微信 (WeChat ID)</div>
                      <div className="text-xs font-mono text-[#1D1D1F] dark:text-[#F5F5F7]">
                        linqiongni_legal
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('linqiongni_legal', 'wechat')}
                    className="p-2 text-[#86868B] hover:text-[#B89F6B] transition-colors"
                    title="复制微信号"
                  >
                    {copiedWechat ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Message Form */}
              {formSubmitted ? (
                <div className="p-8 rounded-2xl bg-[#B89F6B]/10 border border-[#B89F6B]/30 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#B89F6B] text-white flex items-center justify-center">
                    <Check size={20} />
                  </div>
                  <div className="text-base font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                    留言已成功送达
                  </div>
                  <p className="text-xs text-[#86868B]">
                    感谢您的联系，我将在 24 小时内查阅并回复您的邮件。
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#86868B] mb-1.5">
                        您的姓名 / 机构名称
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="例如：李先生 / 某品牌业务部"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white dark:bg-[#242426] text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#B89F6B] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#86868B] mb-1.5">
                        回复邮箱
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@domain.com"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white dark:bg-[#242426] text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#B89F6B] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#86868B] mb-1.5">
                      咨询事项 / 合作议题
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="例如：商事合同审查咨询 / 供应链合规尽调探讨"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white dark:bg-[#242426] text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#B89F6B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#86868B] mb-1.5">
                      留言详情
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="请简要描述您的商业背景、法律痛点或沟通意向..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white dark:bg-[#242426] text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#B89F6B] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#1D1D1F] text-[#FDFCF9] dark:bg-[#F5F5F7] dark:text-[#1D1D1F] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#B89F6B] dark:hover:bg-[#B89F6B] dark:hover:text-white transition-all shadow-sm"
                  >
                    <Send size={15} />
                    <span>发送留言</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
