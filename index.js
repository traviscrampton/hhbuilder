(function() {
  // initialize buttons
  var addButton = document.querySelector("button.add");
  var form = document.querySelector("form");
  addButton.addEventListener("click", addFamilyMember);
  form.addEventListener("submit", submitForm);

  function clearForm() {
    document.getElementsByName("age")[0].value = "";
    document.getElementsByName("rel")[0].value = "";
    document.getElementsByName("smoker")[0].checked = false;
  }

  // ADD AND REMOVE HOUSEHOLD MEMBERS

  function collectFamilyMemberFormData() {
    return {
      age: document.getElementsByName("age")[0].value,
      relationship: document.getElementsByName("rel")[0].value,
      smoker: document.getElementsByName("smoker")[0].checked
    };
  }

  function addFamilyMember(e) {
    e.preventDefault();
    var submissionData = collectFamilyMemberFormData();
    var validationErrors = failedFormValidation(submissionData);

    if (validationErrors.length > 0) {
      populateValidationErrors(validationErrors);
      return;
    }

    removeValidationErrors();
    clearForm();
    appendFamilyMember(submissionData);
  }

  function removeFamilyMember(e) {
    e.preventDefault();
    var deleteButton = e.currentTarget;
    deleteButton.removeEventListener("click", removeFamilyMember);
    deleteButton.parentElement.remove();
  }

  function appendFamilyMember(submissionData) {
    var familyMemberListItem = createFamilyMemberListItem(submissionData);
    document.querySelector(".household").appendChild(familyMemberListItem);
  }

  // VALIDATIONS

  function failedFormValidation(submissionData) {
    var errors = [];
    var ageError = validateAge(submissionData.age);
    var relationshipError = validateRelationship(submissionData.relationship);

    if (ageError) {
      errors.push(ageError);
    }

    if (relationshipError) {
      errors.push(relationshipError);
    }

    return errors;
  }

  function validateAge(age) {
    if (age === "") {
      return "Age must be filled out";
    }

    if (!Number.isInteger(parseInt(age))) {
      return "Age must be an integer";
    }

    if (parseInt(age) <= 0) {
      return "Age must be greater than 0";
    }

    return false;
  }

  function validateRelationship(relationship) {
    if (relationship.length > 0) return;

    return "You must choose a relationship";
  }

  function removeValidationErrors() {
    var errorContainer = document.getElementById("errorContainer");

    if (errorContainer) {
      errorContainer.remove();
    }
  }

  function populateValidationErrors(errors) {
    var errorMessage = "Error: " + errors.join(", ");
    alert(errorMessage);
  }

  // HTML ELEMENT GENERATORS

  function containerWithDataAttributes(submissionData) {
    var familyMemberListItem = document.createElement("li");
    familyMemberListItem.setAttribute("data-age", submissionData.age);
    familyMemberListItem.setAttribute(
      "data-relationship",
      submissionData.relationship
    );
    familyMemberListItem.setAttribute("data-smoker", submissionData.smoker);
    familyMemberListItem.className = "familyListItem";

    return familyMemberListItem;
  }

  function createFamilyMemberListItem(submissionData) {
    var familyMemberContainer = containerWithDataAttributes(submissionData);

    var age = document.createElement("div");
    age.innerText = "Age: " + submissionData.age;

    var relationship = document.createElement("div");
    relationship.innerText = "Relationship: " + submissionData.relationship;

    var smoker = document.createElement("div");
    smoker.innerText = "Smoker: " + submissionData.smoker;

    var deleteButton = document.createElement("button");
    deleteButton.innerText = "DELETE";
    deleteButton.addEventListener("click", removeFamilyMember);

    var childElements = [age, relationship, smoker, deleteButton];

    for (var i = 0; i < childElements.length; i++) {
      familyMemberContainer.appendChild(childElements[i]);
    }

    return familyMemberContainer;
  }

  // FORM SUBMISSION TO "SERVER"

  function compileFamilyJSON() {
    var payload;
    var listItem;
    var familyMembers = [];
    var listItems = document.querySelectorAll("li.familyListItem");

    for (var i = 0; i < listItems.length; i++) {
      listItem = listItems[i];
      payload = {
        age: listItem.getAttribute("data-age"),
        relationship: listItem.getAttribute("data-relationship"),
        smoker: listItem.getAttribute("data-smoker")
      };
      familyMembers.push(payload);
    }

    return JSON.stringify(familyMembers);
  }

  function submitForm(e) {
    e.preventDefault();
    var familyJSON = compileFamilyJSON();
    var debug = document.querySelector(".debug");
    debug.innerHTML = familyJSON;
    debug.style.display = "block";
  }
})();
