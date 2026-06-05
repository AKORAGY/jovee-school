// =====================================
// STORAGE HELPERS
// =====================================

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function getAssignments() {
    return JSON.parse(localStorage.getItem("assignments")) || [];
}

function saveAssignments(assignments) {
    localStorage.setItem(
        "assignments",
        JSON.stringify(assignments)
    );
}

 // =====================================
// MESSAGES STORAGE
// =====================================

function getMessages() {

    return JSON.parse(
        localStorage.getItem("messages")
    ) || [];

}

function saveMessages(messages) {

    localStorage.setItem(
        "messages",
        JSON.stringify(messages)
    );

}



// create assignment storage once
if (!localStorage.getItem("assignments")) {
    saveAssignments([]);
}

// create registration codes storage once
if(!localStorage.getItem("registrationCodes")){
    localStorage.setItem(
        "registrationCodes",
        JSON.stringify([])
    );
}


// =====================================
// REGISTER
// =====================================

const registerForm =
    document.getElementById("registerForm");

if(registerForm){

registerForm.addEventListener("submit", e=>{

    e.preventDefault();

    const users =
        getUsers();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const role =
        document.getElementById("role").value;

    const enteredCode =
        document.getElementById("code")
        .value
        .trim()
        .toUpperCase();

    const codes =
        JSON.parse(
            localStorage.getItem("registrationCodes")
        ) || [];

    const validCode =
        codes.find(c=>
            c.code === enteredCode &&
            c.role === role &&
            !c.used
        );

    if(!validCode){

        alert("Invalid registration code");
        return;
    }

    const exists =
        users.some(
            user =>
            user.email.toLowerCase() ===
            email.toLowerCase()
        );

    if(exists){

        alert("Email already exists");
        return;
    }

    let newUser = {

        id: Date.now(),

        name,

        email,

        role,

        code: enteredCode,

        results: [],

        assignments: []

    };

    if(role === "student"){

        newUser.class =
            document.getElementById(
                "studentClass"
            ).value;

    }

    if(role === "teacher"){

        newUser.contact =
            document.getElementById(
                "contact"
            ).value;

    }

    users.push(newUser);

    validCode.used = true;

    localStorage.setItem(
        "registrationCodes",
        JSON.stringify(codes)
    );

    saveUsers(users);

    alert("Registration successful");

    window.location.href =
        "login.html";

});

}
// show/hide fields based on role
const roleSelect = document.getElementById("role");

if(roleSelect){

    roleSelect.addEventListener("change", () => {

        const classField =
            document.getElementById("classField");

        const contactField =
            document.getElementById("contactField");

        if(roleSelect.value === "student"){

            classField.style.display = "block";
            contactField.style.display = "none";

        }
        else if(roleSelect.value === "teacher"){

            classField.style.display = "none";
            contactField.style.display = "block";

        }
        else{

            classField.style.display = "none";
            contactField.style.display = "none";

        }

    });

}

//generate registration code
function generateCode() {

    const role =
        document.getElementById("codeRole").value;

    const code =
        role.substring(0,1).toUpperCase() +
        Math.random()
            .toString(36)
            .substring(2,8)
            .toUpperCase();

    let codes =
        JSON.parse(
            localStorage.getItem("registrationCodes")
        ) || [];

    codes.push({
        role: role,
        code: code,
        createdAt: new Date().toLocaleString()
    });

    localStorage.setItem(
        "registrationCodes",
        JSON.stringify(codes)
    );

    loadCodes();
}

// load generated codes
function loadCodes() {

    const list =
        document.getElementById("generatedCodes");

    if(!list) return;

    let codes =
        JSON.parse(
            localStorage.getItem("registrationCodes")
        ) || [];

    list.innerHTML = "";

    codes.forEach(c => {

        const li =
            document.createElement("li");

        li.innerHTML = `
            <strong>${c.role}</strong>
            :
            ${c.code}
        `;

        list.appendChild(li);

    });
}
// =====================================
// LOGIN
// =====================================

