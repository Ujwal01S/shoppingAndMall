import { z } from "zod";
import { phoneRegex } from "./mallSchema";

const createMallSchema = (mallCloseTime: string) => {
    return z.object({
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
            }).refine((time) => {
                if (!mallCloseTime) return true;

                const [openHours, openMinutes] = time.split(":").map(Number);
                const [closeHours, closeMinutes] = mallCloseTime.split(":").map(Number);

                const openTimeInMinutes = openHours * 60 + openMinutes;
                const closeTimeInMinutes = closeHours * 60 + closeMinutes;

                return (closeTimeInMinutes - openTimeInMinutes) >= 60;
            }, {
                message: "Opening time must be at least 1 hour earlier than closing time",
            }),
        closeTime: z
            .string()
            .min(1, { message: "Close time is required" })
            .refine((time) => {
                const [hours, minutes] = time.split(":").map(Number);
                return hours < 23 || (hours === 23 && minutes === 0);
            }, {
                message: "Close time must be at or before 11:00 PM",
            }),
    });

}


export { createMallSchema }