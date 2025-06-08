import { formErrors } from "$lib/stores/formStore";
import { z } from "zod";

export const staffSchema = z.object({
	userData: z.object({
		email: z
			.string()
			.email("Invalid email format")
			.optional()
			.or(z.literal("")),
		mobile: z
			.string()
			.regex(/^[0-9]{10}$/, "10 digits mobile number required")
			.optional()
			.or(z.literal("")),
	}),
	staffData: z.object({
		profile: z.object({
			staffId: z.string().min(1, "Staff Id is required"),
			role: z.string().min(1, "Role is required"),
			designation: z.string().min(1, "Designation is required"),
			department: z.string().min(1, "Department is required"),
			firstName: z.string().min(1, "First name is required"),
			middleName: z.string().optional(),
			lastName: z.string().min(1, "Last name is required"),
			fatherName: z.string().optional(),
			motherName: z.string().optional(),
			spouseName: z.string().optional(),
			email: z
				.string()
				.min(1, "Email is required")
				.email("Invalid email format"),
			gender: z.string().min(1, "Gender is required"),
			dob: z.string(),
			dateOfJoining: z.string().optional(),
			contactNo: z.string().min(1, "Contact no is required"),
			emergencyNo: z.string().optional(),
			maritalStatus: z.string().min(1, "Marital status is required"),
			photoUrl: z.string().optional(),
			address: z.string().min(1, "Current address is required"),
			permanentAddress: z.string().optional(),
			qualification: z.string().min(1, "Qualification is required"),
			workExperience: z.string().optional(),
			note: z.string().optional(),
			panNumber: z.string().optional(),
		}),
		payroll: z.object({
			epfNo: z.string().optional(),
			basicSalary: z.number().nonnegative().optional(),
			contractType: z.string().optional(),
			shift: z.string().optional(),
			workLocation: z.string().optional(),
		}),
		leaveAllotments: z.object({
			medicalLeave: z.number().optional(),
			casualLeave: z.number().optional(),
			maternityLeave: z.number().optional(),
			sickLeave: z.number().optional(),
		}),
		bankDetails: z.object({
			accountTitle: z.string().optional(),
			bankAccountNo: z.string().optional(),
			bankName: z.string().optional(),
			ifscCode: z.string().optional(),
			bankBranch: z.string().optional(),
		}),
		socialLinks: z.object({
			facebook: z.string().url().optional(),
			twitter: z.string().url().optional(),
			linkedin: z.string().url().optional(),
			instagram: z.string().url().optional(),
		}),
	}),
});

formErrors.set({});
export type FormErrors = Partial<Record<any, any>>;
export type StaffFormData = z.infer<typeof staffSchema>;

export function initializeStaffFormData(): StaffFormData {
	return {
		userData: {
			email: "",
			mobile: "",
		},
		staffData: {
			profile: {
				staffId: "",
				role: "",
				designation: "",
				department: "",
				firstName: "",
				middleName: "",
				lastName: "",
				fatherName: "",
				motherName: "",
				spouseName: "",
				email: "",
				gender: "",
				dob: "",
				dateOfJoining: "",
				contactNo: "",
				emergencyNo: "",
				maritalStatus: "",
				photoUrl: "",
				address: "",
				permanentAddress: "",
				qualification: "",
				workExperience: "",
				note: "",
				panNumber: "",
			},
			payroll: {
				epfNo: "",
				basicSalary: 0,
				contractType: "",
				shift: "",
				workLocation: "",
			},
			leaveAllotments: {},
			bankDetails: {},
			socialLinks: {},
		},
	};
}

export function flattenErrors<T>(error: z.ZodFormattedError<T>): FormErrors {
	const result: FormErrors = {};

	function recurse(
		err: z.ZodFormattedError<any> | { _errors: any[] },
		path: any[] = [],
	) {
		// Only proceed with objects
		if (typeof err !== "object" || err === null) return;

		for (const key in err) {
			if (key === "_errors") {
				const messages = (err as { _errors: any[] })._errors;
				if (messages.length > 0) {
					const fullPath = path.join(".");
					result[fullPath] = messages[0];
				}
			} else {
				recurse((err as Record<string, any>)[key], [...path, key]);
			}
		}
	}
	recurse(error);
	return result;
}
