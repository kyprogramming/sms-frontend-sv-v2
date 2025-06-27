// Group the fee data
interface FeeType {
	_id: string;
	feeGroupId: {
		_id: string;
		name: string;
	};
	feeTypeId: {
		_id: string;
		name: string;
	};
	amount: number;
	dueDate: string;
	fineType: string;
	selected: boolean;
}

interface FeeGroup {
	id: string;
	groupName: string;
	selected: boolean;
	expanded: boolean;
	fees: FeeType[];
}

interface Discount {
	_id: string;
	name: string;
	code: string;
	discountType: 'fixed' | 'percentage';
	amount: number;
	applicableTo: string;
	expiryDate: string;
	selected: boolean;
}

type FeeAssignment = {
	studentId?: string;
	feeMasterId: string;
	amount: number;
	dueDate: string;
	isPaid: boolean;
	paidDate?: string;
	fineApplied?: number;
	academicYear?: string;
};



// Define the structure of our fee groups object
type FeeGroups = Record<string, FeeGroup>;

