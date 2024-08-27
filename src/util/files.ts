import { env } from "@/env";

export function getImgUrl(fileKey: string){
    return `${env.NEXT_PUBLIC_R2_BUCKET_URL}/${fileKey}`
  }
  