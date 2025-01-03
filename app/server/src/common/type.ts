import { mixed, object } from "yup";
import { FILE_SIZE, IMAGE_FORMATS } from "./common";

export type Paging = {
  page: number;
  limit: number;
};

export type Result<T> = {
  data: T;
  paging: {
    page: number;
    limit: number;
    total: number;
  };
};

export const fileSchema = object({
  file: mixed()
    .test("fileSize", "Maksimal ukuran file < 2MB", (value: any) => {
      return !value || value.size <= FILE_SIZE;
    })
    .test("fileFormat", "Format file tidak didukung", (value: any) => {
      return !value || IMAGE_FORMATS.includes(value.type);
    }),
});
