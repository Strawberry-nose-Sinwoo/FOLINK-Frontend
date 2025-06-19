import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { postWithToken } from '@/api';
import { PdfUploadTypes } from '@/types';
import { Toastify } from '@/allFiles';

export const useFileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);

  const selectedFileName = fileInputRef.current?.files?.[0]?.name || '';

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('파일 입력 요소를 찾을 수 없습니다.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        return;
      }
      if (file.size > 10 * 1024 * 1024) { 
        Toastify({type: 'error', message: '파일 크기는 10MB를 초과할 수 없습니다.'});
        return;
      }
      setIsFileSelected(true);
    } else {
      setIsFileSelected(false);
    }
  };

  const resetFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      setIsFileSelected(false);
    }
  };

  const uploadMutation = useMutation<PdfUploadTypes, Error>({
    mutationFn: async () => {
      if (!fileInputRef.current?.files?.[0]) {
        throw new Error('업로드할 파일을 선택해주세요.');
      }

      const formData = new FormData();
      formData.append('file', fileInputRef.current.files[0]);

      const response = await postWithToken(
        null,
        '/question-sets/generate-by-pdf',
        formData
      );
      return response;
    },
    onSuccess: () => {
      resetFile(); 
    },
  });

  return {
    fileInputRef,
    isFileSelected,
    isUploading: uploadMutation.isPending,
    handleClick,
    handleFileChange,
    resetFile,
    uploadFile: uploadMutation.mutate,
    selectedFileName,
  };
};