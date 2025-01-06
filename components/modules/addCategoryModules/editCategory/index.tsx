"use client";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EventButton } from "../../shared/normalButton";
import { CirclePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editCategoryData, postCategoryData } from "@/lib/api";
import { CategoryType } from "@/app/api/shopcategory/route";
import { DialogDescription } from "@radix-ui/react-dialog";

const formSchema = z.object({
  category: z.string().min(2, { message: "Category must be 2 character long" }),
});

interface EditOrAddCategoryPopupProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  operationType: "update" | "add";
  category?: string;
  subCategory?: string[];
  _id?: string;
}

const EditOrAddCategoryPopup = ({
  operationType,
  setOpen,
  category,
  subCategory,
  _id,
}: EditOrAddCategoryPopupProps) => {
  const [counter, setCouter] = useState<number>(0);
  const [addSubCategory, setAddSubCategory] = useState<string[]>(
    subCategory || []
  );

  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newCategory = e.target.value;
    // console.log("multievent:", e.target.value);

    // if (newCategory) {
    // }

    // below code was wrapped in if(newCategory) so i was not able to remove api pre-occupied data completely i.e. data ko last letter baki vairakhney
    setAddSubCategory((prev) => {
      const updatedCategory = [...prev];
      updatedCategory[index] = newCategory;
      return updatedCategory;
    });
  };

  const { mutate: postCategory, isError: postError } = useMutation({
    mutationFn: (categoryData: CategoryType) => postCategoryData(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  const { mutate: editCategory, isError: editError } = useMutation({
    mutationFn: ({
      id,
      categoryData,
    }: {
      id: string;
      categoryData: CategoryType;
    }) => editCategoryData(id, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  const onsubmit = (data: z.infer<typeof formSchema>) => {
    const categoryData = {
      category: data.category,
      subCategory: addSubCategory,
    };

    // console.log("category:", categoryData);

    if (operationType === "add") {
      postCategory(categoryData);
      setCouter(0);
    }

    if (operationType === "update") {
      editCategory({ id: _id!, categoryData });
      setCouter(0);
    }

    form.setValue("category", "");
    setAddSubCategory([]);
    if (!postError && !editError) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (category) {
      form.setValue("category", category);
      setAddSubCategory(subCategory || []);
      setCouter(subCategory?.length || 0);
    }
  }, [category, form, subCategory]);

  return (
    <DialogContent className="min-w-[35%]">
      <DialogHeader className="border-b-2 pb-3">
        <DialogTitle className="text-start">
          {operationType === "update" ? (
            <p>Update Category</p>
          ) : (
            <p>Add New Category</p>
          )}
        </DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)}>
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Category-Name"
                    className="w-1/2 shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue h-10 focus:border-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {Array.from(Array(counter)).map((c, index) => {
            return (
              <div key={index} className="flex gap-3 mt-3 items-center w-full">
                <input
                  value={addSubCategory[index] ?? ""}
                  onChange={(e) => handleChange(e, index)}
                  className="text-brand-text-tertiary rounded border-[1px]  border-black py-2 w-1/2 focus:border-brand-text-customBlue px-2 focus:outline-none"
                  placeholder="Sub-Category Name"
                />

                <X
                  className="hover:scale-110 text-red-500"
                  onClick={() => {
                    setAddSubCategory((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                    setCouter(counter - 1);
                  }}
                />
              </div>
            );
          })}

          <span
            onClick={() => setCouter(counter + 1)}
            className="flex gap-1 mt-3 items-center text-brand-text-customBlue hover:text-brand-text-footer"
          >
            <p>Add Sub Category</p> <CirclePlus size={20} />
          </span>

          <EventButton
            content={`${operationType === "update" ? "Update" : "Add"}`}
            type="submit"
          />
        </form>
      </Form>
    </DialogContent>
  );
};

export default EditOrAddCategoryPopup;
