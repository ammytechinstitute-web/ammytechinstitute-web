/* =========================================================
   AMMYTECH COMPUTER INSTITUTE
   FINAL CERTIFICATE GENERATOR
   GOOGLE SHEET + QR VERIFICATION
   ========================================================= */


const CERTIFICATE_KEY = "ammytechCertificates";


/* GOOGLE APPS SCRIPT */
const API_URL =
"https://script.google.com/macros/s/AKfycbwnHXcGldTUg2AmMajb8ZjTah0NSA93fqdq6_UkShj3FoKNVnR-NaHbUywBdDO6VkQmUg/exec";


/* GITHUB PAGES */
const VERIFY_PAGE =
"https://ammytechinstitute-web.github.io/ammytechinstitute-web/verify.html";


let selectedPhoto = "";


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    setToday();

    document.getElementById("certificateNumber").value =
        generateCertificateNumber();

    document.getElementById("totalMarks")
        .addEventListener("input", calculateMarks);

    document.getElementById("marksObtained")
        .addEventListener("input", calculateMarks);

    document.getElementById("studentPhoto")
        .addEventListener("change", handlePhoto);

});


/* =========================================================
   TODAY DATE
   ========================================================= */

function setToday() {

    const today = new Date();

    const year = today.getFullYear();
    const month =
        String(today.getMonth() + 1).padStart(2, "0");
    const day =
        String(today.getDate()).padStart(2, "0");

    document.getElementById("issueDate").value =
        `${year}-${month}-${day}`;
}


/* =========================================================
   CERTIFICATE NUMBER
   ========================================================= */

function generateCertificateNumber() {

    const certificates = getCertificates();

    let highest = 0;

    certificates.forEach(cert => {

        const match =
            String(cert.certificateNumber || "")
            .match(/AMMY-CERT-(\d+)/i);

        if (match) {

            highest =
                Math.max(highest, Number(match[1]));

        }

    });


    /* Rahul test certificate already exists in Sheet */
    if (highest < 1) {
        highest = 1;
    }


    return "AMMY-CERT-" +
        String(highest + 1).padStart(4, "0");
}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function getCertificates() {

    try {

        return JSON.parse(
            localStorage.getItem(CERTIFICATE_KEY)
        ) || [];

    } catch (error) {

        return [];

    }
}


function saveLocalCertificate(data) {

    const certificates =
        getCertificates();

    const index =
        certificates.findIndex(
            cert =>
                cert.certificateNumber ===
                data.certificateNumber
        );


    if (index >= 0) {

        certificates[index] = data;

    } else {

        certificates.push(data);

    }


    localStorage.setItem(
        CERTIFICATE_KEY,
        JSON.stringify(certificates)
    );
}


/* =========================================================
   MARKS
   ========================================================= */

function getGrade(percentage) {

    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";

    return "F";
}


function calculateMarks() {

    const total =
        Number(
            document.getElementById("totalMarks").value
        );

    const obtained =
        Number(
            document.getElementById("marksObtained").value
        );


    if (!total || total <= 0) {

        document.getElementById("percentage").value = "";
        document.getElementById("grade").value = "";

        return;
    }


    if (obtained > total) {

        document.getElementById("percentage").value =
            "Invalid";

        document.getElementById("grade").value =
            "Invalid";

        return;
    }


    const percentage =
        (obtained / total) * 100;


    document.getElementById("percentage").value =
        percentage.toFixed(2) + "%";

    document.getElementById("grade").value =
        getGrade(percentage);
}


/* =========================================================
   PHOTO
   ========================================================= */

function handlePhoto(event) {

    const file =
        event.target.files[0];


    if (!file) {

        selectedPhoto = "";

        document.getElementById("photoName").textContent =
            "No photo selected";

        return;
    }


    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        event.target.value = "";

        return;
    }


    const reader =
        new FileReader();


    reader.onload = function (e) {

        selectedPhoto =
            e.target.result;

        document.getElementById("photoName").textContent =
            file.name;

    };


    reader.readAsDataURL(file);
}


/* =========================================================
   FORM DATA
   ========================================================= */

