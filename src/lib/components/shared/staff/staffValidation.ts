import { formErrors } from '$lib/stores/formStore';
import { type StaffFormPayload } from '$lib/schemas/staff.schema';

formErrors.set({});

export function initializeStaffFormPayload(): StaffFormPayload {
	return {
		userData: {
			email: '',
			mobile: '',
		},
		staffData: {
			profile: {
				staffId: '',
				role: '',
				designation: '',
				department: '',
				firstName: '',
				middleName: '',
				lastName: '',
				fatherName: '',
				motherName: '',
				spouseName: '',
				email: '',
				gender: '',
				dob: '',
				dateOfJoining: '',
				contactNo: '',
				emergencyNo: '',
				maritalStatus: '',
				photoUrl: '',
				address: '',
				permanentAddress: '',
				qualification: '',
				workExperience: '',
				note: '',
				panNumber: '',
			},
			payroll: {
				epfNo: '',
				basicSalary: 0,
				contractType: '',
				shift: '',
				workLocation: '',
			},
			leaveAllotments: {},
			bankDetails: {},
			socialLinks: {},
			documents: [],
		},
	};
}

