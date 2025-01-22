"use client";
import FormInput from "@/components/modules/shared/formInput";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";

type FormInput = {
  name: string;
  email: string;
  message: string;
};

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col items-center"
    >
      <div className="flex gap-4 w-full mb-8">
        <FormInput
          label="Your name*"
          register={register}
          name="name"
          validation={{ required: true }}
          type="text"
          className="w-full"
        />
        {errors?.name?.type === "required" && <p>This field is required</p>}
        <FormInput
          label="Contact email*"
          register={register}
          name="email"
          validation={{ required: true }}
          type="email"
          className="w-full"
        />
      </div>

      <FormInput
        label="Your message*"
        register={register}
        name="message"
        validation={{ required: true }}
        type="text"
        className=""
      />

      <Button type="submit" className="bg-brand-text-footer mt-6 w-48 h-10">
        Submit
      </Button>
    </form>
  );
};

export default ContactForm;