const loginForm =
    document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit", e=>{

    e.preventDefault();

    const email =
        document.getElementById("loginEmail")
        .value
        .trim();

    const code =
        document.getElementById("loginCode")
        .value
        .trim()
        .toUpperCase();

    const studentClass =
        document.getElementById("loginClass")
        .value
        .trim();

    const contact =
        document.getElementById("loginContact")
        .value
        .trim();

    const users =
        getUsers();

    // ADMIN LOGIN
    if(
        email === "admin@jove.com" &&
        code === "JOVE@123"
    ){

        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                role:"admin",
                name:"Administrator"
            })
        );

        window.location.href =
            "admin.html";

        return;
    }

    let user =
        users.find(u=>
            u.email === email &&
            u.code === code
        );

    if(!user){

        alert("Invalid login details");
        return;
    }

    if(
        user.role === "student" &&
        user.class !== studentClass
    ){

        alert("Incorrect class");
        return;
    }

    if(
        user.role === "teacher" &&
        user.contact !== contact
    ){

        alert("Incorrect contact");
        return;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    if(user.role === "teacher"){

        window.location.href =
            "teacher.html";

    }else{

        window.location.href =
            "student.html";

    }

});

}
// show password toggle
function toggleCode(){

    const input =
        document.getElementById("code");

    input.type =
        input.type === "password"
        ? "text"
        : "password";
}

function toggleLoginCode(){

    const input =
        document.getElementById("loginCode");

    input.type =
        input.type === "password"
        ? "text"
        : "password";
}


// ======================
// HOME PAGE NAVIGATION
// ======================

function adminLogin() {
    window.location.href = "login.html?role=admin";
}

function teacherLogin() {
    window.location.href = "login.html?role=teacher";
}

function studentLogin() {
    window.location.href = "login.html?role=student";
}


// =====================================
// AUTH
// =====================================

function protectPage(role) {

    const user =
        getCurrentUser();

    if (!user) {
        window.location.href =
            "login.html";
        return;
    }

    if (role && user.role !== role) {

        alert("Access denied");

        logout();
    }

}

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "index.html";

}

function back() {
    history.back();
}

// =====================================
// ADMIN FUNCTIONS
// =====================================

function showTeacherPanel() {

    document.getElementById(
        "teacherPanel"
    ).style.display = "block";

    document.getElementById(
        "studentPanel"
    ).style.display = "none";

    document.getElementById(
        "statsPanel"
    ).style.display = "none";

    loadAdminUsers();
}

function showStudentPanel() {

    document.getElementById(
        "teacherPanel"
    ).style.display = "none";

    document.getElementById(
        "studentPanel"
    ).style.display = "block";

    document.getElementById(
        "statsPanel"
    ).style.display = "none";

    loadAdminUsers();
}

function showStats() {

    document.getElementById(
        "teacherPanel"
    ).style.display = "none";

    document.getElementById(
        "studentPanel"
    ).style.display = "none";

    document.getElementById(
        "statsPanel"
    ).style.display = "block";

    loadStats();
}

function deleteUser(id) {

    if (!confirm("Are you sure you want to delete this user?")) {
        return;
    }

    const users = getUsers().filter(
        user => user.id !== id
    );

    saveUsers(users);

    alert("User deleted successfully");

    loadAdminUsers();
}

function loadAdminUsers() {

    const teacherList =
        document.getElementById("teacherList");

    const studentList =
        document.getElementById("studentList");

    if (!teacherList || !studentList)
        return;

    teacherList.innerHTML = "";
    studentList.innerHTML = "";

    getUsers().forEach(user => {

        if(user.role === "teacher"){

            const li =
                document.createElement("li");

          li.innerHTML = `
    <strong>${user.name}</strong><br>
    ${user.email}<br><br>

    <button
        class="red"
        onclick="deleteUser(${user.id})">

        Delete

    </button>
`;

        }

        if(user.role === "student"){

            const li =
                document.createElement("li");

           li.innerHTML = `
    <strong>${user.name}</strong><br>
    ${user.email}<br>
    Class: ${user.class || "N/A"}<br><br>

    <button
        class="red"
        onclick="deleteUser(${user.id})">

        Delete

    </button>
`;

        }

    });

}

