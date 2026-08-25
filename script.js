/* =========================
   GOOGLE APPS SCRIPT URL
========================= */

const REGISTRATION_URL =
    "https://script.google.com/macros/s/AKfycbxRetOrMLrF1kFQHbJS-0CCbmKPyX-PIbk88TeSJ0zo1Lm99kq-NrWaxb-oDLOxZAoL/exec";


/* =========================
   MOBILE MENU
========================= */

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");


if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        function () {

            navLinks.classList.toggle("active");

        }
    );

}


/* =========================
   REGISTRATION ELEMENTS
========================= */

const registrationForm =
    document.getElementById("registrationForm");

const formMessage =
    document.getElementById("formMessage");


/* =========================
   REGISTRATION FORM
========================= */

if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =========================
               GET FORM DATA
            ========================= */

            const playerName =
                document.getElementById("playerName").value.trim();

            const dateOfBirth =
                document.getElementById("dateOfBirth").value;

            const parentName =
                document.getElementById("parentName").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const position =
                document.getElementById("position").value;

            const message =
                document.getElementById("message").value.trim();


            /* =========================
               VALIDATION
            ========================= */

            if (
                !playerName ||
                !dateOfBirth ||
                !parentName ||
                !phone
            ) {

                showMessage(
                    "Please fill in all required fields.",
                    "red"
                );

                return;

            }


            const submitButton =
                registrationForm.querySelector(
                    "button[type='submit']"
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "CHECKING...";

            }


            /* =========================
               CHECK GOOGLE SHEET
            ========================= */

            try {

                const existingPlayer =
                    await checkExistingPlayer(
                        phone,
                        email
                    );


                /* =========================
                   PLAYER ALREADY EXISTS
                ========================= */

                if (existingPlayer.exists) {

                    showMessage(

                        "This player has already registered with Eagle Talon Football Academy. " +
                        "Application status: " +
                        existingPlayer.status,

                        "red"

                    );


                    registrationForm.style.display =
                        "none";


                    return;

                }


                /* =========================
                   NEW PLAYER
                ========================= */

                if (submitButton) {

                    submitButton.textContent =
                        "SUBMITTING...";

                }


                const formData = {

                    playerName: playerName,

                    dateOfBirth: dateOfBirth,

                    parentName: parentName,

                    phone: phone,

                    email: email,

                    position: position,

                    message: message

                };


                /* =========================
                   SEND TO GOOGLE APPS SCRIPT
                ========================= */

                await fetch(
                    REGISTRATION_URL,
                    {

                        method: "POST",

                        mode: "no-cors",

                        headers: {

                            "Content-Type":
                                "text/plain;charset=utf-8"

                        },

                        body:
                            JSON.stringify(formData)

                    }
                );


                /* =========================
                   SUCCESS MESSAGE
                ========================= */

                showMessage(

                    "Registration submitted successfully! " +
                    "Your application is now Pending. " +
                    "The Eagle Talon coaching team will review it.",

                    "green"

                );


                /* =========================
                   HIDE FORM
                ========================= */

                registrationForm.style.display =
                    "none";


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                showMessage(

                    "There was a problem submitting the registration. " +
                    "Please check your internet connection and try again.",

                    "red"

                );

            }


            /* =========================
               RESTORE BUTTON
            ========================= */

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    "SUBMIT REGISTRATION";

            }

        }
    );

}


/* =========================
   CHECK EXISTING PLAYER
========================= */

function checkExistingPlayer(
    phone,
    email
) {

    return new Promise(
        function (resolve) {

            const callbackName =
                "eagleTalonCallback_" +
                Date.now();


            const script =
                document.createElement("script");


            const params =
                new URLSearchParams({

                    action: "check",

                    phone: phone,

                    email: email,

                    callback: callbackName

                });


            let completed = false;


            /* =========================
               GOOGLE APPS SCRIPT RESPONSE
            ========================= */

            window[callbackName] =
                function (result) {

                    if (completed) {
                        return;
                    }

                    completed = true;

                    cleanup();

                    resolve(result);

                };


            /* =========================
               REQUEST ERROR
            ========================= */

            script.onerror =
                function () {

                    if (completed) {
                        return;
                    }

                    completed = true;

                    cleanup();

                    resolve({

                        exists: false

                    });

                };


            script.src =
                REGISTRATION_URL +
                "?" +
                params.toString();


            document.body.appendChild(
                script
            );


            /* =========================
               CLEANUP
            ========================= */

            function cleanup() {

                if (script.parentNode) {

                    script.parentNode.removeChild(
                        script
                    );

                }


                delete window[
                    callbackName
                ];

            }


            /* =========================
               SAFETY TIMEOUT
            ========================= */

            setTimeout(

                function () {

                    if (completed) {
                        return;
                    }

                    completed = true;

                    cleanup();

                    resolve({

                        exists: false

                    });

                },

                10000

            );

        }
    );

}


/* =========================
   SHOW MESSAGE
========================= */

function showMessage(
    message,
    color
) {

    if (!formMessage) {
        return;
    }


    formMessage.textContent =
        message;


    formMessage.style.color =
        color;


    formMessage.style.display =
        "block";


    formMessage.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}
