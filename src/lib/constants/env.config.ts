// export const EnvConfig = {
// 	ENV: import.meta.env.PUBLIC_ENV,
// 	DEFAULT_PAGE_LIMIT: import.meta.env.PUBLIC_DEFAULT_PAGE_LIMIT,
// 	BACKEND_API_BASE_URL: import.meta.env.PUBLIC_BACKENd_API_BASE_URL,
// 	ACTION_COLUMN_WIDTH: import.meta.env.PUBLIC_ACTION_COLUMN_WIDTH,
// };
import { env } from "$env/dynamic/public";
export const ENV = env.PUBLIC_NODE_ENV;
export const ACTION_COLUMN_WIDTH = env.PUBLIC_ACTION_COLUMN_WIDTH;
export const DEFAULT_PAGE_LIMIT = env.PUBLIC_DEFAULT_PAGE_LIMIT;
export const API_BASE_URL = env.PUBLIC_API_BASE_URL;
export const UI_BASE_URL = env.PUBLIC_UI_BASE_URL;
