import * as yup from 'yup'
import MESSAGES from '../constants/messages'

function handleConfirmPasswordYup(field: string) {
  return yup
    .string()
    .required(MESSAGES.CONFIRM_PASSWORD_REQUIRED)
    .min(6, MESSAGES.CONFIRM_PASSWORD_MIN_LENGTH)
    .max(160, MESSAGES.CONFIRM_PASSWORD_MAX_LENGTH)
    .oneOf([yup.ref(field)], MESSAGES.CONFIRM_PASSWORD_NOT_MATCH)
}

export const loginSchema = yup.object({
  email: yup
    .string()
    .required(MESSAGES.EMAIL_REQUIRED)
    .min(5, MESSAGES.EMAIL_MIN_LENGTH)
    .max(160, MESSAGES.EMAIL_MAX_LENGTH)
    .email(MESSAGES.EMAIL_INVALID),
  password: yup
    .string()
    .required(MESSAGES.PASSWORD_REQUIRED)
    .min(6, MESSAGES.PASSWORD_MIN_LENGTH)
    .max(160, MESSAGES.PASSWORD_MAX_LENGTH)
})

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required(MESSAGES.PASSWORD_REQUIRED)
    .min(6, MESSAGES.PASSWORD_MIN_LENGTH)
    .max(160, MESSAGES.PASSWORD_MAX_LENGTH),
  confirm_password: handleConfirmPasswordYup('password')
})

export const changePasswordSchema = yup.object({
  old_password: yup
    .string()
    .required(MESSAGES.OLD_PASSWORD_REQUIRED)
    .min(6, MESSAGES.OLD_PASSWORD_MIN_LENGTH)
    .max(160, MESSAGES.OLD_PASSWORD_MAX_LENGTH),
  password: yup
    .string()
    .required(MESSAGES.PASSWORD_REQUIRED)
    .min(6, MESSAGES.PASSWORD_MIN_LENGTH)
    .max(160, MESSAGES.PASSWORD_MAX_LENGTH),
  confirm_password: handleConfirmPasswordYup('password')
})

export const createBlogSchema = yup.object({
  image: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .max(1000, MESSAGES.IMAGE_MAX_LENGTH),
  title: yup
    .string()
    .required(MESSAGES.TITLE_IS_REQUIRED)
    .min(1, MESSAGES.TITLE_MIN_LENGTH)
    .max(1000, MESSAGES.TITLE_MAX_LENGTH),
  slug: yup
    .string()
    .required(MESSAGES.SLUG_IS_REQUIRED)
    .min(1, MESSAGES.SLUG_MIN_LENGTH)
    .max(1000, MESSAGES.SLUG_MAX_LENGTH)
    .matches(/^[a-z0-9-]+$/, MESSAGES.SLUG_INVALID),
  description: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(1, MESSAGES.DESCRIPTION_MIN_LENGTH)
    .max(5000, MESSAGES.DESCRIPTION_MAX_LENGTH),
  content: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional(),
  seo_title: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(1, MESSAGES.SEO_TITLE_MIN_LENGTH)
    .max(1000, MESSAGES.SEO_TITLE_MAX_LENGTH),
  seo_keywords: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(1, MESSAGES.SEO_KEYWORDS_MIN_LENGTH)
    .max(2000, MESSAGES.SEO_KEYWORDS_MAX_LENGTH),
  seo_description: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(1, MESSAGES.SEO_DESCRIPTION_MIN_LENGTH)
    .max(5000, MESSAGES.SEO_DESCRIPTION_MAX_LENGTH)
})

export const createServiceSchema = yup.object({
  image: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .max(1000, MESSAGES.IMAGE_MAX_LENGTH),
  title: yup
    .string()
    .required(MESSAGES.TITLE_IS_REQUIRED)
    .min(1, MESSAGES.TITLE_MIN_LENGTH)
    .max(1000, MESSAGES.TITLE_MAX_LENGTH),
  description: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(1, MESSAGES.DESCRIPTION_MIN_LENGTH)
    .max(5000, MESSAGES.DESCRIPTION_MAX_LENGTH)
})

export const updateBlogSchema = yup.object({
  id: yup.string().required(),
  image: createBlogSchema.fields['image'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  slug: createBlogSchema.fields['slug'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  title: createBlogSchema.fields['title'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  description: createBlogSchema.fields['description'] as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ''
  >,
  content: createBlogSchema.fields['content'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  seo_title: createBlogSchema.fields['seo_title'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  seo_keywords: createBlogSchema.fields['seo_keywords'] as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ''
  >,
  seo_description: createBlogSchema.fields['seo_description'] as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ''
  >
})

export const updateServiceSchema = yup.object({
  id: yup.string().required(),
  title: createBlogSchema.fields['title'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  image: createBlogSchema.fields['image'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  description: createBlogSchema.fields['description'] as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ''
  >
})

export const userSchema = yup.object({
  name: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .max(160, MESSAGES.FULLNAME_MAX_LENGTH),
  avatar: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .max(1000, MESSAGES.AVATAR_MAX_LENGTH),
  phone: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .max(20, MESSAGES.PHONE_MAX_LENGTH),
  address: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .max(160, MESSAGES.ADDRESS_MAX_LENGTH),
  date_of_birth: yup
    .date()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .max(new Date(), MESSAGES.PLEASE_SELECT_A_DATE_IN_THE_PAST)
})

export const aboutSchema = yup.object({
  image: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .max(1000, MESSAGES.IMAGE_MAX_LENGTH),
  title: yup
    .string()
    .required(MESSAGES.TITLE_IS_REQUIRED)
    .min(1, MESSAGES.TITLE_MIN_LENGTH)
    .max(1000, MESSAGES.TITLE_MAX_LENGTH),
  description: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(1, MESSAGES.DESCRIPTION_MIN_LENGTH)
    .max(5000, MESSAGES.DESCRIPTION_MAX_LENGTH),
  seo_title: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(1, MESSAGES.SEO_TITLE_MIN_LENGTH)
    .max(1000, MESSAGES.SEO_TITLE_MAX_LENGTH),
  seo_keywords: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(1, MESSAGES.SEO_KEYWORDS_MIN_LENGTH)
    .max(2000, MESSAGES.SEO_KEYWORDS_MAX_LENGTH),
  seo_description: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(1, MESSAGES.SEO_DESCRIPTION_MIN_LENGTH)
    .max(5000, MESSAGES.SEO_DESCRIPTION_MAX_LENGTH)
})
