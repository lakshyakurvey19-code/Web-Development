/**
 * NexusID Modern Multi-Step Registration System
 * Pure Vanilla JavaScript ES6+
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // DOM Elements
  // --------------------------------------------------------------------------
  const registrationForm = document.getElementById('registrationForm');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const themeToggle = document.getElementById('themeToggle');
  const draftStatus = document.getElementById('draftStatus');
  const stepperProgressBar = document.getElementById('stepperProgressBar');
  const stepItems = document.querySelectorAll('.step-item');
  const formSteps = document.querySelectorAll('.form-step');

  // Input Fields - Step 1
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const dobInput = document.getElementById('dob');

  // Input Fields - Step 2
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const reqLength = document.getElementById('reqLength');
  const reqUpper = document.getElementById('reqUpper');
  const reqLower = document.getElementById('reqLower');
  const reqNumber = document.getElementById('reqNumber');
  const reqSymbol = document.getElementById('reqSymbol');

  // Step 3 Elements
  const avatarInput = document.getElementById('avatarInput');
  const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
  const removeAvatarBtn = document.getElementById('removeAvatarBtn');
  const avatarImage = document.getElementById('avatarImage');
  const avatarSection = document.querySelector('.avatar-section');
  const presetImgs = document.querySelectorAll('.preset-img');
  const roleCards = document.querySelectorAll('.role-card');
  const tagPills = document.querySelectorAll('.interest-pill');
  const termsCheck = document.getElementById('termsCheck');
  const openTermsModalLink = document.getElementById('openTermsModalLink');
  const openPrivacyModalLink = document.getElementById('openPrivacyModalLink');

  // Modals
  const successModal = document.getElementById('successModal');
  const closeSuccessModal = document.getElementById('closeSuccessModal');
  const continueToDashboardBtn = document.getElementById('continueToDashboardBtn');
  const createAnotherBtn = document.getElementById('createAnotherBtn');

  const termsModal = document.getElementById('termsModal');
  const closeTermsModal = document.getElementById('closeTermsModal');
  const declineTermsBtn = document.getElementById('declineTermsBtn');
  const acceptTermsBtn = document.getElementById('acceptTermsBtn');

  // Summary Elements inside Success Modal
  const summaryAvatar = document.getElementById('summaryAvatar');
  const summaryName = document.getElementById('summaryName');
  const summaryUsername = document.getElementById('summaryUsername');
  const summaryRole = document.getElementById('summaryRole');
  const summaryEmail = document.getElementById('summaryEmail');
  const summaryPhone = document.getElementById('summaryPhone');
  const summaryInterests = document.getElementById('summaryInterests');

  const toastContainer = document.getElementById('toastContainer');
  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  // --------------------------------------------------------------------------
  // Application State
  // --------------------------------------------------------------------------
  let currentStep = 1;
  const totalSteps = 3;
  let currentAvatarUrl = DEFAULT_AVATAR;

  // --------------------------------------------------------------------------
  // Theme Management (Dark / Light)
  // --------------------------------------------------------------------------
  const initTheme = () => {
    const savedTheme = localStorage.getItem('nexus_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  };

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nexus_theme', newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  });

  // --------------------------------------------------------------------------
  // Stepper & Navigation Functions
  // --------------------------------------------------------------------------
  const updateStepper = (step) => {
    // Update progress track bar percentage
    const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;
    stepperProgressBar.style.width = `${progressPercentage}%`;

    // Update step circles and labels
    stepItems.forEach((item) => {
      const itemStep = parseInt(item.getAttribute('data-step'), 10);
      item.classList.remove('active', 'completed');

      if (itemStep === step) {
        item.classList.add('active');
      } else if (itemStep < step) {
        item.classList.add('completed');
      }
    });

    // Toggle form steps visibility
    formSteps.forEach((stepPane, index) => {
      if (index + 1 === step) {
        stepPane.classList.add('active');
      } else {
        stepPane.classList.remove('active');
      }
    });

    // Toggle button visibility
    if (step === 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    } else if (step === totalSteps) {
      prevBtn.style.display = 'inline-flex';
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
    } else {
      prevBtn.style.display = 'inline-flex';
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }

    // Scroll to top of the card smoothly
    document.querySelector('.registration-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // --------------------------------------------------------------------------
  // Validation Helpers
  // --------------------------------------------------------------------------
  const setError = (input, message) => {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    formGroup.classList.remove('has-success');
    formGroup.classList.add('has-error');
    const errorEl = formGroup.querySelector('.error-msg');
    if (errorEl) {
      errorEl.textContent = message;
    }
  };

  const setSuccess = (input) => {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    formGroup.classList.remove('has-error');
    formGroup.classList.add('has-success');
    const errorEl = formGroup.querySelector('.error-msg');
    if (errorEl) {
      errorEl.textContent = '';
    }
  };

  const clearValidation = (input) => {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    formGroup.classList.remove('has-error', 'has-success');
    const errorEl = formGroup.querySelector('.error-msg');
    if (errorEl) {
      errorEl.textContent = '';
    }
  };

  // Specific Field Validators
  const validateFullName = () => {
    const value = fullNameInput.value.trim();
    if (!value) {
      setError(fullNameInput, 'Full name is required');
      return false;
    }
    if (value.length < 3) {
      setError(fullNameInput, 'Name must be at least 3 characters long');
      return false;
    }
    if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
      setError(fullNameInput, 'Name can only contain letters, spaces, and hyphens');
      return false;
    }
    setSuccess(fullNameInput);
    return true;
  };

  const validateEmail = () => {
    const value = emailInput.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) {
      setError(emailInput, 'Email address is required');
      return false;
    }
    if (!emailRegex.test(value)) {
      setError(emailInput, 'Please enter a valid email address');
      return false;
    }
    setSuccess(emailInput);
    return true;
  };

  const validatePhone = () => {
    const value = phoneInput.value.trim();
    // Allow standard international/local phone formats (+1 (555) 123-4567, 9876543210, etc.)
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
    if (!value) {
      setError(phoneInput, 'Phone number is required');
      return false;
    }
    if (!phoneRegex.test(value)) {
      setError(phoneInput, 'Please enter a valid phone number (min 7 digits)');
      return false;
    }
    setSuccess(phoneInput);
    return true;
  };

  const validateDOB = () => {
    const value = dobInput.value;
    if (!value) {
      setError(dobInput, 'Date of birth is required');
      return false;
    }
    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      setError(dobInput, 'You must be at least 13 years old to register');
      return false;
    }
    if (age > 120) {
      setError(dobInput, 'Please enter a valid birth year');
      return false;
    }
    setSuccess(dobInput);
    return true;
  };

  const validateUsername = () => {
    const value = usernameInput.value.trim().toLowerCase();
    const usernameRegex = /^[a-z0-9_]{4,20}$/;
    if (!value) {
      setError(usernameInput, 'Username is required');
      return false;
    }
    if (value.length < 4) {
      setError(usernameInput, 'Username must be at least 4 characters');
      return false;
    }
    if (!usernameRegex.test(value)) {
      setError(usernameInput, 'Only lowercase letters, numbers, and underscores allowed');
      return false;
    }
    setSuccess(usernameInput);
    return true;
  };

  // Password Strength Evaluation
  const evaluatePassword = () => {
    const pwd = passwordInput.value;
    
    // Check individual criteria
    const hasLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[^A-Za-z0-9]/.test(pwd);

    // Update UI Badges
    reqLength.classList.toggle('met', hasLength);
    reqUpper.classList.toggle('met', hasUpper);
    reqLower.classList.toggle('met', hasLower);
    reqNumber.classList.toggle('met', hasNumber);
    reqSymbol.classList.toggle('met', hasSymbol);

    let score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;

    // Reset strength classes
    strengthBar.className = 'strength-bar';

    if (!pwd) {
      strengthText.textContent = 'None';
      strengthText.style.color = 'var(--text-muted)';
      strengthBar.style.width = '0%';
      clearValidation(passwordInput);
      return false;
    }

    if (score <= 2) {
      strengthText.textContent = 'Weak';
      strengthText.style.color = 'var(--danger)';
      strengthBar.classList.add('strength-weak');
      setError(passwordInput, 'Password is too weak');
      return false;
    } else if (score === 3) {
      strengthText.textContent = 'Fair';
      strengthText.style.color = 'var(--warning)';
      strengthBar.classList.add('strength-fair');
      setSuccess(passwordInput);
      return true;
    } else if (score === 4) {
      strengthText.textContent = 'Good';
      strengthText.style.color = '#38bdf8';
      strengthBar.classList.add('strength-good');
      setSuccess(passwordInput);
      return true;
    } else {
      strengthText.textContent = 'Strong';
      strengthText.style.color = 'var(--success)';
      strengthBar.classList.add('strength-strong');
      setSuccess(passwordInput);
      return true;
    }
  };

  const validateConfirmPassword = () => {
    const pwd = passwordInput.value;
    const confirmPwd = confirmPasswordInput.value;

    if (!confirmPwd) {
      setError(confirmPasswordInput, 'Please confirm your password');
      return false;
    }
    if (pwd !== confirmPwd) {
      setError(confirmPasswordInput, 'Passwords do not match');
      return false;
    }
    setSuccess(confirmPasswordInput);
    return true;
  };

  const validateTerms = () => {
    const termsGroup = termsCheck.closest('.form-group');
    const termsError = document.getElementById('termsError');
    if (!termsCheck.checked) {
      termsGroup.classList.add('has-error');
      termsError.textContent = 'You must accept the Terms of Service to continue';
      return false;
    }
    termsGroup.classList.remove('has-error');
    termsError.textContent = '';
    return true;
  };

  // Step Validator Dispatcher
  const validateStep = (step) => {
    if (step === 1) {
      const isNameValid = validateFullName();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();
      const isDobValid = validateDOB();
      return isNameValid && isEmailValid && isPhoneValid && isDobValid;
    } else if (step === 2) {
      const isUserValid = validateUsername();
      const isPwdValid = evaluatePassword();
      const isConfirmValid = validateConfirmPassword();
      return isUserValid && isPwdValid && isConfirmValid;
    } else if (step === 3) {
      return validateTerms();
    }
    return true;
  };

  // --------------------------------------------------------------------------
  // Real-Time Event Listeners for Inputs
  // --------------------------------------------------------------------------
  fullNameInput.addEventListener('input', () => {
    validateFullName();
    saveDraft();
  });
  emailInput.addEventListener('input', () => {
    validateEmail();
    saveDraft();
  });
  phoneInput.addEventListener('input', () => {
    validatePhone();
    saveDraft();
  });
  dobInput.addEventListener('change', () => {
    validateDOB();
    saveDraft();
  });

  usernameInput.addEventListener('input', () => {
    validateUsername();
    saveDraft();
  });
  passwordInput.addEventListener('input', () => {
    evaluatePassword();
    if (confirmPasswordInput.value) validateConfirmPassword();
  });
  confirmPasswordInput.addEventListener('input', validateConfirmPassword);
  termsCheck.addEventListener('change', validateTerms);

  // Password Visibility Toggles
  const setupPasswordToggle = (button, input) => {
    button.addEventListener('click', () => {
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      button.classList.toggle('active', isPassword);
    });
  };

  setupPasswordToggle(togglePasswordBtn, passwordInput);
  setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

  // --------------------------------------------------------------------------
  // Step Navigation Buttons
  // --------------------------------------------------------------------------
  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepper(currentStep);
        saveDraft();
      }
    } else {
      showToast('Please fix the errors before continuing', 'error');
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepper(currentStep);
    }
  });

  // --------------------------------------------------------------------------
  // Avatar Upload & Presets
  // --------------------------------------------------------------------------
  uploadAvatarBtn.addEventListener('click', () => avatarInput.click());
  document.getElementById('avatarOverlay').addEventListener('click', () => avatarInput.click());

  const handleAvatarFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, JPG, WEBP)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size cannot exceed 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      currentAvatarUrl = e.target.result;
      avatarImage.src = currentAvatarUrl;
      presetImgs.forEach((img) => img.classList.remove('active'));
      showToast('Profile image updated successfully', 'success');
    };
    reader.readAsDataURL(file);
  };

  avatarInput.addEventListener('change', (e) => {
    handleAvatarFile(e.target.files[0]);
  });

  // Drag and Drop Avatar Support
  ['dragenter', 'dragover'].forEach((eventName) => {
    avatarSection.addEventListener(eventName, (e) => {
      e.preventDefault();
      avatarSection.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    avatarSection.addEventListener(eventName, (e) => {
      e.preventDefault();
      avatarSection.classList.remove('dragover');
    });
  });

  avatarSection.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleAvatarFile(files[0]);
    }
  });

  // Preset Avatars Selector
  presetImgs.forEach((preset) => {
    preset.addEventListener('click', () => {
      presetImgs.forEach((img) => img.classList.remove('active'));
      preset.classList.add('active');
      currentAvatarUrl = preset.src;
      avatarImage.src = currentAvatarUrl;
      showToast('Preset avatar selected', 'info');
    });
  });

  // Reset Avatar
  removeAvatarBtn.addEventListener('click', () => {
    currentAvatarUrl = DEFAULT_AVATAR;
    avatarImage.src = DEFAULT_AVATAR;
    presetImgs.forEach((img) => img.classList.remove('active'));
    presetImgs[0]?.classList.add('active');
    avatarInput.value = '';
    showToast('Avatar reset to default', 'info');
  });

  // --------------------------------------------------------------------------
  // Roles & Tag Cloud Interaction
  // --------------------------------------------------------------------------
  roleCards.forEach((card) => {
    card.addEventListener('click', () => {
      roleCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      saveDraft();
    });
  });

  tagPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
      saveDraft();
    });
  });

  // --------------------------------------------------------------------------
  // Modals Logic (Terms & Celebration)
  // --------------------------------------------------------------------------
  const openModal = (modal) => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Terms Modal Triggers
  if (openTermsModalLink) {
    openTermsModalLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(termsModal);
    });
  }

  if (openPrivacyModalLink) {
    openPrivacyModalLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(termsModal);
    });
  }

  closeTermsModal.addEventListener('click', () => closeModal(termsModal));
  declineTermsBtn.addEventListener('click', () => closeModal(termsModal));

  acceptTermsBtn.addEventListener('click', () => {
    termsCheck.checked = true;
    validateTerms();
    closeModal(termsModal);
    showToast('Terms and conditions accepted', 'success');
  });

  // Close modals when clicking backdrop
  [termsModal, successModal].forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  closeSuccessModal.addEventListener('click', () => closeModal(successModal));

  // --------------------------------------------------------------------------
  // LocalStorage Auto-Draft Saving
  // --------------------------------------------------------------------------
  let draftTimeout = null;

  const saveDraft = () => {
    clearTimeout(draftTimeout);
    draftTimeout = setTimeout(() => {
      const selectedRole = document.querySelector('input[name="primaryRole"]:checked')?.value || 'Developer';
      const selectedTags = Array.from(document.querySelectorAll('.interest-pill.active')).map((p) => p.getAttribute('data-tag'));

      const draftData = {
        fullName: fullNameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        dob: dobInput.value,
        username: usernameInput.value,
        role: selectedRole,
        tags: selectedTags,
        currentStep: currentStep,
      };

      localStorage.setItem('nexus_reg_draft', JSON.stringify(draftData));

      // Show draft badge
      draftStatus.classList.add('visible');
      setTimeout(() => {
        draftStatus.classList.remove('visible');
      }, 2000);
    }, 600);
  };

  const restoreDraft = () => {
    const saved = localStorage.getItem('nexus_reg_draft');
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      if (data.fullName) fullNameInput.value = data.fullName;
      if (data.email) emailInput.value = data.email;
      if (data.phone) phoneInput.value = data.phone;
      if (data.dob) dobInput.value = data.dob;
      if (data.username) usernameInput.value = data.username;

      // Restore Role
      if (data.role) {
        roleCards.forEach((card) => {
          const radio = card.querySelector('input[type="radio"]');
          if (radio && radio.value === data.role) {
            radio.checked = true;
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });
      }

      // Restore Tags
      if (Array.isArray(data.tags)) {
        tagPills.forEach((pill) => {
          const tag = pill.getAttribute('data-tag');
          if (data.tags.includes(tag)) {
            pill.classList.add('active');
          } else {
            pill.classList.remove('active');
          }
        });
      }
    } catch (err) {
      console.error('Error restoring draft:', err);
    }
  };

  // --------------------------------------------------------------------------
  // Form Submission & Celebration
  // --------------------------------------------------------------------------
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      showToast('Please accept the Terms & Conditions', 'error');
      return;
    }

    // Toggle button loading spinner
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    spinner.style.display = 'inline-block';

    // Collect Form Data
    const selectedRole = document.querySelector('input[name="primaryRole"]:checked')?.value || 'Developer';
    const selectedTags = Array.from(document.querySelectorAll('.interest-pill.active')).map((p) => p.getAttribute('data-tag'));

    const userData = {
      fullName: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      dob: dobInput.value,
      username: usernameInput.value.trim(),
      role: selectedRole,
      interests: selectedTags.length > 0 ? selectedTags.join(', ') : 'None selected',
      avatarUrl: currentAvatarUrl,
    };

    // Simulate Network Request
    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.style.display = 'inline-flex';
      spinner.style.display = 'none';

      // Populate Success Modal
      summaryAvatar.src = userData.avatarUrl;
      summaryName.textContent = userData.fullName;
      summaryUsername.textContent = `@${userData.username}`;
      summaryRole.textContent = userData.role;
      summaryEmail.textContent = userData.email;
      summaryPhone.textContent = userData.phone;
      summaryInterests.textContent = userData.interests;

      // Clear draft
      localStorage.removeItem('nexus_reg_draft');

      // Launch Confetti Burst
      triggerConfetti();

      // Open Success Modal
      openModal(successModal);
      showToast('Account registered successfully!', 'success');
    }, 1200);
  });

  // Confetti Animation
  const triggerConfetti = () => {
    if (typeof confetti === 'function') {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 1500,
      };

      const fire = (particleRatio, opts) => {
        confetti(
          Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
          })
        );
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  };

  // Dashboard Button inside Success Modal
  continueToDashboardBtn.addEventListener('click', () => {
    showToast('Redirecting to developer dashboard...', 'info');
    setTimeout(() => {
      closeModal(successModal);
    }, 1500);
  });

  // Register Another Account Button inside Success Modal
  createAnotherBtn.addEventListener('click', () => {
    closeModal(successModal);
    registrationForm.reset();
    currentAvatarUrl = DEFAULT_AVATAR;
    avatarImage.src = DEFAULT_AVATAR;
    
    // Clear validation states
    document.querySelectorAll('.form-group').forEach((group) => {
      group.classList.remove('has-error', 'has-success');
    });

    // Reset strength meter
    strengthBar.className = 'strength-bar';
    strengthBar.style.width = '0%';
    strengthText.textContent = 'None';
    strengthText.style.color = 'var(--text-muted)';
    [reqLength, reqUpper, reqLower, reqNumber, reqSymbol].forEach((req) => req.classList.remove('met'));

    // Go back to Step 1
    currentStep = 1;
    updateStepper(currentStep);
    showToast('Form reset. Ready for new registration', 'info');
  });

  // Social Auth Buttons
  document.getElementById('googleLoginBtn').addEventListener('click', () => {
    showToast('Google OAuth initialization simulated', 'info');
  });

  document.getElementById('githubLoginBtn').addEventListener('click', () => {
    showToast('GitHub OAuth initialization simulated', 'info');
  });

  // --------------------------------------------------------------------------
  // Toast Notification System
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-leave');
      setTimeout(() => {
        toast.remove();
      }, 350);
    }, 3500);
  }

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------
  initTheme();
  restoreDraft();
  updateStepper(currentStep);
});
