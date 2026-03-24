import { useEffect } from 'react';

function useDocumentTitle(_title: string) {
  useEffect(() => {
    document.title = 'Nova';
  }, []);
}

export default useDocumentTitle;
