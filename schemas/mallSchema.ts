
import { z } from "zod";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const mallSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Shop name must be at least 2 characters." }),
    address: z
        .string()
        .min(2, { message: "Address field must be at least 2 characters" }),
    level: z.coerce.number().min(1, { message: "Level is required" }),
    phone: z
        .string()
        .min(10, { message: "Phone number must contain at least 10 characters" })
        .regex(phoneRegex, { message: "Please enter a valid number!" }),
    image: z.union(
        [
            z.instanceof(File, { message: "Image is required" }),
            z.string().min(1, { message: "Image URL is required" }),
        ],
        {
            required_error: "Image is required",
            invalid_type_error: "Must be a file or image URL",
        }
    ),
    openTime: z
        .string()
        .min(1, { message: "Open time is required" })
        .refine((time) => parseInt(time.split(":")[0]) >= 6, {
            message: "Open time must be before 6 AM",
        }),
    closeTime: z
        .string()
        .min(1, { message: "Close time is required" })
        .refine((time) => parseInt(time.split(":")[0]) >= 23, {
            message: "Close time must be before 11 PM",
        }),
});

export { mallSchema, phoneRegex }