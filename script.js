/* =========================
   MOBILE MENU
========================= */

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");


menuToggle.addEventListener(
    "click",
    function () {

        navLinks.classList.toggle("active");

    }
);



/* =========================
   REGISTRATION FORM
========================= */

const registrationForm =
    document.getElementById(
        "registrationForm"
    );


const formMessage =
    document.getElementById(
        "formMessage"
    );


registrationForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const playerName =
            document.getElementById(
                "playerName"
            ).value;


        if (playerName.trim() === "") {

            formMessage.textContent =
                "Please enter the player's name.";

            return;

        }


        formMessage.textContent =
            "Thank you! Your registration has been received. We will contact you.";

        formMessage.style.color =
            "green";


        registrationForm.reset();

    }
);