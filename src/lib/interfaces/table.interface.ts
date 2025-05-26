export interface ColumnConfig {
	key: string;
	label: string;
	sortable?: boolean;
	type?: "text" | "number" | "date";
	format?: (value: any) => string;
	width?: string;
	align?: "left" | "center" | "right";
	visible?: boolean;
}

export interface ActionIconConfig {
	show?: boolean;
	edit?: boolean;
	delete?: boolean;
}

export interface IconActions {
	show: boolean;
	class: string;
	icon: any;
	action: (item: any) => void;
}

export interface ActionConfig {
	show?: boolean;
	iconActions?: IconActions[];
	deleteAction?: (item: any) => void;
}
