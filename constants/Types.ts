export type DataType = {
    id: number;
    amount: number;
    time: Date;
    description: string;
    type_id: number;
    tag_id: number;
    method_id: number;
};

export type Tag = {
    id: number;
    tag_name: string;
    category_id: number;
    category_name: string;
};

export type Type = {
    id: number;
    type_name: string;
};

export type Method = {
    id: number;
    method_name: string;
};

export type Category = {
    id: number;
    category_name: string;
};