function loadStats() {

    const users =
        getUsers();

    const totalUsers =
        document.getElementById("totalUsers");

    if (!totalUsers)
        return;

    totalUsers.textContent =
        `Total Users: ${users.length}`;

    document.getElementById(
        "totalStudents"
    ).textContent =
        `Students: ${
            users.filter(
                u => u.role === "student"
            ).length
        }`;

    document.getElementById(
        "totalTeachers"
    ).textContent =
        `Teachers: ${
            users.filter(
                u => u.role === "teacher"
            ).length
        }`;

}

function searchUser() {

    const keyword =
        document
        .getElementById("search")
        .value
        .trim()
        .toLowerCase();

    const userList =
        document.getElementById("userList");

    if (!userList) return;

    userList.innerHTML = "";

    const users =
        getUsers();

    let results = [];

    // S = Students
    if (keyword === "s") {

        results =
            users.filter(
                user =>
                user.role === "student"
            );

    }

    // T = Teachers
    else if (keyword === "t") {

        results =
            users.filter(
                user =>
                user.role === "teacher"
            );

    }

    // Empty search
    else if (keyword === "") {

        results = [];

    }

    // Normal search
    else {

        results =
            users.filter(
                user =>
                    user.name
                        .toLowerCase()
                        .includes(keyword)
                    ||
                    user.email
                        .toLowerCase()
                        .includes(keyword)
            );

    }

    if (results.length === 0) {

        userList.innerHTML =
            "<li>No users found</li>";

        return;

    }

    results.forEach(user => {

        const li =
            document.createElement("li");

        li.innerHTML = `
            <strong>${user.name}</strong>
            (${user.role})
        `;

        userList.appendChild(li);

    });

}

// Auto-search while typing
const searchInput =
    document.getElementById("search");

if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        searchUser
    );

}

// =====================================
// TEACHER - STUDENTS
// =====================================

// Teacher Welcome Message
const teacherWelcome =
    document.getElementById("teacherWelcome");

if (teacherWelcome) {

    const currentUser =
        getCurrentUser();

    if (currentUser) {

        teacherWelcome.textContent =
            `Welcome Teacher ${currentUser.name}`;

    }

}

function loadTeacherStudents() {

    const studentList =
        document.getElementById("studentList");

    if (!studentList) return;

    studentList.innerHTML = "";

    getUsers()
        .filter(user => user.role === "student")
        .forEach(student => {

            const li =
                document.createElement("li");

            li.innerHTML = `
                <strong>${student.name}</strong><br>
                📧 ${student.email}<br>
                🏫 Class: ${student.class || "Not Assigned"}
            `;

            studentList.appendChild(li);

        });

}

function searchStudent() {

    const keyword =
        document.getElementById("search")
        .value
        .trim()
        .toLowerCase();

    const studentList =
        document.getElementById("studentList");

    if (!studentList)
        return;

    studentList.innerHTML = "";

    let results = [];

    const students =
        getUsers().filter(
            user =>
            user.role === "student"
        );

    // Empty search = show all students
    if (keyword === "") {

        results = students;

    }

    // Search by name or email
    else {

        results = students.filter(
            student =>
                student.name
                    .toLowerCase()
                    .includes(keyword)
                ||
                student.email
                    .toLowerCase()
                    .includes(keyword)
        );

    }

    if (results.length === 0) {

        studentList.innerHTML =
            "<li>No students found</li>";

        return;

    }

    results.forEach(student => {

        const li =
            document.createElement("li");

        li.className = "student-card";

        li.innerHTML = `
            <strong>${student.name}</strong>
            <br>
            ${student.email}
        `;

        studentList.appendChild(li);

    });

}

// =====================================
// TEACHER - ASSIGNMENTS
// =====================================

function loadClassDropdown() {

    const classSelect =
        document.getElementById(
            "assignmentClass"
        );

    if(!classSelect) return;

    const users = getUsers();

    const classes = [
        ...new Set(
            users
                .filter(
                    user =>
                        user.role === "student" &&
                        user.class
                )
                .map(
                    user => user.class
                )
        )
    ];

    classSelect.innerHTML =
        '<option value="">Select Class</option>';

    classes.forEach(cls => {

        const option =
            document.createElement(
                "option"
            );

        option.value = cls;
        option.textContent = cls;

        classSelect.appendChild(option);

    });

}