function getFormData() {

    const totalMarks =
        Number(
            document.getElementById("totalMarks").value
        ) || 0;


    const marksObtained =
        Number(
            document.getElementById("marksObtained").value
        ) || 0;


    let percentage = 0;


    if (totalMarks > 0) {

        percentage =
            (marksObtained / totalMarks) * 100;

    }


    return {

        instituteName:
            document.getElementById("instituteName").value.trim(),

        instituteAddress:
            document.getElementById("instituteAddress").value.trim(),

        institutePhone:
            document.getElementById("institutePhone").value.trim(),

        instituteEmail:
            document.getElementById("instituteEmail").value.trim(),

        udyamNumber:
            document.getElementById("udyamNumber").value.trim(),

        certificateNumber:
            document.getElementById("certificateNumber").value.trim(),

        admissionNumber:
            document.getElementById("admissionNumber").value.trim(),

        issueDate:
            document.getElementById("issueDate").value,

        studentTitle:
            document.getElementById("studentTitle").value,

        studentName:
            document.getElementById("studentName").value.trim(),

        fatherName:
            document.getElementById("fatherName").value.trim(),

        course1:
            document.getElementById("course1").value.trim(),

        course2:
            document.getElementById("course2").value.trim(),

        course3:
            document.getElementById("course3").value.trim(),

        courseDuration:
            document.getElementById("courseDuration").value.trim(),

        totalMarks:
            totalMarks,

        marksObtained:
            marksObtained,

        percentage:
            Number(percentage.toFixed(2)),

        grade:
            getGrade(percentage),

        directorName:
            document.getElementById("directorName").value.trim(),

        photo:
            selectedPhoto

    };
}


/* =========================================================
   GENERATE CERTIFICATE
   ========================================================= */

function generateCertificate() {

    const data =
        getFormData();


    if (!data.studentName) {

        alert("Please enter Student Name.");

        document.getElementById("studentName").focus();

        return;

    }


    if (!data.course1) {

        alert("Please enter at least one Course.");

        document.getElementById("course1").focus();

        return;

    }


    if (
        data.marksObtained >
        data.totalMarks
    ) {

        alert(
            "Marks Obtained cannot be greater than Total Marks."
        );

        return;

    }


    if (!data.certificateNumber) {

        data.certificateNumber =
            generateCertificateNumber();

        document.getElementById("certificateNumber").value =
            data.certificateNumber;

    }


    /* CERTIFICATE DATA */

    document.getElementById("certInstituteName").textContent =
        data.instituteName ||
        "AMMYTECH COMPUTER INSTITUTE";


    document.getElementById("certUdyam").textContent =
        data.udyamNumber ||
        "UDYAM-PB-17-0130510";


    document.getElementById("certStudentName").textContent =
        `${data.studentTitle} ${data.studentName}`;


    document.getElementById("certFatherName").textContent =
        data.fatherName ||
        "________________";


    document.getElementById("certCourse1").textContent =
        data.course1;


    document.getElementById("certCourse2").textContent =
        data.course2;


    document.getElementById("certCourse3").textContent =
        data.course3;


    document.getElementById("certDuration").textContent =
        data.courseDuration ||
        "________________";


    document.getElementById("certTotalMarks").textContent =
        data.totalMarks;


    document.getElementById("certMarksObtained").textContent =
        data.marksObtained;


    document.getElementById("certPercentage").textContent =
        data.percentage.toFixed(2) + "%";


    document.getElementById("certGrade").textContent =
        data.grade;


    document.getElementById("certNumber").textContent =
        data.certificateNumber;


    document.getElementById("certAdmission").textContent =
        data.admissionNumber ||
        "________________";


    document.getElementById("certIssueDate").textContent =
        formatDate(data.issueDate);


    document.getElementById("certDirector").textContent =
        data.directorName ||
        "Shankar Baheliya";


    document.getElementById("certAddress").textContent =
        data.instituteAddress;


    document.getElementById("certPhone").textContent =
        data.institutePhone;


    document.getElementById("certEmail").textContent =
        data.instituteEmail;


    /* PHOTO */

    const photo =
        document.getElementById("certPhoto");

    const photoText =
        document.getElementById("photoText");


    if (data.photo) {

        photo.src =
            data.photo;

        photo.style.display =
            "block";

        photoText.style.display =
            "none";

    } else {

        photo.src = "";

        photo.style.display =
            "none";

        photoText.style.display =
            "block";

    }


    /* QR */

    generateQRCode(
        data.certificateNumber
    );


    alert(
        "Certificate generated successfully!"
    );


    document.getElementById("certificate")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

}


/* =========================================================
   QR CODE
   ========================================================= */

function generateQRCode(certificateNumber) {

    const qr =
        document.getElementById("qrcode");


    qr.innerHTML = "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        qr.innerHTML =
            "<small>QR unavailable</small>";

        return;

    }


    const verificationURL =
        VERIFY_PAGE +
        "?id=" +
        encodeURIComponent(
            certificateNumber
        );


    new QRCode(qr, {

        text: verificationURL,

        width: 85,

        height: 85,

        correctLevel:
            QRCode.CorrectLevel.M

    });

}


/* =========================================================
   DATE
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "________________";

    }


    const parts =
        dateString.split("-");


    if (parts.length !== 3) {

        return dateString;

    }


    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}


/* =========================================================
   SAVE TO GOOGLE SHEET
   ========================================================= */

