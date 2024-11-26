import { z } from 'zod'

export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(5, { message: 'Tên người dùng quá ngắn.' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Mật khẩu của bạn quá ngắn, phải có ít nhất 8 ký tự.' })
    .trim(),
})

export type SignupFormState =
  | {
      errors?: {
        username?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined


export const CategoryFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Tên danh mục quá ngắn.' })
    .max(255, { message: 'Tên danh mục quá dài, tối đa 255 kí tự,.' })
    .trim(),
  
})

export type CategoryFormState =
  | {
      errors?: {
        name?: string[]
      }
      message?: string
    }
  | undefined