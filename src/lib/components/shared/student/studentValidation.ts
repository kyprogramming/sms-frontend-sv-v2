import { z } from 'zod';
import { formErrors } from '$lib/stores/formStore';
import { formatDate } from '$lib/utils/formatDate';
import { flattenErrors } from '$lib/utils/validateHelper';
import { generateAdmissionNo, getCurrentAcademicYear } from '$lib/utils/utils';
import { studentSchema, type StudentFormPayload } from '$lib/schemas/student.schema';

formErrors.set({});

export function initializeStudentFormPayload(): StudentFormPayload {
	return {
		userData: {
			email: '',
			mobile: '',
		},
		studentData: {
			admissionNo: generateAdmissionNo(),
			admissionDate: formatDate(new Date()),
			academicYear: getCurrentAcademicYear(),
			rollNo: '',
			classId: '',
			sectionId: '',
			profile: {
				firstName: '',
				middleName: '',
				lastName: '',
				dob: '',
				gender: '',
				category: '',
				religion: '',
				caste: '',
				photo: null,
				address: {
					street: '',
					city: '',
					state: '',
					postalCode: '',
					country: '',
				},
			},
			medicalDetails: {
				bloodGroup: '',
				height: '',
				weight: '',
				measurementDate: '',
				allergies: [],
				medicalConditions: [],
				medicalHistory: '',
			},
			parentGuardianDetails: {
				fatherDetails: {
					fatherFirstName: '',
					fatherLastName: '',
					fatherPhone: '',
					fatherOccupation: '',
					fatherEducation: '',
					fatherEmail: '',
					fatherPhoto: null,
				},
				motherDetails: {
					motherFirstName: '',
					motherLastName: '',
					motherPhone: '',
					motherOccupation: '',
					motherEducation: '',
					motherEmail: '',
					motherPhoto: null,
				},
				guardianDetails: {
					guardianFirstName: '',
					guardianLastName: '',
					guardianPhone: '',
					guardianOccupation: '',
					guardianEducation: '',
					guardianRelation: '',
					guardianEmail: '',
					guardianPhoto: '',
					guardianCurrentAddress: '',
					guardianPermanentAddress: '',
				},
				primaryGuardian: '',
				parentCurrentAddress: '',
				parentPermanentAddress: '',
			},
			documents: [],
		},
	};
}

export function validateStudentForm(formData: StudentFormPayload) {
	let schema;
	const primary = formData.studentData.parentGuardianDetails.primaryGuardian;

	if (primary === 'Father' || primary === 'Mother') {
		schema = studentSchema.extend({
			studentData: studentSchema.shape.studentData.extend({
				parentGuardianDetails: studentSchema.shape.studentData.shape.parentGuardianDetails.extend({
					guardianDetails: z.undefined().optional(), // Accept missing
				}),
			}),
		});
		formData.studentData.parentGuardianDetails.guardianDetails = undefined as any;
	} else if (primary === 'Other') {
		schema = studentSchema;
		if (!formData.studentData.parentGuardianDetails.guardianDetails) {
			formData.studentData.parentGuardianDetails.guardianDetails = {
				guardianFirstName: '',
				guardianLastName: '',
				guardianPhone: '',
				guardianOccupation: '',
				guardianEducation: '',
				guardianRelation: '',
				guardianEmail: '',
				guardianPhoto: '',
				guardianCurrentAddress: '',
				guardianPermanentAddress: '',
			};
		}
	} else {
		schema = studentSchema;
		if (!formData.studentData.parentGuardianDetails.guardianDetails) {
			formData.studentData.parentGuardianDetails.guardianDetails = {
				guardianFirstName: '',
				guardianLastName: '',
				guardianPhone: '',
				guardianOccupation: '',
				guardianEducation: '',
				guardianRelation: '',
				guardianEmail: '',
				guardianPhoto: '',
				guardianCurrentAddress: '',
				guardianPermanentAddress: '',
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


