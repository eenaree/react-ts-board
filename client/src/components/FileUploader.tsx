import * as React from 'react';
import { useState } from 'react';
import { css } from '@emotion/react';

interface FileData {
  url: string;
  filename: string;
}

const validateFileType = (file: File): boolean => {
  const allowedFileTypes: string[] = ['image/png', 'image/jpeg', 'image/gif'];
  return allowedFileTypes.includes(file.type);
};

const readFile = (file: File): Promise<FileData> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        const fileData: FileData = {
          url: fileReader.result,
          filename: file.name,
        };
        resolve(fileData);
      }
    };
    fileReader.onerror = reject;
  });
};

const FileUploader = ({
  setFiles,
}: {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) => {
  const [previewImages, setPreviewImages] = useState<
    React.ReactElement[] | null
  >(null);

  const onChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray: File[] = Array.from(e.target.files);
    if (!filesArray.length) {
      setPreviewImages(null);
      return;
    }

    let allowedFileLength = 0;
    filesArray.map(file => {
      if (validateFileType(file)) {
        allowedFileLength += 1;
      }
    });

    if (filesArray.length != allowedFileLength) {
      return alert('허용되지 않은 파일 확장자가 존재합니다.');
    }
    readAndPreviewFiles(filesArray);
    setFiles(filesArray);
  };

  const readAndPreviewFiles = (files: File[]) => {
    const readAllFiles: Promise<FileData>[] = files.map(file => readFile(file));
    const previewFiles = (files: FileData[]) => {
      const imageArray: React.ReactElement[] = [];
      files.map((file, index) => {
        const imageElement: React.ReactElement = (
          <div
            css={css`
              border-top: 1px solid #eee;
              height: 50px;
            `}
            key={index + file.filename}
          >
            <img
              key={index}
              src={file.url}
              alt="file preview"
              height="100%"
              width="100px"
              css={css`
                margin-right: 10px;
              `}
            />
            <span>{file.filename}</span>
          </div>
        );
        imageArray.push(imageElement);
      });
      setPreviewImages(imageArray);
    };

    Promise.all(readAllFiles)
      .then((results: FileData[]) => {
        previewFiles(results);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  };

  return (
    <div
      css={css`
        margin: 20px 0;
      `}
    >
      <p>
        <label
          htmlFor="files"
          css={css`
            cursor: pointer;
            border: 1px solid #ddd;
            padding: 7px 15px;
            &:hover {
              border: 1px solid #1890ff;
              color: #1890ff;
            }
            transition: 0.5s;
          `}
        >
          파일 첨부
        </label>
        <input
          type="file"
          name="files"
          id="files"
          multiple
          onChange={onChangeFiles}
          accept=".png, .jpg, .jpeg, .gif"
          css={css`
            opacity: 0;
          `}
        />
      </p>
      {previewImages ? (
        <div>{previewImages}</div>
      ) : (
        <div>선택한 파일이 없습니다.</div>
      )}
    </div>
  );
};

export default FileUploader;
