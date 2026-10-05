const KEY="ammytechCertificates";
const SETKEY="ammytechSettings";

const GITHUB_USERNAME="ammytechinstitute-web";
const GITHUB_REPOSITORY="ammytechinstitute-web";

const API_URL="https://script.google.com/macros/s/AKfycbwnHXcGldTUg2AmMajb8ZjTah0NSA93fqdq6_UkShj3FoKNVnR-NaHbUywBdDO6VkQmUg/exec";

let photo="";

const defaults={
name:"AMMYTECH COMPUTER INSTITUTE",
address:"Ablowal, Back Side Thapar University, Near Fateh Medical Store",
phone:"9999949313",
email:"ammytechinstitute@gmail.com",
udyam:"UDYAM-PB-17-0130510",
director:"Shankar Baheliya"
};

document.addEventListener("DOMContentLoaded",()=>{

loadSettings();

setDate();

document.getElementById("certificateNumber").value=nextNo();

["totalMarks","marksObtained"].forEach(id=>{

document.getElementById(id).addEventListener("input",calc);

});

document.querySelectorAll(".nav").forEach(x=>{

x.onclick=()=>page(x.dataset.page);

});

document.getElementById("studentPhoto").onchange=readPhoto;

document.getElementById("today").textContent=

new Date().toLocaleDateString(
"en-IN",
{
day:"2-digit",
month:"short",
year:"numeric"
}
);

document.querySelectorAll("#create input,#create select").forEach(x=>{

x.addEventListener("input",preview);

});

preview();

dashboard();

renderRecords();

});

function list(){

try{

return JSON.parse(localStorage.getItem(KEY))||[];

}catch{

return[];

}

}

function settings(){

try{

return{
...defaults,
...JSON.parse(localStorage.getItem(SETKEY)||"{}")
};

}catch{

return defaults;

}

}

function saveList(a){

localStorage.setItem(KEY,JSON.stringify(a));

}

function page(id){

document.querySelectorAll(".page").forEach(x=>

x.classList.remove("active")

);

document.getElementById(id).classList.add("active");

document.querySelectorAll(".nav").forEach(x=>

x.classList.toggle(
"active",
x.dataset.page===id
)

);

document.getElementById("title").textContent={

dashboard:"Dashboard",

create:"Create Certificate",

records:"Certificate Records",

verify:"Verify Certificate",

settings:"Institute Settings"

}[id];

document.querySelector(".sidebar").classList.remove("open");

if(id==="records")renderRecords();

if(id==="dashboard")dashboard();

window.scrollTo(0,0);

}

function newCertificate(){

page("create");

clearForm(false);

}

function setDate(){

let d=new Date();

document.getElementById("issueDate").value=

`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

}

function nextNo(){

let a=list();

let n=1;

while(
a.some(
x=>x.certificateNumber===
`AMMY-CERT-${String(n).padStart(4,"0")}`
)
)n++;

return `AMMY-CERT-${String(n).padStart(4,"0")}`;

}

function calc(){

let t=+v("totalMarks");

let m=+v("marksObtained");

if(!t || m<0 || m>t){

document.getElementById("percentage").value=

m>t?"Invalid":"";

document.getElementById("grade").value=

m>t?"Invalid":"";

preview();

return;

}

let p=m/t*100;

document.getElementById("percentage").value=

p.toFixed(2)+"%";

document.getElementById("grade").value=gr(p);

preview();

}

function gr(p){

return p>=90?"A+":

p>=80?"A":

p>=70?"B+":

p>=60?"B":

p>=50?"C":

p>=40?"D":"F";

}

function v(id){

return document.getElementById(id).value.trim();

}

function readPhoto(e){

let f=e.target.files[0];

if(!f)return;

if(!f.type.startsWith("image/"))

return toast("Please select an image.");

let r=new FileReader();

r.onload=x=>{

photo=x.target.result;

document.getElementById("uploadPhoto").src=photo;

document.getElementById("uploadPhoto").style.display="block";

document.getElementById("uploadText").style.display="none";

document.getElementById("pPhoto").src=photo;

document.getElementById("pPhoto").style.display="block";

document.getElementById("pPhotoText").style.display="none";

};

r.readAsDataURL(f);

}

function getData(){

let t=+v("totalMarks")||0;

let m=+v("marksObtained")||0;

let p=t&&m<=t?m/t*100:0;

return{

certificateNumber:v("certificateNumber"),

admissionNumber:v("admissionNumber"),

issueDate:v("issueDate"),

instituteName:v("instituteName"),

instituteAddress:v("instituteAddress"),

institutePhone:v("institutePhone"),

instituteEmail:v("instituteEmail"),

udyamNumber:v("udyamNumber"),

directorName:v("directorName"),

studentTitle:v("studentTitle"),

studentName:v("studentName"),

fatherName:v("fatherName"),

studentAddress:v("studentAddress"),

studentPhone:v("studentPhone"),

course1:v("course1"),

course2:v("course2"),

course3:v("course3"),

courseDuration:v("courseDuration"),

totalMarks:t,

marksObtained:m,

percentage:p,

grade:gr(p),

photo

};

}

function verificationURL(certificateNumber){

return `https://${GITHUB_USERNAME}.github.io/${GITHUB_REPOSITORY}/verify.html?id=${encodeURIComponent(certificateNumber)}`;

}

