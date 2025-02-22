import { memo } from 'react';
import ReactPlayer from 'react-player/lazy';

export const VideoPreview = memo(function VideoPreview({ url }: { url: string }) {
  return (
    <div onClick={(e) => e.stopPropagation()} className="relative mt-3 flex flex-col overflow-hidden rounded-lg">
      <ReactPlayer
        url={url}
        controls={true}
        volume={0}
        className="aspect-video w-full xl:w-2/3"
        width="100%"
        height="100%"
      />
    </div>
  );
});
