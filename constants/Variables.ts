export const TABS_CONFIGURATION = [
    {
        name: "dashboard",
        options: {
            title: "Dashboard",
            focused: "view-dashboard",
            unfocused: "view-dashboard-outline",
            size: 24,
        },
    },
    {
        name: "add-data",
        options: {
            title: "Add Data",
            focused: "plus-box",
            unfocused: "plus-box-outline",
            size: 24,
        },
    },
    {
        name: "insights",
        options: {
            title: "Insights",
            focused: "chart-timeline-variant",
            unfocused: "chart-timeline-variant",
            size: 24,
        },
    },
    {
        name: "tags",
        options: {
            title: "Tags",
            focused: "tag",
            unfocused: "tag-outline",
            size: 24,
        },
    },
    {
        name: "settings",
        options: {
            title: "Settings",
            focused: "dots-horizontal",
            unfocused: "dots-horizontal",
            size: 24,
        },
    },
];


//#region API ENDPOINTS
export const DATA_API_ADDRESS = "/expenses"

export const TAGS_API_ADDRESS = "/tags"

export const TYPES_API_ADDRESS = "/types"

export const METHOD_API_ADDRESS = "/methods"

export const CATEGORIES_API_ADDRESS = "/categories"

export const ADD_DATA_API_ADDRESS = "/add-expense"

export const DELETE_DATA_API_ADDRESS = (itemId: number) => `/expenses/${itemId}/delete`;

export const CREATE_TAG_API_ADDRESS = '/tags/create';
export const DELETE_TAG_API_ADDRESS = (tagId: number) => `/tags/${tagId}/delete`;
export const EDIT_TAG_API_ADDRESS = (id: number) => `/tags/${id}/edit`;

export const DELETE_USER_API_ADDRESS = "/users/delete"

export const BASE_URL = "http://51.20.113.113:4000/finance-tracker/api"
//#endregion