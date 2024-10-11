import { createContext } from "react";
import { DataType, Category, Method, Tag, Type } from "./Types";

interface ExpenseDataContextType {
    data: DataType[] | null;
    setData: React.Dispatch<React.SetStateAction<DataType[] | null>>;
}

interface CategoryDataContextType {
    category: Category[] | null;
    setCategory: React.Dispatch<React.SetStateAction<Category[] | null>>;
}

interface MethodDataContextType {
    methods: Method[] | null;
    setMethods: React.Dispatch<React.SetStateAction<Method[] | null>>;
}

interface TagDataContextType {
    tags: Tag[] | null;
    setTags: React.Dispatch<React.SetStateAction<Tag[] | null>>;
}

interface TypeDataContextType {
    types: Type[] | null;
    setTypes: React.Dispatch<React.SetStateAction<Type[] | null>>;
}

export const ExpenseDataContext = createContext<ExpenseDataContextType>({ data: null, setData: () => { } });
export const CategoryDataContext = createContext<CategoryDataContextType>({ category: null, setCategory: () => { } });
export const MethodDataContext = createContext<MethodDataContextType>({ methods: null, setMethods: () => { } });
export const TagDataContext = createContext<TagDataContextType>({ tags: null, setTags: () => { } });
export const TypeDataContext = createContext<TypeDataContextType>({ types: null, setTypes: () => { } });
