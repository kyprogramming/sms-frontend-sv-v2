import { formErrors } from "$lib/stores/formStore";
import { generateAdmissionNo, getCurrentAcademicYear } from "$lib/utils/utils";
import { writable } from "svelte/store";
import { z } from "zod";

export const studentSchema = z.object({
	userData: z.object({
		email: z.string().email("Invalid email format").optional().or(z.literal("")),
		mobile: z
			.string()
			.regex(/^[0-9]{10}$/, "Invalid mobile number (10 digits required)")
			.optional()
			.or(z.literal("")),
	}),
	studentData: z.object({
		admissionNo: z.string().min(1, "Admission number is required"),
		admissionDate: z.string().min(1, "Admission date is required"),
		academicYear: z.string().min(1, "Academic session is required"),
		rollNo: z.string().optional(),
		classId: z.string().min(1, "Class is required"),
		sectionId: z.string().min(1, "Section is required"),
		profile: z.object({
			firstName: z.string().min(1, "First name is required"),
			middleName: z.string().optional(),
			lastName: z.string().min(1, "Last name is required"),
			dob: z.string().min(1, "Date of birth is required"),
			gender: z.string().min(1, "Gender is required"),
			category: z.string().optional(),
			religion: z.string().optional(),
			caste: z.string().optional(),
			studentPhoto: z.any().optional(),
			address: z.object({
				street: z.string().min(1, "Street is required"),
				city: z.string().min(1, "City is required"),
				state: z.string().min(1, "State is required"),
				postalCode: z.string().min(1, "Postal Code is required"),
				country: z.string().min(1, "Country is required"),
			}),
		}),
		medicalDetails: z.object({
			bloodGroup: z.string().optional(),
			height: z.string().regex(/^\d+$/, "Height must be a number").optional().or(z.literal("")),
			weight: z.string().regex(/^\d+$/, "Weight must be a number").optional().or(z.literal("")),
			eyeSight: z.string().optional(),
			measurementDate: z.string().optional(),
			allergies: z.array(z.string()).optional(),
			medicalConditions: z.array(z.string()).optional(),
			medicalHistory: z.string().optional(),
		}),
		parentGuardianDetails: z.object({
			fatherDetails: z.object({
				fatherFirstName: z.string().min(1, "Father first name is required"),
				fatherLastName: z.string().min(1, "Father last name is required"),
				fatherPhone: z
					.string()
					.regex(/^[0-9]{10}$/, "Invalid phone (10 digits required)")
					.optional(),
				fatherOccupation: z.string().optional(),
				fatherEducation: z.string().optional(),
				fatherEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
				fatherPhoto: z.any().optional(),
			}),
			motherDetails: z.object({
				motherFirstName: z.string().min(1, "Mother first name is required"),
				motherLastName: z.string().min(1, "Mother last name is required"),
				motherPhone: z
					.string()
					.regex(/^[0-9]{10}$/, "Invalid phone (10 digits required)")
					.optional(),
				motherOccupation: z.string().optional(),
				motherEducation: z.string().optional(),
				motherEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
				motherPhoto: z.any().optional(),
			}),
			guardianDetails: z.object({
				guardianFirstName: z.string().min(1, "Guardian first name is required"),
				guardianLastName: z.string().min(1, "Guardian last name is required"),
				guardianPhone: z
					.string()
					.regex(/^[0-9]{10}$/, "Invalid phone (10 digits required)")
					.optional(),
				guardianOccupation: z.string().optional(),
				guardianEducation: z.string().optional(),
				guardianRelation: z.string().min(1, "Guardian relation is required"),
				guardianEmail: z.string().email("Invalid email format").optional(),
				guardianCurrentAddress: z.string().min(1, "Guardian current address is required"),
				guardianPermanentAddress: z.string().optional(),
			}),
			primaryGuardian: z.string().refine((val) => ["Father", "Mother", "Other"].includes(val), {
				message: "Primary guardian must be selected",
			}),
			parentCurrentAddress: z.string().min(1, "Parent current address is required"),
			parentPermanentAddress: z.string().optional(),
		}),
	}),
});

