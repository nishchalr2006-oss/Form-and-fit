import React from 'react';

interface ImagePlaceholderProps {
  title?: string;
  className?: string;
  aspectRatio?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  title = 'Form & Fit',
  className = '',
  aspectRatio = 'aspect-[3/4]',
}) => {
  return (
    <div
      className={`bg-[#E8E8E8] text-[#111111] flex flex-col items-center justify-center p-6 text-center select-none ${aspectRatio} ${className}`}
    >
      <div className="border border-[#111111]/20 p-4 w-full max-w-[180px] flex flex-col items-center justify-center bg-[#F7F6F2]">
        <span className="font-space font-bold tracking-widest text-xs uppercase text-[#111111]/60 mb-1">
          FORM &amp; FIT
        </span>
        <span className="font-space text-sm font-semibold truncate max-w-full text-[#111111]">
          {title}
        </span>
        <span className="text-[10px] text-[#111111]/40 uppercase tracking-wider mt-2">
          Image Coming Soon
        </span>
      </div>
    </div>
  );
};
