import { useRef, useState } from 'react';
import { Toastify } from '@/allFiles';

export const useFileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      Toastify({
        type: 'error',
        message: '파일 입력 요소를 찾을 수 없습니다.',
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsFileSelected(true);
      Toastify({
        type: 'success',
        message: `${file.name} 파일이 선택되었습니다.`,
      });
    } else {
      setIsFileSelected(false);
      Toastify({
        type: 'error',
        message: '파일을 선택하지 않았습니다.',
      });
    }
  };

  const resetFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      setIsFileSelected(false);
      Toastify({
        type: 'success',
        message: '파일 선택이 초기화되었습니다.',
      });
    }
  };

  return {
    fileInputRef,
    isFileSelected,
    handleClick,
    handleFileChange,
    resetFile,
  };
};