function createAssignment() {

    const title =
        document.getElementById(
            "assignmentTitle"
        ).value.trim();

    const subject =
        document.getElementById(
            "assignmentSubject"
        ).value.trim();

    const description =
        document.getElementById(
            "assignmentDescription"
        ).value.trim();

    const dueDate =
        document.getElementById(
            "assignmentDueDate"
        ).value;

    if (
        !title ||
        !subject ||
        !description ||
        !dueDate
    ) {
        alert("Fill all fields");
        return;
    }

    const assignments =
        getAssignments();

    assignments.push({

        id: Date.now(),

        title,

        subject,

        description,

        dueDate,

        createdAt:
            new Date()
            .toLocaleDateString()

    });

    saveAssignments(assignments);

    document.getElementById(
        "assignmentTitle"
    ).value = "";

    document.getElementById(
        "assignmentSubject"
    ).value = "";

    document.getElementById(
        "assignmentDescription"
    ).value = "";

    document.getElementById(
        "assignmentDueDate"
    ).value = "";

    loadAssignments();

    alert("Assignment Created");
}
/* load classes into dropdown on result page load */
function loadClasses() {

    const classSelect =
        document.getElementById("classSelect");

    if(!classSelect) return;

    const users = getUsers();

    const classes =
        [...new Set(
            users
            .filter(u => u.role === "student")
            .map(u => u.class)
        )];

    classes.forEach(c => {

        const option =
            document.createElement("option");

        option.value = c;
        option.textContent = c;

        classSelect.appendChild(option);

    });

}

// =====================================
// SAFE HELPERS
// =====================================

const $ = (id) => document.getElementById(id);

// prevent crashes if missing
const safe = (fn) => {
    try { fn(); } catch (e) { console.warn(e); }
};

// =====================================
// LOADER (FIXED - NO DOUBLE RUN)
// =====================================

function startLoader() {
    const loader = $("loader");
    if (!loader) return;

    const progress = $("progress");
    const percent = $("percent");

    if (!progress || !percent) return;

    let value = 0;

    const timer = setInterval(() => {
        value += 2;

        progress.style.width = value + "%";
        percent.textContent = value + "%";

        if (value >= 100) {
            clearInterval(timer);

            setTimeout(() => {
                loader.style.opacity = "0";

                setTimeout(() => {
                    loader.style.display = "none";
                    document.body.style.overflow = "auto";
                }, 300);
            }, 200);
        }
    }, 20);
}

// SAFE TRIGGER (NO DUPLICATES)
if (document.readyState === "complete") {
    startLoader();
} else {
    window.addEventListener("load", startLoader);
}

// =====================================
// PAGE INITIALIZER (SAFE ROUTER)
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const currentUser = getCurrentUser?.();
    if (!currentUser) return;

    if (currentUser.role === "admin") {
        loadAdminUsers?.();
        loadStats?.();
    }

    if (currentUser.role === "teacher") {
        loadTeacherStudents?.();
        loadAssignments?.();
        loadSubmittedAssignments?.();
    }

    loadStudentAssignments?.();
    initCalculator?.();
    initStudentWelcome?.();
});

// =====================================
// ASSIGNMENTS (FIXED - NO DUPLICATES)
// =====================================


