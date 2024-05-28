import { useState, createContext, useEffect } from 'react';

import { getMe } from '../services/me';
import { Me, UseMe } from '../../types/types';

export const useMe = () => {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    getMe().then((me: Me) => {
      setMe(me);
    });
  }, []);

  return { me, setMe };
};

export const MeContext = createContext({} as UseMe);
