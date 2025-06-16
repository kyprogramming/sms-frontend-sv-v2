// src/lib/types.ts
export type User = {
	id: string;
	name: string;
	email: string;
	role: string;
	authenticated: boolean;
};

type FieldMeta = {
	name: string;
	label: string;
	type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select' | 'tags';
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	enum?: string[];
};
