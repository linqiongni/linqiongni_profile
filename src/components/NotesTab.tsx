import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NOTES_DATA } from '../data/portfolioData';
import { NotePost } from '../types';
import { MapPin, X, ChevronLeft, ChevronRight, Maximize2, Sparkles, Heart } from 'lucide-react';

export const NotesTab: React.FC = () => {
  const [activeTag, setActiveTag] = useState<string>('全部');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const allTags = ['全部', '#法务日常', '#咖啡', '#读书笔记', '#生活剪影'];

  const filteredNotes = activeTag === '全部'
    ? NOTES_DATA
    : NOTES_DATA.filter((n) => n.tags.includes(activeTag));

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredNotes.length) % filteredNotes.length);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredNotes.length);
    }
  };

  return (
    <div id="tab-notes-content" className="space-y-10 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8E8E6] dark:border-[#2C2C2E]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-[1px] w-4 bg-[#B89F6B]" />
            <span className="text-xs uppercase tracking-widest text-[#86868B]">
              Daily Notes & Moments / 日常随想
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            日常分享
          </h2>
          <p className="text-sm text-[#86868B] mt-2 max-w-2xl font-normal">
            咖啡、书页、维港天际线与工作琐记。在严谨的法律条文之外，记录生活中的微光与诗意。
          </p>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 text-xs">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
                activeTag === tag
                  ? 'border-[#B89F6B] bg-[#B89F6B]/15 text-[#B89F6B] font-medium'
                  : 'border-[#E8E8E6] dark:border-[#2C2C2E] text-[#86868B] hover:border-[#B89F6B] hover:text-[#B89F6B]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 2-3 Column Masonry/Grid of Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredNotes.map((note, index) => {
          const isLiked = likedPosts.includes(note.id);
          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleOpenLightbox(index)}
              className="group cursor-pointer rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/60 dark:bg-[#242426]/60 overflow-hidden hover:border-[#B89F6B] transition-all duration-400 hover:-translate-y-1 shadow-[0_4px_16px_rgba(0,0,0,0.02)]"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8E8E6] dark:bg-[#2C2C2E]">
                <img
                  src={note.image}
                  alt={note.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Expand overlay icon */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-2.5 rounded-full bg-white/80 dark:bg-[#1C1C1E]/80 text-[#1D1D1F] dark:text-[#F5F5F7] backdrop-blur-sm">
                    <Maximize2 size={16} />
                  </div>
                </div>

                {note.location && (
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] bg-black/50 text-white backdrop-blur-sm flex items-center gap-1">
                    <MapPin size={11} /> {note.location}
                  </div>
                )}
              </div>

              {/* Caption & Metadata */}
              <div className="p-5 space-y-4">
                <p className="text-[15px] leading-relaxed text-[#1D1D1F] dark:text-[#F5F5F7] font-normal">
                  {note.caption}
                </p>

                <div className="pt-3 border-t border-[#E8E8E6]/60 dark:border-[#2C2C2E]/60 flex items-center justify-between text-xs text-[#86868B]">
                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="hover:text-[#B89F6B] transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span>{note.date}</span>
                    <button
                      onClick={(e) => handleToggleLike(note.id, e)}
                      className={`p-1 rounded-full hover:text-red-500 transition-colors ${
                        isLiked ? 'text-red-500 fill-red-500' : 'text-[#86868B]'
                      }`}
                      title="心动"
                    >
                      <Heart size={14} className={isLiked ? 'fill-current' : ''} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredNotes[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseLightbox}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-[#B89F6B] transition-all z-10"
            >
              <X size={22} />
            </button>

            {/* Left Prev Arrow */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-[#B89F6B] transition-all z-10"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Lightbox Content Container */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              {/* Main Image */}
              <div className="md:w-3/5 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={filteredNotes[lightboxIndex].image}
                  alt={filteredNotes[lightboxIndex].caption}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] md:max-h-[80vh] w-full object-contain"
                />
              </div>

              {/* Detail Sidebar */}
              <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between text-white space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#8E8E93]">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#B89F6B]" />
                      {filteredNotes[lightboxIndex].location || '日常纪行'}
                    </span>
                    <span>{filteredNotes[lightboxIndex].date}</span>
                  </div>

                  <p className="text-base sm:text-lg font-light leading-relaxed text-[#F5F5F7]">
                    {filteredNotes[lightboxIndex].caption}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2C2C2E] flex items-center justify-between">
                  <div className="flex flex-wrap gap-2 text-xs text-[#B89F6B]">
                    {filteredNotes[lightboxIndex].tags.map((t, idx) => (
                      <span key={idx}>{t}</span>
                    ))}
                  </div>

                  <div className="text-xs text-[#8E8E93]">
                    {lightboxIndex + 1} / {filteredNotes.length}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Next Arrow */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-[#B89F6B] transition-all z-10"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
