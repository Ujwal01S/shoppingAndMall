import mongoose from "mongoose";

export async function db() {
    try {
        // const conn = await mongoose.connect(String(process.env.connectionStr))
        const { connection } = await mongoose.connect(String(process.env.connectionStr))
        if (connection.readyState === 1) {
            return Promise.resolve(true);
        }
    } catch (error) {
        // if (error instanceof Error) {
        //     throw error;
        // } else {
        //     throw new Error("Something went wrong during the database connection.");
        // }

        return Promise.reject(error);
    }
}
