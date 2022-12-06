import React from "react";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import type { FieldProps } from "../..";
import "./FileField.css";

interface ExtendedUploadFile extends UploadFile {
  mimeType?: string;
  contentId?: string;
}

interface FileInfo {
  filename: string;
  "content-url": string;
  "mime-type"?: string;
  "content-id"?: string;
}

const FileField = (props: FieldProps) => {
  const multiple = props.options.multiple || false;
  const uploadUrl = props.options["upload-url"];
  const value = props.value || [];

  const values: FileInfo[] = Array.isArray(value) ? value : [value];

  const initialFileList = [];
  let uid = -1;
  for (const fileInfo of values) {
    const uploadFile: ExtendedUploadFile = {
      name: fileInfo.filename,
      url: fileInfo["content-url"],
      status: "done",
      uid: uid.toString(),
      mimeType: fileInfo["mime-type"],
      contentId: fileInfo["content-id"],
    };
    initialFileList.push(uploadFile);
    uid--;
  }

  const handleChange = ({
    fileList: newFileList,
    file: currentFile,
  }: {
    fileList: UploadFile[];
    file: UploadFile;
  }) => {
    if (currentFile.status === "done" || currentFile.status === "removed") {
      const values: FileInfo[] = [];
      for (const uploadFile of newFileList as ExtendedUploadFile[]) {
        if (uploadFile.status === "done") {
          let fileInfo: FileInfo = {
            filename: uploadFile.name,
            "content-url": uploadFile.url || "",
          };
          if (uploadFile.contentId)
            fileInfo["content-id"] = uploadFile.contentId;
          if (uploadFile.mimeType) fileInfo["mime-type"] = uploadFile.mimeType;

          values.push(fileInfo);
        }
      }

      props.onChange(multiple ? values : values[0]);
      props.onBlur(multiple ? values : values[0]);

      if (currentFile.status === "done")
        message.success(`${currentFile.name} file uploaded successfully`);
      if (currentFile.status === "removed")
        message.info(`${currentFile.name} file removed successfully`);
    } else if (currentFile.status === "error") {
      message.error(
        `${currentFile.error || `${currentFile.name} file upload failed`}`
      );
    }
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const setDataUrlAsUrl = async ({
    onError = (err: string) => {},
    onSuccess = (ret: string) => {},
    file,
  }) => {
    try {
      file.url = await getBase64(file as RcFile);
      if (!file.url) throw new Error();
      const dataParts = file.url.match(
        /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
      );

      if (dataParts && dataParts.length > 1) {
        file.mimeType = dataParts[1];
      }
      onSuccess("ok");
    } catch (error) {
      onError(`${file.name} file convert to base64 failed`);
    }
  };

  const uploadProps: UploadProps = {
    defaultFileList: initialFileList,
    multiple: multiple,
    showUploadList: {
      showDownloadIcon: true,
      downloadIcon: <DownloadOutlined />,
    },
    onChange: handleChange,
  };

  if (uploadUrl) {
    uploadProps.action = uploadUrl;
  } else {
    uploadProps.customRequest = setDataUrlAsUrl;
  }

  if (!multiple) {
    uploadProps.maxCount = 1;
  }

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
};

export default FileField;
