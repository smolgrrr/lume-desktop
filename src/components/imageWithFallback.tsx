import Avatar from 'boring-avatars';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';

export const ImageWithFallback = memo(function ImageWithFallback({
  src,
  alt,
  fill,
  className,
}: {
  src: string;
  alt: string;
  fill: boolean;
  className: string;
}) {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <>
      {error ? (
        <Avatar
          size={44}
          name={alt}
          variant="beam"
          square={true}
          colors={['#FEE2E2', '#FEF3C7', '#F59E0B', '#EC4899', '#D946EF', '#8B5CF6']}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          className={className}
          onError={setError}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
          priority
        />
      )}
    </>
  );
});
