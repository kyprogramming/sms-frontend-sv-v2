# Create base directories
mkdir -p src/{lib/{components,layouts,stores,utils,api},routes/{login,register,dashboard/{admin,teacher,student,parent}},server/{db,routes/{auth,attendance,class,event,exam,fee,library,noticeboard,parent,payment,report,section,student,subject,teacher,timetable,user}}} static

# lib/components
touch src/lib/components/{Button.svelte,Input.svelte,Modal.svelte,Navbar.svelte,Sidebar.svelte}

# lib/layouts
touch src/lib/layouts/{AdminLayout.svelte,TeacherLayout.svelte,StudentLayout.svelte,ParentLayout.svelte}

# lib/stores
touch src/lib/stores/{authStore.ts,userStore.ts}

# lib/utils
touch src/lib/utils/{api.ts,auth.ts,validators.ts}

# lib/api (frontend API wrappers)
touch src/lib/api/{auth.ts,attendance.ts,class.ts,event.ts,exam.ts,fee.ts,library.ts,noticeboard.ts,parent.ts,payment.ts,report.ts,section.ts,student.ts,subject.ts,teacher.ts,timetable.ts,user.ts}

# root pages and layouts
touch src/routes/+layout.svelte
touch src/routes/+page.svelte

# login and register
touch src/routes/login/+page.svelte
touch src/routes/register/+page.svelte

# dashboard layout
touch src/routes/dashboard/+layout.svelte

# Admin dashboard
touch src/routes/dashboard/admin/+layout.svelte
touch src/routes/dashboard/admin/+page.svelte
for module in attendance class event exam fee library noticeboard parent payment report section student subject teacher timetable user
do
  mkdir -p src/routes/dashboard/admin/$module
  touch src/routes/dashboard/admin/$module/+page.svelte
done

# Teacher dashboard
touch src/routes/dashboard/teacher/+layout.svelte
touch src/routes/dashboard/teacher/+page.svelte
for module in attendance timetable student exam subject report
do
  mkdir -p src/routes/dashboard/teacher/$module
  touch src/routes/dashboard/teacher/$module/+page.svelte
done

# Student dashboard
touch src/routes/dashboard/student/+layout.svelte
touch src/routes/dashboard/student/+page.svelte
for module in timetable exam attendance report fee
do
  mkdir -p src/routes/dashboard/student/$module
  touch src/routes/dashboard/student/$module/+page.svelte
done

# Parent dashboard
touch src/routes/dashboard/parent/+layout.svelte
touch src/routes/dashboard/parent/+page.svelte
for module in student-info attendance report fee
do
  mkdir -p src/routes/dashboard/parent/$module
  touch src/routes/dashboard/parent/$module/+page.svelte
done

# Server DB and hooks
touch src/server/db/{index.ts,models.ts}
touch src/server/hooks.server.ts
touch src/app.d.ts

# Server API endpoints
touch src/server/routes/auth/{login.post.ts,register.post.ts}
for module in attendance class event exam fee library noticeboard parent payment report section student subject teacher timetable user
do
  touch src/server/routes/$module/{index.get.ts,index.post.ts}
done

# Static assets
touch static/{logo.png,favicon.ico}

# Root config files
touch .env svelte.config.js tsconfig.json package.json README.md


# How to RUN 
# =========================================
# chmod +x create-structure.sh
# ./create-structure.sh