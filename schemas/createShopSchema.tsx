import { z } from "zod";
import { phoneRegex } from "./mallSchema";

const createFormSchema = (
  mallLevel: number,
  mallOpenTime: string,
  mallCloseTime: string
) => {
  return z.object({
    name: z.string().min(2, {
      message: "Shop name must be at least 2 characters.",
    }),

    description: z
      .string()
      .min(2, { message: "Description field is required!" }),
    phone: z
      .string()
      .min(10, { message: "Phone number contain at least 10 characters" })
      .regex(phoneRegex, { message: "Please enter valid Number!" }),
    image: z
      .array(
        z.union(
          [
            z.instanceof(File, { message: "Image must be a valid file" }),
            z.string().min(1, { message: "Image URL must not be empty" }),
          ],
          {
            required_error: "At least one image is required",
            invalid_type_error: "Must be a file or image URL",
          }
        )
      )
      .min(1, { message: "Atleast one image is necessary" })
      .default([]),
    level: z.coerce
      .number()
      .min(1, { message: "Level is required" })
      .refine((value) => value <= mallLevel, {
        message: `Level must be in range 0 - ${mallLevel}`,
      }),
    openTime: z
      .string()
      .min(1, { message: "Open time is required" })
      .refine(
        (time) => {
          if (!time || !mallOpenTime) return true;
          const [shopHour, shopMinute] = time.split(":").map(Number);
          const [mallHour, mallMinute] = mallOpenTime.split(":").map(Number);
          const shopTime = shopHour * 60 + shopMinute;
          const mallTime = mallHour * 60 + mallMinute;
          return shopTime >= mallTime;
        },
        {
          message: `Shop cannot open before mall opening time (${mallOpenTime})`,
        }
      ),
    closeTime: z
      .string()
      .min(1, { message: "Close time is required" })
      .refine(
        (time) => {
          if (!time || !mallCloseTime) return true;
          const [shopHour, shopMinute] = time.split(":").map(Number);
          const [mallHour, mallMinute] = mallCloseTime.split(":").map(Number);
          const shopTime = shopHour * 60 + shopMinute;
          const mallTime = mallHour * 60 + mallMinute;
          return shopTime <= mallTime;
        },
        {
          message: `Shop cannot close after mall closing time (${mallCloseTime})`,
        }
      ),
    category: z
      .string({
        required_error: "Please select a category",
      })
      .min(1, {
        message: "Category is required",
      }),
    subCategory: z.string().optional(),

    video: z
      .union([
        z.instanceof(File, { message: "Video must be a valid file" }).refine(
          (file) => {
            return file.size <= 10 * 1024 * 1024;
          },
          { message: "Video size must be less than or equal to 10mbps" }
        ),
        z.string(),
        z.undefined(),
        z.null(),
      ])
      .optional()
      .nullable(),
  });
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Shop name must be at least 2 characters.",
  }),

  description: z.string().min(2, { message: "Description field is required!" }),
  level: z.coerce.number().min(1, { message: "Level is required" }),
  phone: z
    .string()
    .min(10, { message: "Phone number contain at least 10 characters" })
    .regex(phoneRegex, { message: "Please enter valid Number!" }),
  image: z
    .array(
      z.union(
        [
          z.instanceof(File, { message: "Image must be a valid file" }),
          z.string().min(1, { message: "Image URL must not be empty" }),
        ],
        {
          required_error: "At least one image is required",
          invalid_type_error: "Must be a file or image URL",
        }
      )
    )
    .min(1, { message: "Atleast one image is necessary" })
    .default([]),
  openTime: z
    .string({ message: "Open Time is required" })
    .min(1, { message: "Open time is required" })
    .refine(
      (time) => {
        const openHour = parseInt(time.split(":")[0]);
        return openHour >= 6;
      },
      {
        message: "Open time must be before 6 AM",
      }
    ),
  closeTime: z
    .string({ message: "Close Time is required" })
    .min(1, { message: "Close time is required" })
    .refine(
      (time) => {
        const closeHour = parseInt(time.split(":")[0]);
        return closeHour <= 23;
      },
      {
        message: "Close time must be before 11 PM",
      }
    ),
  category: z
    .string({
      required_error: "Please select a category",
    })
    .min(1, {
      message: "Category is required",
    }),
  subCategory: z.string().optional(),

  video: z
    .union([
      z.instanceof(File, { message: "Video must be a valid file" }),
      z.string().min(1, { message: "Video URL must not be empty" }),
      z.undefined(),
    ])
    .optional()
    .nullable(),
});

export { createFormSchema, formSchema };
