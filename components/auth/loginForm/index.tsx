"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/schemas";
import { login } from "@/actions/login";
import { useState } from "react";

const LoginForm = () => {
  const [message, setMessage] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit = (data:z.infer<typeof LoginSchema>) => {
    login(data).then((data) => {
      if(data?.error){
        setMessage(data?.error)
        setTimeout(() => setMessage(""), 4000)
      }
      console.log(data);
    });
  }
  return (
    
      <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[30%] px-12 flex flex-col space-y-6 py-10  rounded-sm shadow-md">
        <p className="text-4xl font-bold drop-shadow-md text-center">Login</p>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Username" type="text" className="py-6"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
                <FormControl>
                    <Input
                    {...field}
                    placeholder="password"
                    type="password"
                    className="py-6"
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
          )}
          />
          <Button type="submit" className="bg-brand-text-footer text-lg h-12 hover:bg-brand-text-customBlue">Login</Button>
        </form>
        <p className="mt-4 text-center font-semibold text-red-500">{message}</p>
      </Form>
  );
};

export default LoginForm;
