import { memo } from 'react';
import ReactPlayer from 'react-player/lazy';

export const VideoPreview = memo(function VideoPreview({ data }: { data: string }) {
  return (
    <div className="relative mt-2 flex flex-col overflow-hidden rounded-lg">
      <ReactPlayer url={data} controls={true} volume={0} className="aspect-video w-full" width="100%" height="100%" />
    </div>
  );
});