function generateQR(certificateNumber){

const box=document.getElementById("qrcode");

if(!box)return;

box.innerHTML="";

if(!certificateNumber)return;

if(typeof QRCode==="undefined"){

box.innerHTML=

"<small>QR library loading...</small>";

return;

}

new QRCode(box,{

text:verificationURL(certificateNumber),

width:72,

height:72,

correctLevel:QRCode.CorrectLevel.M

});

}

function preview(){

let d=getData();

let s=settings();

set("pInstitute",d.instituteName||s.name);

set("pUdyam",d.udyamNumber||s.udyam);

set(
"pStudent",
(d.studentTitle||"Mr.")+" "+
(d.studentName||"STUDENT NAME")
);

set(
"pFather",
d.fatherName||"________________"
);

set("pCourse1",d.course1);

set("pCourse2",d.course2);

set("pCourse3",d.course3);

set(
"pDuration",
d.courseDuration||"____________"
);

set("pTotal",d.totalMarks||0);

set("pObtained",d.marksObtained||0);

set(
"pPercent",
d.totalMarks?
d.percentage.toFixed(2)+"%":
"0%"
);

set(
"pGrade",
d.totalMarks?d.grade:"-"
);

set(
"pCert",
d.certificateNumber||"________"
);

set(
"pAdmission",
d.admissionNumber||"________"
);

set("pDate",date(d.issueDate));

set(
"pDirector",
d.directorName||s.director
);

set(
"pAddress",
d.studentAddress||"Student Address"
);

set(
"pPhone",
d.studentPhone||"________"
);

set(
"pInstituteAddress",
d.instituteAddress||s.address
);

set(
"pInstitutePhone",
d.institutePhone||s.phone
);

set(
"pEmail",
d.instituteEmail||s.email
);

generateQR(d.certificateNumber);

}

function set(id,x){

document.getElementById(id).textContent=x;

}

function date(x){

if(!x)return"________";

let p=x.split("-");

return p.length===3?

`${p[2]}-${p[1]}-${p[0]}`:x;

}

async function saveCertificate(){

let d=getData();

if(!d.studentName||!d.course1)

return toast(
"Student Name and Course 1 are required."
);

if(d.marksObtained>d.totalMarks)

return toast(
"Marks Obtained cannot exceed Total Marks."
);

const sheetData={

certificateNumber:d.certificateNumber,

admissionNumber:d.admissionNumber,

issueDate:d.issueDate,

studentTitle:d.studentTitle,

studentName:d.studentName,

fatherName:d.fatherName,

course1:d.course1,

course2:d.course2,

course3:d.course3,

courseDuration:d.courseDuration,

totalMarks:d.totalMarks,

marksObtained:d.marksObtained,

percentage:d.percentage,

grade:d.grade,

directorName:d.directorName,

status:"VALID",

createdAt:new Date().toISOString()

};

try{

toast("Saving certificate...");

const response=await fetch(
API_URL,
{
method:"POST",
body:JSON.stringify(sheetData)
}
);

const result=await response.json();

if(!result.success){

return toast(
"Google Sheet Error: "+result.message
);

}

}catch(error){

console.error(error);

return toast(
"Certificate Google Sheet me save nahi hua."
);

}

let a=list();

let i=a.findIndex(
x=>x.certificateNumber===
d.certificateNumber
);

if(i>=0)

a[i]=d;

else

a.unshift(d);

saveList(a);

dashboard();

renderRecords();

toast("Certificate saved successfully.");

page("records");

}

function clearForm(confirmIt=true){

if(
confirmIt &&
!confirm("Clear all form data?")
)return;

document.querySelectorAll("#create input").forEach(x=>{

if(!["certificateNumber"].includes(x.id))

x.value="";

});

document.getElementById("studentTitle").value="Mr.";

document.getElementById("certificateNumber").value=nextNo();

setDate();

photo="";

document.getElementById("uploadPhoto").style.display="none";

document.getElementById("uploadText").style.display="block";

document.getElementById("pPhoto").style.display="none";

document.getElementById("pPhotoText").style.display="block";

preview();

}

function dashboard(){

let a=list();

let avg=a.length?

a.reduce((s,x)=>s+x.percentage,0)/a.length:0;

set("sTotal",a.length);

set("sSaved",a.length);

set(
"sAvg",
avg.toFixed(1)+"%"
);

set(
"sTop",
a.filter(
x=>x.grade==="A"||x.grade==="A+"
).length
);

let r=document.getElementById("recent");

r.innerHTML=a.length?

a.slice(0,5).map(x=>`

<div class="recentrow">

<div class="avatar">
${esc(x.studentName[0]||"S")}
</div>

<div>

<b>${esc(x.studentName)}</b>

<small>
${esc(x.course1)}
•
${esc(x.certificateNumber)}
</small>

</div>

<span class="badge">
${x.percentage.toFixed(2)}%
</span>

</div>

`).join("")

:

'<div class="empty">No certificates saved yet.</div>';

}

