// src/lib/constants.ts
export const COOKIE_OPTIONS = {
	path: "/",
	httpOnly: true,
	secure: import.meta.env.PROD, // false in dev for localhost HTTP
	sameSite: "strict" as const,
	maxAge: 60 * 60 * 24 * 7, // 1 week
};

export const CASTE_CATEGORIES = [{ name: "General" }, { name: "OBC" }, { name: "SC" }, { name: "ST" }, { name: "Special" }, { name: "Physical Challenged" }];
export const RELIGIONS = [{ name: "Hindu" }, { name: "Muslim" }, { name: "Other" }];
export const GENDERS = [{ name: "Male" }, { name: "Female" }, { name: "Other" }];
export const BLOOD_GROUPS = [{ name: "A+" }, { name: "A-" }, { name: "B+" }, { name: "B-" }, { name: "AB+" }, { name: "AB-" }, { name: "O+" }, { name: "O-" }];

export const SECTIONS = [
	{ id: 1, name: "A" },
	{ id: 2, name: "B" },
	{ id: 3, name: "C" },
	{ id: 4, name: "D" },
	{ id: 5, name: "E" },
	{ id: 6, name: "F" },
];

export const SUBJECT_TYPE = [
	{ id: 1, name: "Theory" },
	{ id: 2, name: "Practical" },
];

export const GUARDIAN_TYPE = [{ name: "Father" }, { name: "Mother" }, { name: "Other" }];


