import { z } from 'zod';
import { documentSchema } from './base.schema';

export const studentSchema = z.object({
	userData: z.object({
		email: z.string().email('Invalid email format').optional().or(z.literal('')),
		mobile: z
			.string()
			.regex(/^[0-9]{10}$/, '10 digits mobile number required')
			.optional()
			.or(z.literal('')),
	}),
	studentData: z.object({
		_id: z.string().optional(),
		admissionNo: z.string().min(1, 'Admission number is required'),
		admissionDate: z.string().min(1, 'Admission date is required'),
		academicYear: z.string().min(1, 'Academic session is required'),
		rollNo: z.string().optional(),
		classId: z.string().min(1, 'Class is required'),
		sectionId: z.string().min(1, 'Section is required'),
		profile: z.object({
			firstName: z.string().min(1, 'First name is required'),
			middleName: z.string().optional(),
			lastName: z.string().min(1, 'Last name is required'),
			dob: z.string().min(1, 'Date of birth is required'),
			gender: z.string().min(1, 'Gender is required'),
			category: z.string().optional(),
			religion: z.string().optional(),
			caste: z.string().optional(),
			photo: z.any().optional(),
			address: z.object({
				street: z.string().min(1, 'House No/Street is required'),
				city: z.string().min(1, 'City is required'),
				state: z.string().min(1, 'State is required'),
				postalCode: z.string().min(1, 'Postal Code is required'),
				country: z.string().min(1, 'Country is required'),
			}),
		}),
		medicalDetails: z.object({
			bloodGroup: z.string().optional(),
			height: z.string().regex(/^\d+$/, 'Height must be a number').optional().or(z.literal('')),
			weight: z.string().regex(/^\d+$/, 'Weight must be a number').optional().or(z.literal('')),
			eyeSight: z.string().optional(),
			measurementDate: z.string().optional(),
			allergies: z.array(z.string()).optional(),
			medicalConditions: z.array(z.string()).optional(),
			medicalHistory: z.string().optional(),
		}),
		parentGuardianDetails: z.object({
			fatherDetails: z.object({
				fatherFirstName: z.string().min(1, 'Father first name is required'),
				fatherLastName: z.string().min(1, 'Father last name is required'),
				fatherPhone: z
					.string()
					.regex(/^[0-9]{10}$/, 'Invalid phone (10 digits required)')
					.optional(),
				fatherOccupation: z.string().optional(),
				fatherEducation: z.string().optional(),
				fatherEmail: z.string().email('Invalid email format').optional().or(z.literal('')),
				fatherPhoto: z.any().optional(),
			}),
			motherDetails: z.object({
				motherFirstName: z.string().min(1, 'Mother first name is required'),
				motherLastName: z.string().min(1, 'Mother last name is required'),
				motherPhone: z
					.string()
					.regex(/^[0-9]{10}$/, 'Invalid phone (10 digits required)')
					.optional(),
				motherOccupation: z.string().optional(),
				motherEducation: z.string().optional(),
				motherEmail: z.string().email('Invalid email format').optional().or(z.literal('')),
				motherPhoto: z.any().optional(),
			}),
			guardianDetails: z.object({
				guardianFirstName: z.string().min(1, 'Guardian first name is required'),
				guardianLastName: z.string().min(1, 'Guardian last name is required'),
				guardianPhone: z
					.string()
					.regex(/^[0-9]{10}$/, 'Invalid phone (10 digits required)')
					.optional(),
				guardianOccupation: z.string().optional(),
				guardianEducation: z.string().optional(),
				guardianRelation: z.string().min(1, 'Guardian relation is required'),
				guardianEmail: z.string().email('Invalid email format').optional(),
				guardianPhoto: z.any().optional(),
				guardianCurrentAddress: z.string().min(1, 'Guardian current address is required'),
				guardianPermanentAddress: z.string().optional(),
			}),
			primaryGuardian: z.string().refine((val) => ['Father', 'Mother', 'Other'].includes(val), {
				message: 'Primary guardian must be selected',
			}),
			parentCurrentAddress: z.string().min(1, 'Parent current address is required'),
			parentPermanentAddress: z.string().optional(),
		}),
		documents: z.array(documentSchema).optional(),
		selectedFeeDiscountIds: z.array(z.string()).optional(),
	}),
	feeMasterAssignments: z.array(
		z.object({
			studentId: z.string().optional(),
			feeMasterId: z.string(),
			amount: z.number().min(0, 'Amount must be a positive number'),
			dueDate: z.string().min(1, 'Due date is required'),
			isPaid: z.boolean().default(false),
			paidDate: z.string().optional(),
			fineApplied: z.number().optional(),
			academicYear: z.string().optional(),
		}),
	),
	// feeMasterAssignments: z.object({
	//     feeGroups: z.array(z.object({
	//         id: z.string(),
	//         groupName: z.string(),
	//         selected: z.boolean(),
	//         expanded: z.boolean(),
	//         fees: z.array(z.object({
	//             _id: z.string(),
	//             feeGroupId: z.object({
	//                 _id: z.string(),
	//                 name: z.string(),
	//             }),
	//             feeTypeId: z.object({
	//                 _id: z.string(),
	//                 name: z.string(),
	//             }),
	//             amount: z.number(),
	//             dueDate: z.string(),

	//             fineType: z.string(),
	//             selected: z.boolean(),
	//         })),
	//     })),
	// }),
});

export type StudentFormPayload = z.infer<typeof studentSchema>;
