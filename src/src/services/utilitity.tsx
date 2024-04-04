import { useEffect } from "react";

const apiUrl = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL
  : import.meta.env.VITE_API_URL_PRODUCTION;

const basename = "/STSBidding/frontend";

const convertType = (data: string | number | undefined | null) => {
  const val = typeof data === "string" ? parseInt(data) : data;
  return val;
};

const datetimeFormatter = (date: string | Date) => {
  const datetimeFormat = new Date(date);
  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "ม.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  return `${datetimeFormat.getDate()} ${months[datetimeFormat.getMonth()]} ${
    datetimeFormat.getFullYear() + 543
  }`;
};

const dateWithTimeFormatter = (date: string | Date) => {
  const datetimeFormat = new Date(date);
  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "ม.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  return `${datetimeFormat.getDate()} ${months[datetimeFormat.getMonth()]} ${
    datetimeFormat.getFullYear() + 543
  } / ${datetimeFormat
    .getHours()
    .toLocaleString(undefined, { minimumIntegerDigits: 2 })} : ${datetimeFormat
    .getMinutes()
    .toLocaleString(undefined, { minimumIntegerDigits: 2 })}`;
};

const dateFormatter = (date: string | Date) => {
  let datetimeFormat;
  if (typeof date === "string") {
    const [day, month, year] = date.split("/");
    datetimeFormat = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    datetimeFormat = new Date(date);
  }

  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  return `${datetimeFormat.getDate()} ${months[datetimeFormat.getMonth()]} ${
    datetimeFormat.getFullYear() + 543
  }`;
};

const TimeFormatter = (time: string) => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const datetimeFormat = new Date(2000, 0, 1, hours, minutes, seconds);
  return `
  ${datetimeFormat
    .getHours()
    .toLocaleString(undefined, { minimumIntegerDigits: 2 })} : ${datetimeFormat
    .getMinutes()
    .toLocaleString(undefined, { minimumIntegerDigits: 2 })}`;
};

const showFileOnClick = (filePath: string) => {
  window.open(
    (import.meta.env.DEV
      ? import.meta.env.VITE_URL_DEV
      : import.meta.env.VITE_URL_PRODUCTION) + filePath
  );
};

const openUploadFile = (files: File) => {
  const file = files;
  if (file !== undefined) {
    const blobData = new Blob([file], { type: file.type });
    const blobUrl = URL.createObjectURL(blobData);
    window.open(blobUrl);
    URL.revokeObjectURL(blobUrl);
  }
};

const useAutoSizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    if (textAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = "200px";
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);
};

export {
  apiUrl,
  convertType,
  basename,
  datetimeFormatter,
  showFileOnClick,
  openUploadFile,
  dateWithTimeFormatter,
  useAutoSizeTextArea,
  TimeFormatter,
  dateFormatter
};
