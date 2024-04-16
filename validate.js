//This is all of my validation code that I wrote. I used some W3 schools code to help create my 
//Modal that would open when my other button was clicked and would make my form open and use these
//validations. 

//As you can see, when you submit my from, it will refresh the page so that you can fill out the form
//again. I'm currently going to implement the ability for the form to reload itself inside of the DOM
//without displaying my load screen animation. In my script.js, that's something I've been trying to 
//figure out, but I've been on this code cleanup expedition and making things a lot cleaner and better
//because as you can see, it's quite messy and some things just aren't necessary. But yea, overall
//This was a lot of fun figuring out how to make my form validate things correctly and make sure it's
//checking fields correct. It was also really nice to learn regex more and apply it to this, it felt like
//this really helped me learn and apply regex and understand it more.

document.addEventListener('DOMContentLoaded', function() {
    const myForm = document.getElementById('validateForm');

    document.getElementById("submit").addEventListener("click", function(event) {
        const isValid = checkForm();
        event.preventDefault();

        if(isValid){
            console.log("FORM IS VALID... SUBMITTING");
            document.getElementById('thankYouMessage').style.display = 'block';
            myForm.remove();      
        }else{
            console.log("FORM IS INVALID.");
        }
    });
});
  
function checkForm() {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const addressInput = document.getElementById('address');
    const cityInput  = document.getElementById('city');
    const stateInput  = document.getElementById('state');
    const zipInput  = document.getElementById('zip');
    const phoneNumberInput  = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('email');
    const commentsInput = document.getElementById('comments');
    const formErrorsDiv = document.getElementById('formErrors');
    const myForm = document.getElementById('validateForm');
    const errorMessages = [];

    //Reset my error styles when they don't fill something in
    firstNameInput.classList.remove('error');
    lastNameInput.classList.remove('error');
    addressInput.classList.remove('error');
    cityInput.classList.remove('error');
    stateInput.classList.remove('error');
    zipInput.classList.remove('error');
    phoneNumberInput.classList.remove('error');
    emailInput.classList.remove('error');
    
    // Perform validations
    validateFirstAndLastName(firstNameInput, lastNameInput, errorMessages);
    validateAddress(addressInput, errorMessages);
    validateCity(cityInput, errorMessages);
    validateState(stateInput, errorMessages);
    validateZip(zipInput, errorMessages);
    validatePhone(phoneNumberInput, errorMessages);
    validateEmail(emailInput, errorMessages); 
    validateCheckbox(errorMessages);
    userAdditionalComments(commentsInput);
    displayFormErrors(errorMessages, formErrorsDiv);

    return errorMessages.length === 0;
};

function validateFirstAndLastName(firstNameInput, lastNameInput, errorMessages){
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    if(firstName === ''){
        errorMessages.push("First name can't be blank.");
        firstNameInput.classList.add('error');
    }
    if(firstName === lastName){
        errorMessages.push("First and Last name can't match.");
        firstNameInput.classList.add('error');
        lastNameInput.classList.add('error');
    }
    if(lastName === ''){
        errorMessages.push("Last name can't be blank.");
        firstNameInput.classList.add('error');
    }
};

function validateAddress(addressInput, errorMessages){
    const address = addressInput.value.trim();
    if(address === ''){
        errorMessages.push("Please input a valid street address.");
        addressInput.classList.add('error');
    }
};

function validateCity(cityInput, errorMessages){
    const city = cityInput.value.trim();
    if(city === ''){
        errorMessages.push("City can't be blank");
        cityInput.classList.add('error');
    }
};

function validateState(stateInput, errorMessages){
    const state = stateInput.value.trim();
    const validStates = 
    [
    'AL', 'AK', 'AZ', 'AR', 'CA', 
    'CO', 'CT', 'DE', 'FL', 'GA', 
    'HI', 'ID', 'IL', 'IN', 'IA', 
    'KS', 'KY', 'LA', 'ME', 'MD', 
    'MA', 'MI', 'MN', 'MS', 'MO', 
    'MT', 'NE', 'NV', 'NH', 'NJ', 
    'NM', 'NY', 'NC', 'ND', 'OH', 
    'OK', 'OR', 'PA', 'RI', 'SC', 
    'SD', 'TN', 'TX', 'UT', 'VT', 
    'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    if (!validStates.includes(state)) {
        errorMessages.push("Please choose a valid state within the US.");
        stateInput.classList.add('error');
    }
};

function validateZip(zipInput, errorMessages){
    const zip = zipInput.value.trim();
    const zipPattern = /^\d{5}$/;
    if(!zipPattern.test(zip)){
        errorMessages.push('Invalid ZIP/Postal Code.');
        zipInput.classList.add('error');
    }
};

function validatePhone(phoneNumberInput, errorMessages){
    const phoneNumber = phoneNumberInput.value.trim();
    const phoneNumberPattern = /^\d{10}$/;
    const phoneNumberDelim = phoneNumber.replace(/\D/g, '');
    if(!phoneNumberPattern.test(phoneNumberDelim)){
        errorMessages.push("Missing a valid phone number.");
        phoneNumberInput.classList.add('error');
    }
};

function validateEmail(emailInput, errorMessages){
    const email = emailInput.value.trim();
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if(!emailPattern.test(email)) {
        errorMessages.push("Invalid or missing email address.");
        emailInput.classList.add('error');
    }
};

function validateCheckbox(errorMessages){  
    const checkboxInputs = document.getElementsByName('check');
    let isChecked = false;

    for(let i = 0; i < checkboxInputs.length; i++) {
        if(checkboxInputs[i].checked) {
            isChecked = true;
            break;
        }
    }

    if (!isChecked) {
        errorMessages.push("At least one checkbox needs to be checked.");
        
        // Loop through checkboxInputs and add 'error' class to each unchecked checkbox
        for (let i = 0; i < checkboxInputs.length; i++) {
            if(!checkboxInputs[i].checked) {
                checkboxInputs[i].classList.add('error');
            } else {
                // Remove 'error' class if previously added
                checkboxInputs[i].classList.remove('error'); 
            }
        }
    } else {
        // Remove 'error' class from all checkboxes if at least one is checked
        for(let i = 0; i < checkboxInputs.length; i++) {
            checkboxInputs[i].classList.remove('error');
        }
    }
};

function userAdditionalComments(commentsInput){
    console.log(commentsInput.value);
};

function displayFormErrors(errorMessages, formErrorsDiv){
    if(errorMessages.length > 0) {
        formErrorsDiv.innerHTML = '<ul>' + errorMessages.map(msg => `<li>${msg}</li>`).join('') + '</ul>';
        formErrorsDiv.classList.remove('hide');
    } else {
        formErrorsDiv.classList.add('hide');
    }
};