function loadStudentResults() {

    const container =
        document.getElementById("resultsList");

    if (!container) return;

    const current =
        getCurrentUser();

    if (!current) return;

    const users =
        getUsers();

    const student =
        users.find(u =>
            u.email === current.email
        );

    if (!student) return;

    container.innerHTML = "";

    if (!student.results ||
        student.results.length === 0) {

        container.innerHTML = `
            <div class="card">
                No results yet
            </div>
        `;

        return;
    }

    student.results.forEach(result => {

        const card =
            document.createElement("div");

        card.className = "assignment-card";

        card.innerHTML = `
            <h3>${result.assignment}</h3>

            <p>
                <strong>Subject:</strong>
                ${result.subject}
            </p>

            <p>
                <strong>Marks:</strong>
                ${result.marks}
            </p>

            <p>
                <strong>Grade:</strong>
                ${result.grade}
            </p>
        `;

        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadStudentResults();
});

function loadAssignments() {

    const list = $("assignmentManagerList");
    const count = $("assignmentCount");

    if (!list) return;

    const assignments = getAssignments?.() || [];

    list.innerHTML = "";

    if (count) {
        count.textContent = assignments.length;
    }

    assignments.forEach(a => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="assignment-item">
                <h4>${a.title}</h4>
                <p><strong>Subject:</strong> ${a.subject}</p>
                <p><strong>Due:</strong> ${a.dueDate}</p>
                <button class="red" onclick="deleteAssignment(${a.id})">
                    Delete
                </button>
            </div>
        `;

        list.appendChild(li);
    });
}

function deleteAssignment(id) {
    const assignments = (getAssignments?.() || [])
        .filter(a => a.id !== id);

    saveAssignments?.(assignments);
    loadAssignments?.();
}

// =====================================
// STUDENT ASSIGNMENTS
// =====================================

function loadStudentAssignments() {

    const list = document.getElementById("assignmentList");

    if (!list) return;

    const assignments =
        JSON.parse(localStorage.getItem("assignments") || "[]");

    list.innerHTML = "";

    if (assignments.length === 0) {

        list.innerHTML = `
            <div class="card">
                No assignments available
            </div>
        `;

        return;
    }

    assignments.forEach(a => {

        const card = document.createElement("div");

        card.className = "assignment-card";

        card.innerHTML = `
            <h3>${a.title}</h3>
            <p>${a.subject}</p>

            <button onclick="viewAssignment(${a.id})">
                View
            </button>
        `;

        list.appendChild(card);
    });
}

function viewAssignment(id) {

    const assignments =
        JSON.parse(localStorage.getItem("assignments") || "[]");

    const assignment =
        assignments.find(a => a.id == id);

    if (!assignment) return;

    document.getElementById("assignmentDetails").innerHTML = `
        <h3>${assignment.title}</h3>

        <p>
            <strong>Subject:</strong>
            ${assignment.subject}
        </p>

        <p>
            <strong>Description:</strong>
            ${assignment.description}
        </p>

        <p>
            <strong>Due Date:</strong>
            ${assignment.dueDate}
        </p>

        ${
            assignment.file
            ?
            `
            <button
                onclick="openAssignmentFile('${assignment.file}')">
                Open File
            </button>

            <button
                onclick="downloadAssignmentFile('${assignment.file}')">
                Download
            </button>
            `
            :
            "<p>No file attached</p>"
        }
    `;
}

function openAssignmentFile(file) {
    window.open(file, "_blank");
}

function downloadAssignmentFile(file) {

    const a = document.createElement("a");

    a.href = file;

    a.download = "";

    a.click();
}

document.addEventListener("DOMContentLoaded", () => {
    loadStudentAssignments();
});


// videos

function loadStudentVideos() {

    const container =
        document.getElementById("videoList");

    if (!container) return;

    const current =
        getCurrentUser();

    if (!current) return;

    const videos =
        JSON.parse(localStorage.getItem("videos") || "[]");

    const classVideos =
        videos.filter(v =>
            v.class === current.class
        );

    container.innerHTML = "";

    if (classVideos.length === 0) {

        container.innerHTML = `
            <div class="card">
                No videos available
            </div>
        `;

        return;
    }

    classVideos.forEach((video, index) => {

        const card =
            document.createElement("div");

        card.className = "assignment-card";

        card.innerHTML = `
            <h3>Lesson ${index + 1}</h3>

            <p>
                Posted:
                ${video.date}
            </p>

            <video
                controls
                width="100%"
                src="${video.video}">
            </video>

            <br><br>

            <button
                onclick="downloadVideo('${video.video}')">
                Download
            </button>
        `;

        container.appendChild(card);
    });
}

function downloadVideo(src) {

    const a =
        document.createElement("a");

    a.href = src;

    a.download = "lesson.webm";

    a.click();
}

document.addEventListener("DOMContentLoaded", () => {
    loadStudentVideos();
});


// =====================================
// STUDENT WELCOME (SAFE)
// =====================================

function initStudentWelcome() {
    const el = $("studentWelcome");
    if (!el) return;

    const user = getCurrentUser?.();
    if (!user) return;

    el.textContent = `Welcome ${user.name}`;
}

//assignments viewer for students (SAFE)
function showAssignments() {
    alert("Loading assignments...");

    const user = getCurrentUser();
    if (!user) return;

    const assignments = getAssignments?.() || [];

    const myClassAssignments = assignments.filter(a => a.class === user.class || !a.class);

    if (myClassAssignments.length === 0) {
        alert("No assignments yet");
        return;
    }

    let text = "ASSIGNMENTS:\n\n";

    myClassAssignments.forEach(a => {
        text += `• ${a.title} (${a.subject})\n`;
    });

    alert(text);
}

//videos viewer for students (SAFE)
function showVideos() {

    const user = getCurrentUser();
    if (!user) return;

    const videos = JSON.parse(localStorage.getItem("videos") || "[]");

    const myVideos = videos.filter(v => v.class === user.class);

    if (myVideos.length === 0) {
        alert("No videos yet");
        return;
    }

    let msg = "VIDEO LESSONS:\n\n";

    myVideos.forEach(v => {
        msg += `• ${v.date} (${v.duration || 0}s)\n`;
    });

    alert(msg);
}
//results viewer for students (SAFE)    
function showResults() {
    const user = getCurrentUser();
    if (!user) return;

    const users = getUsers();
    const me = users.find(u => u.id === user.id);

    if (!me || !me.results) {
        alert("No results yet");
        return;
    }

    let msg = "RESULTS:\n\n";

    me.results.forEach(r => {
        msg += `• ${r.subject}: ${r.score}\n`;
    });

    alert(msg);
}

// ============================
// NAV FUNCTIONS (STUDENT)
// ============================

function showAssignments() {
    window.location.href = "view_assignments.html";
}

function showVideos() {
    window.location.href = "student-videos.html";
}

function showResults() {
    window.location.href = "results.html";
}
// =====================================
// UPLOAD ASSIGNMENT (SAFE)
// =====================================

function uploadAssignment() {

    const fileInput = document.getElementById("assignmentFile");

    if (!fileInput.files.length) {
        alert("Choose a file");
        return;
    }

    const currentUser = getCurrentUser();
    const users = getUsers();

    const student = users.find(
        u => u.email === currentUser.email
    );

    if (!student) return;

    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function () {

        if (!student.assignments) {
            student.assignments = [];
        }

        student.assignments.push({
            id: Date.now(),
            fileName: file.name,
            fileType: file.type,
            fileData: reader.result,
            date: new Date().toLocaleString()
        });

        saveUsers(users);

        alert("Assignment uploaded successfully");

        fileInput.value = "";
    };

    reader.readAsDataURL(file);
}

// =====================================
// SUBMISSIONS VIEW
// =====================================

function loadSubmittedAssignments() {

    const list = $("assignmentList");
    if (!list) return;

    list.innerHTML = "";

    (getUsers?.() || [])
        .filter(u => u.role === "student")
        .forEach(student => {

            (student.assignments || []).forEach(a => {

                const li = document.createElement("li");

                li.innerHTML = `
                    <strong>${student.name}</strong><br>
                    ${a.file}<br>
                    ${a.date}
                `;

                list.appendChild(li);
            });
        });
}

// =====================================
// CALCULATOR (FIXED - NO CRASH)
// =====================================

function initCalculator() {

    const input = $("marks");
    const grade = $("grade");

    if (!input || !grade) return;

    input.addEventListener("input", () => {

        const marks = Number(input.value);

        let g = "";

        if (marks >= 80) g = "A";
        else if (marks >= 70) g = "B";
        else if (marks >= 60) g = "C";
        else if (marks >= 50) g = "D";
        else g = "F";

        grade.value = g;
    });
}

// =====================================
// LIBRARY
// =====================================

function showLibrary() {
    window.open(
        "https://akoragy.github.io/KIGEZI-PUBLIC-LIBRARY/",
        "_blank"
    );
}



// ==========================
// LOAD MARKSHEETS
// ==========================
function loadMarksheets() {

    const selectedClass = document.getElementById("classSelect").value;
    const body = document.getElementById("marksheetBody");

    if (!body) return;

    body.innerHTML = "";

    if (!selectedClass) return;

    const users = getUsers?.() || [];

    const students = users.filter(u =>
        u.role === "student" &&
        u.class === selectedClass
    );

    students.forEach((student, index) => {

        // safe marks (you can later connect real DB marks)
        const marks = student.marks || {
            p1: 0,
            p2: 0,
            p3: 0,
            p4: 0
        };

        const total =
            (marks.p1 + marks.p2 + marks.p3 + marks.p4);

        const avg = total / 4;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${marks.p1}</td>
            <td>${marks.p2}</td>
            <td>${marks.p3}</td>
            <td>${marks.p4}</td>
            <td><b>${total}</b></td>
            <td><b>${avg.toFixed(2)}</b></td>
        `;

        body.appendChild(row);
    });
}



