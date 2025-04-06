import { useState, useCallback } from 'react';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  const updateIsDesktop = useCallback(() => {
    setIsDesktop(Dimensions.get('window').width > 800);
  }, []);

  useFocusEffect(
    useCallback(() => {
      updateIsDesktop();
      const dimensions = Dimensions.addEventListener('change', updateIsDesktop);

      return () => {
        dimensions.remove();
      };
    }, [updateIsDesktop])
  );

  return {isDesktop: isDesktop, isMobile: !isDesktop};
};

export default useIsDesktop;