async function saveCertificate() {

    const data =
        getFormData();


    if (!data.studentName) {

        alert(
            "Please generate the certificate first."
        );

        return;

    }


    if (!data.certificateNumber) {

        alert(
            "Certificate Number is required."
        );

        return;

    }


    if (
        data.marksObtained >
        data.totalMarks
    ) {

        alert(
            "Marks Obtained cannot be greater than Total Marks."
        );

        return;

    }


    const sheetData = {

        certificateNumber:
            data.certificateNumber,

        admissionNumber:
            data.admissionNumber,

        issueDate:
            data.issueDate,

        studentTitle:
            data.studentTitle,

        studentName:
            data.studentName,

        fatherName:
            data.fatherName,

        course1:
            data.course1,

        course2:
            data.course2,

        course3:
            data.course3,

        courseDuration:
            data.courseDuration,

        totalMarks:
            data.totalMarks,

        marksObtained:
            data.marksObtained,

        percentage:
            data.percentage,

        grade:
            data.grade,

        directorName:
            data.directorName,

        status:
            "VALID",

        createdAt:
            new Date().toISOString()

    };


    try {

        alert(
            "Certificate Google Sheet mein save ho raha hai..."
        );


        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    body:
                        JSON.stringify(sheetData)
                }
            );


        const result =
            await response.json();


        if (!result.success) {

            alert(
                "Google Sheet Error:\n\n" +
                result.message
            );

            return;

        }


        /* LOCAL BACKUP */

        saveLocalCertificate(data);


        /* QR */

        generateQRCode(
            data.certificateNumber
        );


        alert(
            "Certificate successfully saved!\n\n" +
            "Certificate No.: " +
            data.certificateNumber
        );


    } catch (error) {

        console.error(error);

        alert(
            "Certificate Google Sheet mein save nahi hua.\n\n" +
            "Apps Script deployment check karein."
        );

    }

}


/* =========================================================
   PRINT
   ========================================================= */

function printCertificate() {

    const studentName =
        document.getElementById("studentName")
            .value.trim();


    if (!studentName) {

        alert(
            "Please generate a certificate first."
        );

        return;

    }


    window.print();

}


/* =========================================================
   ONLINE VERIFICATION
   ========================================================= */

async function verifyCertificate() {

    const number =
        document.getElementById("verifyNumber")
            .value
            .trim()
            .toUpperCase();


    const result =
        document.getElementById("verifyResult");


    if (!number) {

        result.textContent =
            "Please enter Certificate Number.";

        result.style.color =
            "#dc3545";

        return;

    }


    result.textContent =
        "Checking certificate...";

    result.style.color =
        "#0b5ed7";


    try {

        const response =
            await fetch(
                API_URL +
                "?id=" +
                encodeURIComponent(number)
            );


        const data =
            await response.json();


        if (
            data.success &&
            data.certificate
        ) {

            const cert =
                data.certificate;


            result.innerHTML = `
                <div class="verification-success">
                    ✓ CERTIFICATE STATUS: VALID
                    <br><br>
                    <strong>${escapeHTML(cert.StudentName)}</strong>
                    <br>
                    Certificate No.: ${escapeHTML(cert.CertificateNumber)}
                    <br>
                    Course: ${escapeHTML(cert.Course1)}
                </div>
            `;

            result.style.color =
                "#198754";

        } else {

            result.textContent =
                "✕ CERTIFICATE STATUS: NOT VALID";

            result.style.color =
                "#dc3545";

        }


    } catch (error) {

        console.error(error);

        result.textContent =
            "Verification service unavailable.";

        result.style.color =
            "#dc3545";

    }

}


/* =========================================================
   CLEAR
   ========================================================= */

function clearForm() {

    const answer =
        confirm(
            "Are you sure you want to clear the form?"
        );


    if (!answer) {
        return;
    }


    document.getElementById("studentTitle").value =
        "Mr.";


    document.getElementById("studentName").value =
        "";


    document.getElementById("fatherName").value =
        "";


    document.getElementById("course1").value =
        "";


    document.getElementById("course2").value =
        "";


    document.getElementById("course3").value =
        "";


    document.getElementById("courseDuration").value =
        "";


    document.getElementById("totalMarks").value =
        "";


    document.getElementById("marksObtained").value =
        "";


    document.getElementById("percentage").value =
        "";


    document.getElementById("grade").value =
        "";


    document.getElementById("admissionNumber").value =
        "";


    document.getElementById("certificateNumber").value =
        generateCertificateNumber();


    setToday();


    document.getElementById("studentPhoto").value =
        "";


    selectedPhoto = "";


    document.getElementById("photoName").textContent =
        "No photo selected";


    document.getElementById("qrcode").innerHTML =
        "";


    alert("Form cleared.");

}


/* =========================================================
   SECURITY / HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}