// =========================
// VIDEO SYSTEM SAFE BLOCK
// =========================

let stream = null;
let mediaRecorder = null;
let recordedChunks = [];
let timerInterval = null;
let seconds = 0;

// SAFE GET USERS CLASS VIDEO STORAGE
function getVideos() {
    return JSON.parse(localStorage.getItem("videos") || "[]");
}

function saveVideos(videos) {
    localStorage.setItem("videos", JSON.stringify(videos));
}

// =========================
// LOAD CLASSES
// =========================
document.addEventListener("DOMContentLoaded", () => {

    const select = document.getElementById("classSelect");
    if (!select) return;

    const users = getUsers?.() || [];

    const classes = [...new Set(
        users
        .filter(u => u.role === "student")
        .map(u => u.class)
        .filter(Boolean)
    )];

    select.innerHTML = `<option value="">Select Class</option>`;

    classes.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        select.appendChild(opt);
    });

    updateVideoCount();
});


// =========================
// START CAMERA
// =========================
function startCamera() {

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    .then(s => {

        stream = s;

        const preview = document.getElementById("preview");
        if (preview) preview.srcObject = stream;

        const status = document.getElementById("recordStatus");
        if (status) status.textContent = "🟢 Camera Ready";

    })
    .catch(() => alert("Camera access denied"));
}