export const MENU_GROUPS = [
	// {
	// 	title: "Front Office",
	// 	icon: "Home",
	// 	items: [
	// 		{ title: "Admission Enquiry", link: "/admin/enquiry" },
	// 		{ title: "Visitor Book", link: "/admin/visitors" },
	// 		{ title: "Phone Call Log", link: "/admin/generalcall" },
	// 		{ title: "Postal Dispatch", link: "/admin/dispatch" },
	// 		{ title: "Postal Receive", link: "/admin/receive" },
	// 		{ title: "Complain", link: "/admin/complaint" },
	// 		{ title: "Setup Front Office", link: "/admin/visitorspurpose" },
	// 	],
	// },
	// {
	// 	title: "Dashboard",
	// 	icon: "LayoutDashboard",
	// 	items: [
	// 		{ title: "Admission Enquiry", link: "/admin/dashboard" },
	// 		{ title: "Class", link: "/admin/dashboard/class" },
	// 		{ title: "Sections Test", link: "/admin/dashboard/section-old" },
	// 		{ title: "Sections", link: "/admin/dashboard/section" },
	// 	],
	// },

	{
		title: "Dashboard",
		icon: "LayoutDashboardIcon",
		link: "/admin/dashboard",
	},
	{
		title: "Student",
		icon: "Users",
		items: [
			{ title: "Student List", link: "/admin/student/list" },
            { title: "Student Registration", link: "/admin/student/create"},
            // { title: "Student Delete", link: "/admin/student/delete"},
            // { title: "Student View", link: "/admin/student/view"},
			// { title: "Online Admission", link: "/admin/onlinestudent" },
			// { title: "Disabled Students", link: "/student/disablestudentslist" },
			// { title: "Multi Class Student", link: "/student/multiclass" },
			// { title: "Bulk Delete", link: "/student/bulkdelete" },
			// { title: "Student Categories", link: "/category" },
			// { title: "Student House", link: "/admin/schoolhouse" },
			// { title: "Disable Reason", link: "/admin/disable_reason" },
		],
	},
	{
		title: "Academics",
		icon: "GraduationCap",
		items: [
			// { title: "Class Timetable", link: "/admin/timetable/classreport" },
			// { title: "Teachers Timetable", link: "/admin/timetable/mytimetable" },
			// {
			// 	title: "Assign Class Teacher",
			// 	link: "/admin/teacher/assign_class_teacher",
			// },
			// { title: "Promote Students", link: "/admin/stdtransfer" },
			// { title: "Subject Group", link: "/admin/subjectgroup" },
			{ title: "Sections", link: "/admin/section" },
			{ title: "Class", link: "/admin/class" },
			{ title: "Subjects", link: "/admin/subject" },
		],
	},
	// {
	// 	title: "Fees Collection",
	// 	icon: "IndianRupee",
	// 	items: [
	// 		{ title: "Collect Fees", link: "/studentfee" },
	// 		{ title: "Offline Bank Payments", link: "/admin/offlinepayment" },
	// 		{ title: "Search Fees Payment", link: "/studentfee/searchpayment" },
	// 		{ title: "Search Due Fees", link: "/studentfee/feesearch" },
	// 		{ title: "Fees Master", link: "/admin/feemaster" },
	// 		{ title: "Quick Fees", link: "/admin/customfeesmaster/index" },
	// 		{ title: "Fees Group", link: "/admin/feegroup" },
	// 		{ title: "Fees Type", link: "/admin/feetype" },
	// 		{ title: "Fees Discount", link: "/admin/feediscount" },
	// 		{ title: "Fees Carry Forward", link: "/admin/feesforward" },
	// 		{ title: "Fees Reminder", link: "/admin/feereminder/setting" },
	// 	],
	// },
	// {
	// 	title: "Online Course",
	// 	icon: "MonitorPlay",
	// 	items: [
	// 		{ title: "Online Course", link: "/onlinecourse/course/index" },
	// 		{
	// 			title: "Offline Payment",
	// 			link: "/onlinecourse/offlinepayment/payment",
	// 		},
	// 		{
	// 			title: "Course Category",
	// 			link: "/onlinecourse/coursecategory/categoryadd",
	// 		},
	// 		{
	// 			title: "Question Bank",
	// 			link: "/onlinecourse/courseexamquestion/index",
	// 		},
	// 		{
	// 			title: "Online Course Report",
	// 			link: "/onlinecourse/coursereport/report",
	// 		},
	// 		{ title: "Setting", link: "/onlinecourse/course/setting" },
	// 	],
	// },
	// {
	// 	title: "Multi Branch",
	// 	icon: "GitBranch",
	// 	items: [
	// 		{ title: "Overview", link: "/admin/multibranch/branch/overview" },
	// 		{ title: "Report", link: "/admin/multibranch/finance/index" },
	// 		{ title: "Setting", link: "/admin/multibranch/branch" },
	// 	],
	// },
	// {
	// 	title: "Gmeet Live Classes",
	// 	icon: "Video",
	// 	items: [
	// 		{ title: "Live Classes", link: "/admin/gmeet/timetable" },
	// 		{ title: "Live Meeting", link: "/admin/gmeet/meeting" },
	// 		{ title: "Live Class Report", link: "/admin/gmeet/class_report" },
	// 		{ title: "Live Meeting Report", link: "/admin/gmeet/meeting_report" },
	// 		{ title: "Setting", link: "/admin/gmeet/index" },
	// 	],
	// },
	// {
	// 	title: "Zoom Live Classes",
	// 	icon: "Video",
	// 	items: [
	// 		{ title: "Live Meeting", link: "/admin/conference/meeting" },
	// 		{ title: "Live Classes", link: "/admin/conference/timetable" },
	// 		{ title: "Live Class Report", link: "/admin/conference/class_report" },
	// 		{
	// 			title: "Live Meeting Report",
	// 			link: "/admin/conference/meeting_report",
	// 		},
	// 		{ title: "Setting", link: "/admin/conference" },
	// 	],
	// },
	// {
	// 	title: "Behaviour Records",
	// 	icon: "AlertCircle",
	// 	items: [
	// 		{ title: "Assign Incident", link: "/behaviour/studentincidents" },
	// 		{ title: "Incidents", link: "/behaviour/incidents" },
	// 		{ title: "Reports", link: "/behaviour/report" },
	// 		{ title: "Setting", link: "/behaviour/setting" },
	// 	],
	// },
	// {
	// 	title: "Income",
	// 	icon: "ArrowDownCircle",
	// 	items: [
	// 		{ title: "Add Income", link: "/admin/income" },
	// 		{ title: "Search Income", link: "/admin/income/incomesearch" },
	// 		{ title: "Income Head", link: "/admin/incomehead" },
	// 	],
	// },
	// {
	// 	title: "Expenses",
	// 	icon: "CreditCard",
	// 	items: [
	// 		{ title: "Add Expense", link: "/admin/expense" },
	// 		{ title: "Search Expense", link: "/admin/expense/expensesearch" },
	// 		{ title: "Expense Head", link: "/admin/expensehead" },
	// 	],
	// },
	// {
	// 	title: "CBSE Examination",
	// 	icon: "ClipboardList",
	// 	items: [
	// 		{ title: "Exam", link: "/cbseexam/exam" },
	// 		{ title: "Exam Schedule", link: "/cbseexam/exam/examtimetable" },
	// 		{ title: "Print Marksheet", link: "/cbseexam/result/marksheet" },
	// 		{ title: "Exam Grade", link: "/cbseexam/grade/gradelist" },
	// 		{ title: "Assign Observation", link: "/cbseexam/observation/assign" },
	// 		{ title: "Observation", link: "/cbseexam/observation" },
	// 		{
	// 			title: "Observation Parameter",
	// 			link: "/cbseexam/observationparameter",
	// 		},
	// 		{ title: "Assessment", link: "/cbseexam/assessment" },
	// 		{ title: "Term", link: "/cbseexam/term" },
	// 		{ title: "Template", link: "/cbseexam/template" },
	// 		{ title: "Reports", link: "/cbseexam/report/index" },
	// 		{ title: "Setting", link: "/cbseexam/setting/index" },
	// 	],
	// },
	// {
	// 	title: "Examinations",
	// 	icon: "ClipboardCheck",
	// 	items: [
	// 		{ title: "Exam Group", link: "/admin/examgroup" },
	// 		{ title: "Exam Schedule", link: "/admin/exam_schedule" },
	// 		{ title: "Exam Result", link: "/admin/examresult" },
	// 		{ title: "Design Admit Card", link: "/admin/admitcard" },
	// 		{ title: "Print Admit Card", link: "/admin/examresult/admitcard" },
	// 		{ title: "Design Marksheet", link: "/admin/marksheet" },
	// 		{ title: "Print Marksheet", link: "/admin/examresult/marksheet" },
	// 		{ title: "Marks Grade", link: "/admin/grade" },
	// 		{ title: "Marks Division", link: "/admin/marksdivision" },
	// 	],
	// },
	// {
	// 	title: "Attendance",
	// 	icon: "CalendarCheck",
	// 	items: [
	// 		{ title: "Student Attendance", link: "/admin/stuattendence" },
	// 		{ title: "Approve Leave", link: "/admin/approve_leave" },
	// 		{
	// 			title: "Attendance By Date",
	// 			link: "/admin/stuattendence/attendencereport",
	// 		},
	// 	],
	// },
	// {
	// 	title: "QR Code Attendance",
	// 	icon: "QrCode",
	// 	items: [
	// 		{ title: "Attendance", link: "/admin/qrattendance/attendance/index" },
	// 		{ title: "Setting", link: "/admin/qrattendance/setting/index" },
	// 	],
	// },
	// {
	// 	title: "Online Examinations",
	// 	icon: "MonitorCheck",
	// 	items: [
	// 		{ title: "Online Exam", link: "/admin/onlineexam" },
	// 		{ title: "Question Bank", link: "/admin/question" },
	// 	],
	// },

	// {
	// 	title: "Annual Calendar",
	// 	icon: "Calendar",
	// 	items: [
	// 		{ title: "Annual Calendar", link: "/admin/holiday/index" },
	// 		{ title: "Holiday Type", link: "/admin/holiday/holidaytype" },
	// 	],
	// },
	// {
	// 	title: "Lesson Plan",
	// 	icon: "ListChecks",
	// 	items: [
	// 		{ title: "Copy Old Lessons", link: "/admin/lessonplan/copylesson" },
	// 		{ title: "Manage Lesson Plan", link: "/admin/syllabus" },
	// 		{ title: "Manage Syllabus Status", link: "/admin/syllabus/status" },
	// 		{ title: "Lesson", link: "/admin/lessonplan/lesson" },
	// 		{ title: "Topic", link: "/admin/lessonplan/topic" },
	// 	],
	// },
	// {
	// 	title: "Human Resource",
	// 	icon: "Users",
	// 	items: [
	// 		{ title: "Staff Directory", link: "/admin/staff" },
	// 		{ title: "Staff Attendance", link: "/admin/staffattendance" },
	// 		{ title: "Payroll", link: "/admin/payroll" },
	// 		{
	// 			title: "Approve Leave Request",
	// 			link: "/admin/leaverequest/leaverequest",
	// 		},
	// 		{ title: "Apply Leave", link: "/admin/staff/leaverequest" },
	// 		{ title: "Leave Type", link: "/admin/leavetypes" },
	// 		{ title: "Teachers Rating", link: "/admin/staff/rating" },
	// 		{ title: "Department", link: "/admin/department/department" },
	// 		{ title: "Designation", link: "/admin/designation/designation" },
	// 		{ title: "Disabled Staff", link: "/admin/staff/disablestafflist" },
	// 	],
	// },
	// {
	// 	title: "Communicate",
	// 	icon: "Megaphone",
	// 	items: [
	// 		{ title: "Notice Board", link: "/admin/notification" },
	// 		{ title: "Send Email", link: "/admin/mailsms/compose" },
	// 		{ title: "Send SMS", link: "/admin/mailsms/compose_sms" },
	// 		{ title: "Email / SMS Log", link: "/admin/mailsms/index" },
	// 		{ title: "Schedule Email SMS Log", link: "/admin/mailsms/schedule" },
	// 		{ title: "Login Credentials Send", link: "/student/bulkmail" },
	// 		{ title: "Email Template", link: "/admin/mailsms/email_template" },
	// 		{ title: "SMS Template", link: "/admin/mailsms/sms_template" },
	// 	],
	// },
	// {
	// 	title: "Download Center",
	// 	icon: "Download",
	// 	items: [
	// 		{ title: "Content Type", link: "/admin/contenttype" },
	// 		{ title: "Content Share List", link: "/admin/content/list" },
	// 		{ title: "Upload/Share Content", link: "/admin/content/upload" },
	// 		{ title: "Video Tutorial", link: "/admin/video_tutorial" },
	// 	],
	// },
	// {
	// 	title: "Homework",
	// 	icon: "BookOpen",
	// 	items: [
	// 		{ title: "Add Homework", link: "/homework" },
	// 		{ title: "Daily Assignment", link: "/homework/dailyassignment" },
	// 	],
	// },
	// {
	// 	title: "Library",
	// 	icon: "Library",
	// 	items: [
	// 		{ title: "Book List", link: "/admin/book/getall" },
	// 		{ title: "Issue - Return", link: "/admin/member" },
	// 		{ title: "Add Student", link: "/admin/member/student" },
	// 		{ title: "Add Staff Member", link: "/admin/member/teacher" },
	// 	],
	// },
	// {
	// 	title: "Inventory",
	// 	icon: "Package",
	// 	items: [
	// 		{ title: "Issue Item", link: "/admin/issueitem" },
	// 		{ title: "Add Item Stock", link: "/admin/itemstock" },
	// 		{ title: "Add Item", link: "/admin/item" },
	// 		{ title: "Item Category", link: "/admin/itemcategory" },
	// 		{ title: "Item Store", link: "/admin/itemstore" },
	// 		{ title: "Item Supplier", link: "/admin/itemsupplier" },
	// 	],
	// },
	// {
	// 	title: "Student CV",
	// 	icon: "FileText",
	// 	items: [
	// 		{ title: "Build CV", link: "/admin/resume/index" },
	// 		{ title: "Download CV", link: "/admin/resume/download" },
	// 	],
	// },
	// {
	// 	title: "Transport",
	// 	icon: "Bus",
	// 	items: [
	// 		{ title: "Fees Master", link: "/admin/transport/feemaster" },
	// 		{ title: "Pickup Point", link: "/admin/pickuppoint" },
	// 		{ title: "Routes", link: "/admin/route" },
	// 		{ title: "Vehicles", link: "/admin/vehicle" },
	// 		{ title: "Assign Vehicle", link: "/admin/vehroute" },
	// 		{ title: "Route Pickup Point", link: "/admin/pickuppoint/assign" },
	// 		{
	// 			title: "Student Transport Fees",
	// 			link: "/admin/pickuppoint/student_fees",
	// 		},
	// 	],
	// },
	// {
	// 	title: "Hostel",
	// 	icon: "Home",
	// 	items: [
	// 		{ title: "Hostel Rooms", link: "/admin/hostelroom" },
	// 		{ title: "Room Type", link: "/admin/roomtype" },
	// 		{ title: "Hostel", link: "/admin/hostel" },
	// 	],
	// },
	// {
	// 	title: "Certificate",
	// 	icon: "FileBadge",
	// 	items: [
	// 		{ title: "Student Certificate", link: "/admin/certificate" },
	// 		{ title: "Generate Certificate", link: "/admin/generatecertificate" },
	// 		{ title: "Student ID Card", link: "/admin/studentidcard" },
	// 		{ title: "Generate ID Card", link: "/admin/generateidcard/search" },
	// 		{ title: "Staff ID Card", link: "/admin/staffidcard" },
	// 		{ title: "Generate Staff ID Card", link: "/admin/generatestaffidcard" },
	// 	],
	// },
	// {
	// 	title: "Front CMS",
	// 	icon: "LayoutPanelLeft",
	// 	items: [
	// 		{ title: "Event", link: "/admin/front/events" },
	// 		{ title: "Gallery", link: "/admin/front/gallery" },
	// 		{ title: "News", link: "/admin/front/notice" },
	// 		{ title: "Media Manager", link: "/admin/front/media" },
	// 		{ title: "Pages", link: "/admin/front/page" },
	// 		{ title: "Menus", link: "/admin/front/menus" },
	// 		{ title: "Banner Images", link: "/admin/front/banner" },
	// 	],
	// },
	// {
	// 	title: "Alumni",
	// 	icon: "UserSquare",
	// 	items: [
	// 		{ title: "Manage Alumni", link: "/admin/alumni/alumnilist" },
	// 		{ title: "Events", link: "/admin/alumni/events" },
	// 	],
	// },
	// {
	// 	title: "Reports",
	// 	icon: "LineChart",
	// 	items: [
	// 		{ title: "Student Information", link: "/report/studentinformation" },
	// 		{ title: "Finance", link: "/financereports/finance" },
	// 		{ title: "Attendance", link: "/attendencereports/attendance" },
	// 		{ title: "Examinations", link: "/admin/examresult/examinations" },
	// 		{ title: "Online Examinations", link: "/admin/onlineexam/report" },
	// 		{ title: "Lesson Plan", link: "/report/lesson_plan" },
	// 		{ title: "Human Resource", link: "/report/human_resource" },
	// 		{
	// 			title: "Homework",
	// 			link: "/homework/homeworkordailyassignmentreport",
	// 		},
	// 		{ title: "Library", link: "/report/library" },
	// 		{ title: "Inventory", link: "/report/inventory" },
	// 		{ title: "Transport", link: "/admin/route/studenttransportdetails" },
	// 		{ title: "Hostel", link: "/admin/hostelroom/studenthosteldetails" },
	// 		{ title: "Alumni", link: "/report/alumnireport" },
	// 		{ title: "User Log", link: "/admin/userlog" },
	// 		{ title: "Audit Trail Report", link: "/admin/audit" },
	// 	],
	// },
	// {
	// 	title: "System Setting",
	// 	icon: "Settings",
	// 	items: [
	// 		{ title: "General Setting", link: "/schsettings" },
	// 		{ title: "Session Setting", link: "/sessions" },
	// 		{ title: "Notification Setting", link: "/admin/notification/setting" },
	// 		{ title: "SMS Setting", link: "/smsconfig" },
	// 		{ title: "Email Setting", link: "/emailconfig" },
	// 		{ title: "Payment Methods", link: "/admin/paymentsettings" },
	// 		{ title: "Thermal Print", link: "/admin/thermalprint/index" },
	// 		{ title: "Print Header Footer", link: "/admin/print_headerfooter" },
	// 		{ title: "Front CMS Setting", link: "/admin/frontcms" },
	// 		{ title: "Roles Permissions", link: "/admin/roles" },
	// 		{ title: "Backup Restore", link: "/admin/admin/backup" },
	// 		{ title: "Languages", link: "/admin/language" },
	// 		{ title: "Currency", link: "/admin/currency" },
	// 		{ title: "Users", link: "/admin/users" },
	// 		{ title: "Addons", link: "/admin/addons" },
	// 		{ title: "Modules", link: "/admin/module" },
	// 		{ title: "Custom Fields", link: "/admin/customfield" },
	// 		{ title: "Captcha Setting", link: "/admin/captcha" },
	// 		{ title: "System Fields", link: "/admin/systemfield" },
	// 		{ title: "Student Profile Update", link: "/student/profilesetting" },
	// 		{
	// 			title: "Online Admission",
	// 			link: "/admin/onlineadmission/admissionsetting",
	// 		},
	// 		{ title: "File Types", link: "/admin/admin/filetype" },
	// 		{ title: "Sidebar Menu", link: "/admin/sidemenu" },
	// 		{ title: "System Update", link: "/admin/updater" },
	// 	],
	// },
];