formErrors.set({});
export type FormErrors = Partial<Record<any, any>>;
export type TouchedFields = Partial<Record<any, any>>;
// export const formErrors = writable<FormErrors>({});
export const touched = writable<TouchedFields>({});
export const submitAttempted = writable(false);

export type StudentFormData = z.infer<typeof studentSchema>;

export function initializeStudentFormData(): StudentFormData {
	return {
		userData: {
			email: "",
			mobile: "",
		},
		studentData: {
			admissionNo: generateAdmissionNo(),
			admissionDate: new Date().toISOString().split("T")[0],
			academicYear: getCurrentAcademicYear(),
			rollNo: "",
			classId: "",
			sectionId: "",
			profile: {
				firstName: "",
				middleName: "",
				lastName: "",
				dob: "",
				gender: "",
				category: "",
				religion: "",
				caste: "",
				studentPhoto: null,
				address: {
					street: "",
					city: "",
					state: "",
					postalCode: "",
					country: "",
				},
			},
			medicalDetails: {
				bloodGroup: "",
				height: "",
				weight: "",
				measurementDate: "",
				allergies: [],
				medicalConditions: [],
				medicalHistory: "",
			},
			parentGuardianDetails: {
				fatherDetails: {
					fatherFirstName: "",
					fatherLastName: "",
					fatherPhone: "",
					fatherOccupation: "",
					fatherEducation: "",
					fatherEmail: "",
					fatherPhoto: null,
				},
				motherDetails: {
					motherFirstName: "",
					motherLastName: "",
					motherPhone: "",
					motherOccupation: "",
					motherEducation: "",
					motherEmail: "",
					motherPhoto: null,
				},
				guardianDetails: {
					guardianFirstName: "",
					guardianLastName: "",
					guardianPhone: "",
					guardianOccupation: "",
					guardianEducation: "",
					guardianRelation: "",
					guardianEmail: "",
					guardianCurrentAddress: "",
					guardianPermanentAddress: "",
				},
				primaryGuardian: "",
				parentCurrentAddress: "",
				parentPermanentAddress: "",
			},
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

export function validateStudentForm(formData: StudentFormData) {
	let schema;
	const primary = formData.studentData.parentGuardianDetails.primaryGuardian;

	if (primary === "Father" || primary === "Mother") {
		schema = studentSchema.extend({
			studentData: studentSchema.shape.studentData.extend({
				parentGuardianDetails: studentSchema.shape.studentData.shape.parentGuardianDetails.extend({
					guardianDetails: z.undefined().optional(), // Accept missing
				}),
			}),
		});
		formData.studentData.parentGuardianDetails.guardianDetails = undefined as any;
	} else if (primary === "Other") {
		schema = studentSchema;
		if (!formData.studentData.parentGuardianDetails.guardianDetails) {
			formData.studentData.parentGuardianDetails.guardianDetails = {
				guardianFirstName: "",
				guardianLastName: "",
				guardianPhone: "",
				guardianOccupation: "",
				guardianEducation: "",
				guardianRelation: "",
				guardianEmail: "",
				guardianCurrentAddress: "",
				guardianPermanentAddress: "",
			};
		}
	} else {
		schema = studentSchema;
		if (!formData.studentData.parentGuardianDetails.guardianDetails) {
			formData.studentData.parentGuardianDetails.guardianDetails = {
				guardianFirstName: "",
				guardianLastName: "",
				guardianPhone: "",
				guardianOccupation: "",
				guardianEducation: "",
				guardianRelation: "",
				guardianEmail: "",
				guardianCurrentAddress: "",
				guardianPermanentAddress: "",
			};
		}
	}

	const result = schema.safeParse(formData);
	if (!result.success) {
		const mapped = flattenErrors(result.error.format());
		formErrors.set(mapped);
	} else {
		formErrors.set({});
	}
	return result.success;
}