// =========================
// START RECORDING
// =========================
function startRecording() {

    if (!stream) return alert("Start camera first");

    recordedChunks = [];
    seconds = 0;

    const status = document.getElementById("recordStatus");
    if (status) {
        status.textContent = "🔥 Recording...";
        status.style.color = "red";
    }

    timerInterval = setInterval(() => {
        seconds++;

        const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");

        const timer = document.getElementById("timer");
        if (timer) timer.textContent = `${mins}:${secs}`;

    }, 1000);

    mediaRecorder = new MediaRecorder(stream, {
        videoBitsPerSecond: 500000
    });

    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.start();
}

// =========================
// STOP + SAVE VIDEO
// =========================
function stopRecording() {

    if (!mediaRecorder) return;

    mediaRecorder.stop();

    mediaRecorder.onstop = () => {

        clearInterval(timerInterval);

        const status = document.getElementById("recordStatus");
        if (status) {
            status.textContent = "✅ Saved";
            status.style.color = "green";
        }

        const blob = new Blob(recordedChunks, { type: "video/webm" });

        const reader = new FileReader();

        reader.onload = function () {

            const className = document.getElementById("classSelect")?.value || "unknown";

            const videos = getVideos();

            videos.push({
                id: Date.now(),
                class: className,
                video: reader.result,
                date: new Date().toLocaleString(),
                duration: seconds
            });

            saveVideos(videos);

            updateVideoCount();

            alert("Video sent to class " + className);
        };

        reader.readAsDataURL(blob);
    };
}

// =========================
// VIDEO COUNT
// =========================
function updateVideoCount() {

    const el = document.getElementById("videoCount");
    if (!el) return;

    el.textContent = getVideos().length;
}

