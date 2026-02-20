// ---------- ELEMENTS ----------
const fieldGroups = document.querySelectorAll(".field-group");
const inputs = document.querySelectorAll(".input-box");
const generateBtn = document.getElementById("generateBtn");
const output = document.getElementById("output");

const resetBtn = document.getElementById("resetBtn");
const pdfBtn = document.getElementById("downloadPDF");
const docxBtn = document.getElementById("downloadDOCX");

const nameInput = inputs[0];
const jobRoleInput = inputs[1];
const companyInput = inputs[2];
const nameError = fieldGroups[0].querySelector(".error-line");
const jobType = document.getElementById("jobType");

// ---------- HELPERS ----------
function isValidName(name) {
  return /^[A-Za-z\s]+$/.test(name);
}

// ---------- GENERATE ----------
generateBtn.addEventListener("click", () => {
  let valid = true;

  fieldGroups.forEach(group => {
    const input = group.querySelector(".input-box");
    const error = group.querySelector(".error-line");

    if (input.tagName === "SELECT") {
      if (!input.value) {
        error.style.display = "flex";
        valid = false;
      } else {
        error.style.display = "none";
      }
    } else {
      if (!input.value.trim()) {
        error.style.display = "flex";
        valid = false;
      } else {
        error.style.display = "none";
      }
    }
  });

  const nameValue = nameInput.value.trim();
  if (!nameValue || !isValidName(nameValue)) {
    nameError.style.display = "flex";
    valid = false;
  }

  if (!valid) return;

  generateBtn.classList.add("loading");

  setTimeout(() => {
    output.innerText = `Dear Hiring Manager,

I am writing to apply for the ${jobRoleInput.value} position at ${companyInput.value}. With my experience and skills, I believe I would be a valuable addition to your team.

Thank you for your time and consideration.

Sincerely,
${nameValue}`;

    generateBtn.classList.remove("loading");
  }, 1500);
});

// ---------- INPUT BEHAVIOR ----------
inputs.forEach((input, index) => {

  // hide error on typing
  input.addEventListener("input", () => {
    const error = input.closest(".field-group")
      ?.querySelector(".error-line");
    if (error) error.style.display = "none";
  });

  // ENTER → next field
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && inputs[index + 1]) {
      e.preventDefault();
      inputs[index + 1].focus();
    }
  });

  // CAPITALIZATION (first letter only)
  if (input.tagName !== "SELECT") {
    input.addEventListener("blur", () => {
      let value = input.value.trim().toLowerCase();
      if (!value) return;
      input.value = value.charAt(0).toUpperCase() + value.slice(1);
    });
  }
});

// ---------- NAME FIELD ONLY (NO NUMBERS) ----------
nameInput.addEventListener("input", () => {
  nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, "");
});

// ---------- RESET ----------
resetBtn.addEventListener("click", () => {
  inputs.forEach(i => i.value = "");
  document.querySelectorAll(".error-line")
    .forEach(e => e.style.display = "none");

  output.innerText = "Your cover letter will appear here...";
  generateBtn.classList.remove("loading");
});

// ---------- PDF ----------
pdfBtn.addEventListener("click", () => {
  if (!output.innerText.trim()) return alert("Generate first");

  html2pdf(output, {
    filename: "Cover_Letter.pdf",
    html2canvas: { scale: 2 }
  });
});

// ---------- DOCX ----------
docxBtn.addEventListener("click", () => {
  if (!output.innerText.trim()) return alert("Generate first");

  const { Document, Packer, Paragraph, TextRun } = window.docx;
  const paragraphs = output.innerText.split("\n")
    .map(line => new Paragraph({ children: [new TextRun(line)] }));

  const doc = new Document({
    sections: [{ children: paragraphs }]
  });

  Packer.toBlob(doc).then(blob => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Cover_Letter.docx";
    link.click();
    URL.revokeObjectURL(link.href);
  });
});

// ---------- JOB TYPE FIX ----------
jobType.addEventListener("change", () => {
  const error = jobType.closest(".field-group")
    ?.querySelector(".error-line");
  if (jobType.value && error) error.style.display = "none";
});
