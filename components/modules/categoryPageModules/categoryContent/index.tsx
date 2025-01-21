"use client";

import { getMallByCategory, getShopAndMallWithCategory } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

import CategoryLoader from "../../shared/loadingSkeleton/categoryLoader";
import CategoryCard from "../categoryCard";

type CategoryFilteredContentType = {
  name: string;
  searchData: string;
};

const CategoryFilteredContent = ({
  name,
  searchData,
}: CategoryFilteredContentType) => {
  const { data: allData, isLoading } = useQuery({
    queryFn: () => getShopAndMallWithCategory(name),
    queryKey: ["shop and mall"],
  });

  const { data: searchedMallData } = useQuery({
    queryFn: () => getMallByCategory(name, searchData),
    queryKey: ["mallByCategory", searchData],
    enabled: !!searchData, // Only run the query if searchData is not null
  });

  if (isLoading) {
    return <CategoryLoader />;
  }

  return <CategoryCard data={searchData ? searchedMallData : allData} />;
};

export default CategoryFilteredContent;