// student video viewer//
document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("videoList");
    if (!container) return;

    const user = getCurrentUser?.();
    if (!user || !user.class) {
        container.innerHTML = "<p>No user logged in</p>";
        return;
    }

    const videos = getVideos();

    const myVideos = videos.filter(v => v.class === user.class);

    if (myVideos.length === 0) {
        container.innerHTML = "<p>No videos for your class yet</p>";
        return;
    }

    container.innerHTML = "";

    myVideos.forEach(v => {

        const div = document.createElement("div");

        div.innerHTML = `
            <p><b>Date:</b> ${v.date}</p>
            <p><b>Duration:</b> ${v.duration}s</p>
            <video controls width="300" src="${v.video}"></video>
            <hr>
        `;

        container.appendChild(div);
    });

});



//global settings//
function toggleSettings() {
    const menu = document.getElementById("settingsDropdown");
    if (!menu) return;

    menu.style.display =
        menu.style.display === "block" ? "none" : "block";
}

//open account settings teacher +student//
function showAccount() {

    const user = getCurrentUser();
    if (!user) return;

    document.getElementById("accountName").value = user.name || "";
    document.getElementById("accountEmail").value = user.email || "";
    document.getElementById("accountRole").value = user.role || "";

    document.getElementById("accountModal").style.display = "flex";
}

//save account changes  (student + teacher)
function closeAccount() {
    const modal = document.getElementById("accountModal");
    if (modal) modal.style.display = "none";
}
//save account for all
function saveAccount() {

    let users = getUsers();
    let current = getCurrentUser();

    if (!current) return;

    const name = document.getElementById("accountName").value.trim();
    const email = document.getElementById("accountEmail").value.trim();

    if (!name || !email) {
        alert("Fill all fields");
        return;
    }

    // update current user
    current.name = name;
    current.email = email;

    // update in users list
    users = users.map(u =>
        u.id === current.id
            ? { ...u, name, email }
            : u
    );

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(current));

    alert("Account updated successfully");

    closeAccount();

    location.reload();
}

function showMessages() {
    alert("Messages feature coming soon 🚀");
}

// =====================================
// SEND MESSAGE
// =====================================

function sendMessage() {

    const currentUser =
        getCurrentUser();

    if (!currentUser) {

        alert("Please login");
        return;

    }

    const role =
        document.getElementById(
            "messageRole"
        ).value;

    const text =
        document.getElementById(
            "messageText"
        ).value.trim();

    if (!text) {

        alert("Enter a message");
        return;

    }

    const messages =
        getMessages();

    messages.push({

        id: Date.now(),

        from: currentUser.name,

        fromRole: currentUser.role,

        toRole: role,

        text: text,

        date:
            new Date()
            .toLocaleString(),

        read: false

    });

    saveMessages(messages);

    document.getElementById(
        "messageText"
    ).value = "";

    alert("Message Sent");

}


// =====================================
// LOAD NOTIFICATIONS
// =====================================

function loadNotifications() {

    const container =
        document.getElementById(
            "notificationList"
        );

    if (!container)
        return;

    const user =
        getCurrentUser();

    if (!user)
        return;

    const messages =
        getMessages();

    const notifications =
        messages.filter(
            m =>
                m.toRole ===
                user.role
        );

    container.innerHTML = "";

    if (
        notifications.length === 0
    ) {

        container.innerHTML =
            "<p>No notifications</p>";

        return;

    }

    notifications
        .reverse()
        .forEach(msg => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "notification-card";

            card.innerHTML = `

                <h3>
                    📩 ${msg.from}
                </h3>

                <p>
                    ${msg.text}
                </p>

                <small>
                    ${msg.date}
                </small>

            `;

            container.appendChild(
                card
            );

            msg.read = true;

        });

    saveMessages(messages);

}


// =====================================
// COUNT NOTIFICATIONS
// =====================================

function getNotificationCount() {

    const user =
        getCurrentUser();

    if (!user)
        return 0;

    return getMessages()
        .filter(
            m =>
                m.toRole ===
                user.role &&
                !m.read
        ).length;
}


// =====================================
// OPEN PAGES
// =====================================

function showMessages() {

    window.location.href =
        "message.html";

}

function showNotifications() {

    window.location.href =
        "notifications.html";

}


// =====================================
// UPDATE BADGE
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const badge =
            document.getElementById(
                "notifyCount"
            );

        if (!badge)
            return;

        const count =
            getNotificationCount();

        badge.textContent =
            count > 0
            ? `(${count})`
            : "";

    }
);
