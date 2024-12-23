import { v4 as uuidv4 } from "uuid";

export function randomID(): string {
  return uuidv4();
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