function renderRecords(){

let q=
(document.getElementById("search")?.value||"")
.toLowerCase();

let a=list().filter(x=>

(
x.studentName+" "+
x.course1+" "+
x.certificateNumber
)
.toLowerCase()
.includes(q)

);

set(
"count",
a.length+" record"+
(a.length!==1?"s":"")
);

document.getElementById("table").innerHTML=

a.length?

a.map(x=>`

<tr>

<td>
<b>${esc(x.certificateNumber)}</b>
</td>

<td>
<b>
${esc(x.studentTitle)}
${esc(x.studentName)}
</b>
<small>
${esc(x.fatherName)}
</small>
</td>

<td>
${esc(x.course1)}
<small>
${esc(x.courseDuration)}
</small>
</td>

<td>
<b>
${x.marksObtained}/${x.totalMarks}
</b>
<small>
${x.percentage.toFixed(2)}%
•
${x.grade}
</small>
</td>

<td>
${date(x.issueDate)}
</td>

<td>

<div class="actions">

<button onclick="edit('${x.certificateNumber}')">
Edit
</button>

<button onclick="printSaved('${x.certificateNumber}')">
Print
</button>

<button onclick="del('${x.certificateNumber}')">
Delete
</button>

</div>

</td>

</tr>

`).join("")

:

'<tr><td colspan="6" class="empty">No certificates found.</td></tr>';

}

function edit(no){

let x=list().find(
a=>a.certificateNumber===no
);

if(!x)return;

page("create");

Object.keys(x).forEach(k=>{

let el=document.getElementById(k);

if(el&&k!=="photo")

el.value=x[k]??"";

});

photo=x.photo||"";

if(photo){

document.getElementById("uploadPhoto").src=photo;

document.getElementById("uploadPhoto").style.display="block";

document.getElementById("uploadText").style.display="none";

document.getElementById("pPhoto").src=photo;

document.getElementById("pPhoto").style.display="block";

document.getElementById("pPhotoText").style.display="none";

}

calc();

preview();

}

function del(no){

if(!confirm("Delete this certificate?"))

return;

saveList(
list().filter(
x=>x.certificateNumber!==no
)
);

renderRecords();

dashboard();

toast("Certificate deleted.");

}

function printSaved(no){

edit(no);

setTimeout(
()=>window.print(),
250
);

}

function printCertificate(){

if(!v("studentName"))

return toast(
"Please enter student name first."
);

window.print();

}

function verify(){

let no=v("verifyNumber").toUpperCase();

let x=list().find(
a=>a.certificateNumber.toUpperCase()===no
);

let r=document.getElementById("verifyResult");

if(!no){

r.innerHTML="";

return;

}

r.innerHTML=x?

`

<div class="ok">

<b>✓ CERTIFICATE VALID</b>

<p>
Certificate No.:
${esc(x.certificateNumber)}
</p>

<p>
Student:
${esc(x.studentTitle)}
${esc(x.studentName)}
</p>

<p>
Father:
${esc(x.fatherName)}
</p>

<p>
Course:
${esc(x.course1)}
</p>

<p>
Result:
${x.percentage.toFixed(2)}%
—
Grade ${x.grade}
</p>

<p>
Issue Date:
${date(x.issueDate)}
</p>

</div>

`

:

`

<div class="bad">

<b>✕ CERTIFICATE NOT FOUND</b>

<p>
No saved record matches this certificate number.
</p>

</div>

`;

}

function loadSettings(){

let s=settings();

setval("setName",s.name);

setval("setDirector",s.director);

setval("setAddress",s.address);

setval("setPhone",s.phone);

setval("setEmail",s.email);

setval("setUdyam",s.udyam);

setval("instituteName",s.name);

setval("instituteAddress",s.address);

setval("institutePhone",s.phone);

setval("instituteEmail",s.email);

setval("udyamNumber",s.udyam);

setval("directorName",s.director);

}

function setval(id,x){

document.getElementById(id).value=x;

}

function saveSettings(){

let s={

name:v("setName")||defaults.name,

director:v("setDirector")||defaults.director,

address:v("setAddress")||defaults.address,

phone:v("setPhone")||defaults.phone,

email:v("setEmail")||defaults.email,

udyam:v("setUdyam")||defaults.udyam

};

localStorage.setItem(
SETKEY,
JSON.stringify(s)
);

loadSettings();

preview();

toast("Institute settings saved.");

}

function toast(x){

let t=document.getElementById("toast");

t.textContent=x;

t.classList.add("show");

clearTimeout(window.tt);

window.tt=setTimeout(
()=>t.classList.remove("show"),
2400
);

}

function esc(x){

return String(x??"").replace(

/[&<>"']/g,

m=>({

"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"

}[m])

);

}

document.getElementById("menu").onclick=()=>{

document.querySelector(".sidebar")
.classList.toggle("open");

};
