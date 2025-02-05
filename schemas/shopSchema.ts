

import { z } from "zod";




const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);


const shopSchema = z.array(
    z.object({
        name: z.string().min(2, {
            message: "Shop name must be at least 2 characters.",
        }),

        description: z
            .string()
            .min(2, { message: "Description field is required!" }),
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
            .default([]),
        openTime: z
            .string({ message: "Open Time is required" })
            .min(1, { message: "Open time is required" })
            .refine(
                (time) => {

                    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                    if (!timeRegex.test(time)) return false;

                    const [hours] = time.split(":").map(Number);
                    return hours >= 6;
                },
                {
                    message: "Shop must not open before 6 AM",
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
        category: z.string({
            required_error: "Please select a category",
        }).min(1, {
            message: "Category is required"
        }),
        subCategory: z.string().optional(),

        video:
            z.union(
                [
                    z.instanceof(File, { message: "Video must be a valid file" }),
                    z.string().min(1, { message: "Video URL must not be empty" }),
                    z.undefined()
                ]
            ).optional().nullable(),
        _id: z.string().optional()
    }),
);

export { shopSchema };