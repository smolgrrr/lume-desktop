import { ImageWithFallback } from '@components/imageWithFallback';

import { createCacheProfile, getCacheProfile } from '@utils/storage';
import { truncate } from '@utils/truncate';

import { fetch } from '@tauri-apps/api/http';
import Avatar from 'boring-avatars';
import destr from 'destr';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useState } from 'react';

export const UserMini = memo(function UserMini({ pubkey }: { pubkey: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  const openChat = () => {
    router.push({
      pathname: '/chats/[id]',
      query: { id: pubkey },
    });
  };

  const fetchProfile = useCallback(async (id: string) => {
    const res = await fetch(`https://rbr.bio/${id}/metadata.json`, {
      method: 'GET',
      timeout: 30,
    });
    return res.data;
  }, []);

  useEffect(() => {
    getCacheProfile(pubkey).then((res) => {
      if (res) {
        setProfile(destr(res.metadata));
      } else {
        fetchProfile(pubkey)
          .then((res: any) => {
            setProfile(destr(res.content));
            createCacheProfile(pubkey, res.content);
          })
          .catch(console.error);
      }
    });
  }, [fetchProfile, pubkey]);

  return (
    <div
      onClick={() => openChat()}
      className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium hover:bg-zinc-900"
    >
      <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded">
        {profile?.picture ? (
          <ImageWithFallback src={profile.picture} alt={pubkey} fill={true} className="rounded object-cover" />
        ) : (
          <Avatar
            size={20}
            name={pubkey}
            variant="beam"
            square={true}
            colors={['#FEE2E2', '#FEF3C7', '#F59E0B', '#EC4899', '#D946EF', '#8B5CF6']}
          />
        )}
      </div>
      <div className="inline-flex w-full flex-1 flex-col overflow-hidden">
        <p className="truncate leading-tight text-zinc-300">
          {profile?.display_name || profile?.name || truncate(pubkey, 16, ' .... ')}
        </p>
      </div>
    </div>
  );
});
