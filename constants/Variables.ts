export const TABS_CONFIGURATION = [
    {
        name: "add-data",
        options: {
            title: "Add Data",
            focused: "plus-box",
            unfocused: "plus-box-outline",
            size: 24
        },
    },
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
        name: "insights",
        options: {
            title: "Insights",
            focused: "chart-timeline-variant",
            unfocused: "chart-timeline-variant",
            size: 24
        },
    },
    {
        name: "tags",
        options: {
            title: "Tags",
            focused: "tag",
            unfocused: "tag-outline",
            size: 24
        },
    },
    {
        name: "settings",
        options: {
            title: "Settings",
            focused: "dots-horizontal",
            unfocused: "dots-horizontal",
            size: 24
        },
    },

];

//#region API ENDPOINTS
export const DATA_API_ADDRESS = "http://51.20.113.113:4000/finance-tracker/api/expenses"

export const TAGS_API_ADDRESS = "http://51.20.113.113:4000/finance-tracker/api/tags"

export const TYPES_API_ADDRESS = "http://51.20.113.113:4000/finance-tracker/api/types"

export const METHOD_API_ADDRESS = "http://51.20.113.113:4000/finance-tracker/api/methods"

export const CATEGORIES_API_ADDRESS = "http://51.20.113.113:4000/finance-tracker/api/categories"

//#endregion