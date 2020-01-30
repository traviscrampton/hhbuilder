(function() {
  var household, ui;

  household = {
    familyMembers: [],

    addToHousehold: function(familyMember) {
      this.familyMembers.push(familyMember);
    },

    removeFromHousehold: function(index) {
      this.familyMembers.splice(index, 1);
    },

    failedFormValidation: function(familyMember) {
      var errors = [];
      var ageError = this.validateAge(familyMember.age);
      var relationshipError = this.validateRelationship(
        familyMember.relationship
      );

      if (ageError) {
        errors.push(ageError);
      }

      if (relationshipError) {
        errors.push(relationshipError);
      }

      return errors;
    },

    validateAge: function(age) {
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
    },

    validateRelationship: function(relationship) {
      if (relationship.length > 0) return;

      return "You must choose a relationship";
    }
  };

  ui = {
    form: document.querySelector("form"),
    debug: document.querySelector(".debug"),
    familyMemberList: document.querySelector(".household"),
    addButton: document.querySelector("button.add"),
    household: household,

    clearForm: function() {
      this.form.elements["age"].value = "";
      this.form.elements["rel"].value = "";
      this.form.elements["smoker"].checked = false;
    },

    alertValidationErrors: function(errorsArr) {
      alert("Error: " + errorsArr.join(", "));
    },

    collectFamilyMemberFormData: function() {
      return {
        age: this.form.elements["age"].value,
        relationship: this.form.elements["rel"].value,
        smoker: this.form.elements["smoker"].checked
      };
    },

    addFamilyMember: function(e) {
      e.preventDefault();
      var familyMember = this.collectFamilyMemberFormData();
      var validationErrors = this.household.failedFormValidation(familyMember);

      if (validationErrors.length > 0) {
        this.alertValidationErrors(validationErrors);
        return;
      }

      this.household.addToHousehold(familyMember);
      this.clearForm();
      this.render();
    },

    removeFamilyMember: function(e) {
      e.preventDefault();
      var deleteButton = e.currentTarget;
      deleteButton.removeEventListener("click", this.removeFamilyMember);

      var index = parseInt(
        deleteButton.parentElement.getAttribute("data-index")
      );

      this.household.removeFromHousehold(index);
      this.render();
    },

    submitHousehold: function(e) {
      e.preventDefault();

      var payload = JSON.stringify(this.household.familyMembers);
      this.debug.innerHTML = payload;
      this.debug.style.display = "block";
    },

    renderFamilyMember: function(familyMember, i) {
      var familyMemberContainer = document.createElement("li");
      familyMemberContainer.setAttribute("data-index", i);

      var age = document.createElement("div");
      age.innerText = "Age: " + familyMember.age;

      var relationship = document.createElement("div");
      relationship.innerText = "Relationship: " + familyMember.relationship;

      var smoker = document.createElement("div");
      smoker.innerText = "Smoker: " + familyMember.smoker;

      var deleteButton = document.createElement("button");
      deleteButton.innerText = "DELETE";
      deleteButton.addEventListener(
        "click",
        this.removeFamilyMember.bind(this)
      );

      var childElements = [age, relationship, smoker, deleteButton];

      for (var i = 0; i < childElements.length; i++) {
        familyMemberContainer.appendChild(childElements[i]);
      }

      return familyMemberContainer;
    },

    render: function() {
      this.familyMemberList.innerHTML = "";

      for (var i = 0; i < this.household.familyMembers.length; i++) {
        this.familyMemberList.appendChild(
          this.renderFamilyMember(this.household.familyMembers[i], i)
        );
      }
    }
  };

  if (ui.form) {
    ui.addButton.addEventListener("click", ui.addFamilyMember.bind(ui));
    ui.form.addEventListener("submit", ui.submitHousehold.bind(ui));
  }

  ui.render();
})();
