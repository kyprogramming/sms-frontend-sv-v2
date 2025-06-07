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
			staffId: z.string().min(1),
			role: z.string(),
			designation: z.string().optional(),
			department: z.string().optional(),
			firstName: z.string().min(1),
			middleName: z.string().optional(),
			lastName: z.string().min(1),
			fatherName: z.string().optional(),
			motherName: z.string().optional(),
			email: z.string().email(),
			gender: z.string(),
			dob: z.string(),
			dateOfJoining: z.string().optional(),
			contactNo: z.string().optional(),
			emergencyNo: z.string().optional(),
			maritalStatus: z.string().optional(),
			photoUrl: z.string().url().optional(),
			address: z.string().optional(),
			permanentAddress: z.string().optional(),
			qualification: z.string().optional(),
			workExperience: z.string().optional(),
			note: z.string().optional(),
			panNumber: z.string().min(1),
		}),
		payroll: z.object({
			epfNo: z.string().optional(),
			basicSalary: z.number().nonnegative().optional(),
			contractType: z.enum(["permanent", "probation"]).optional(),
			shift: z.string().optional(),
			workLocation: z.string().optional(),
		}),
		leaveAllotments: z
			.object({
				medicalLeave: z.number().optional(),
				casualLeave: z.number().optional(),
				maternityLeave: z.number().optional(),
				sickLeave: z.number().optional(),
			})
			.optional(),
		bankDetails: z
			.object({
				accountTitle: z.string().optional(),
				bankAccountNo: z.string().optional(),
				bankName: z.string().optional(),
				ifscCode: z.string().optional(),
				bankBranch: z.string().optional(),
			})
			.optional(),
		socialLinks: z
			.object({
				facebook: z.string().url().optional(),
				twitter: z.string().url().optional(),
				linkedin: z.string().url().optional(),
				instagram: z.string().url().optional(),
			})
			.optional(),
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
				contractType: "permanent",
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

	function recurse(err: z.ZodFormattedError<any> | { _errors: any[] }, path: any[] = []) {
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
