import { useRef, useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { postWithToken } from '@/api';
import { PdfUploadTypes } from '@/types';
import { Toastify } from '@/allFiles';
import { useDragAndDrop } from './useDragAndDrop';

interface FileUploadOptions {
  onUploadSuccess?: (response: PdfUploadTypes) => void;
}

export const useFileUpload = ({ onUploadSuccess }: FileUploadOptions = {}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState<number>(0); 

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
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted); 
            }
          },
        }
      );
      return response;
    },
    onError: (error) => {
      Toastify({ type: 'error', message: `업로드 실패: ${error.message}` });
      setProgress(0); 
    },
    onSuccess: () => {
      setProgress(100); 
    },
  });

  const validateAndSelectFile = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) {
        return;
      }

      if (file.type !== 'application/pdf') {
        Toastify({ type: 'error', message: 'PDF 파일만 업로드 가능합니다.' });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        Toastify({ type: 'error', message: '파일 크기는 10MB를 초과할 수 없습니다.' });
        return;
      }

      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }

      setProgress(0);
      uploadMutation.mutate(undefined, {
        onSuccess: (response) => {
          onUploadSuccess?.(response);
        },
      });
    },
    [uploadMutation, onUploadSuccess]
  );

  const { isDragging, handleDragEnter, handleDragOver, handleDragLeave, handleDrop } = useDragAndDrop({
    onFilesSelected: validateAndSelectFile,
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : [];
      validateAndSelectFile(files);
    },
    [validateAndSelectFile]
  );

  const handleClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('파일 입력 요소를 찾을 수 없습니다.');
    }
  }, []);

  return {
    fileInputRef,
    isDragging,
    isUploading: uploadMutation.isPending,
    progress, 
    handleClick,
    handleFileChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};