// CONTACT FORM — custom validation bubble in place of the browser's built-in one
const form = document.querySelector('.contact-form');
const inputs = form.querySelectorAll('input, textarea');

// one bubble per field, reusing the browser's own message text
inputs.forEach((input) => {
  const bubble = document.createElement('span');
  bubble.className = 'field-error';
  bubble.id = `${input.name}-error`;
  bubble.setAttribute('role', 'alert');
  bubble.hidden = true;
  bubble.innerHTML = '<span class="icon" aria-hidden="true">!</span><span class="message"></span>';
  input.after(bubble);
  input.setAttribute('aria-describedby', bubble.id);

  input.addEventListener('input', () => hide(input));
  input.addEventListener('blur', () => hide(input));
});

function bubbleFor(input) {
  return document.getElementById(`${input.name}-error`);
}

function hide(input) {
  bubbleFor(input).hidden = true;
  input.removeAttribute('aria-invalid');
}

function show(input) {
  const bubble = bubbleFor(input);
  bubble.querySelector('.message').textContent = input.validationMessage;
  bubble.hidden = false;
  input.setAttribute('aria-invalid', 'true');
}

// SENDING — FormSubmit forwards the inquiry by email (no server needed)
const ENDPOINT = 'https://formsubmit.co/ajax/kubisekl@moravian.edu';
const sendButton = form.querySelector('.send');
const status = form.querySelector('.form-status');

function setStatus(text, isError = false) {
  status.textContent = text;
  status.classList.toggle('is-error', isError);
  status.hidden = !text;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  inputs.forEach(hide);
  setStatus('');

  const invalid = [...inputs].find((input) => !input.checkValidity());
  if (invalid) {
    invalid.focus();
    show(invalid);
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  data._subject = `New inquiry from ${data['first-name']} ${data['last-name']}`;
  data._template = 'table';

  sendButton.disabled = true;
  sendButton.textContent = 'SENDING…';

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok || String(result.success) !== 'true') throw new Error(result.message);

    form.reset();
    setStatus('Thank you — your message was sent.');
  } catch (error) {
    // FormSubmit explains rejections (e.g. page opened as a file, form not yet activated)
    const reason = error.message ? ` (${error.message})` : '';
    setStatus(`Sorry, your message could not be sent${reason}. Please try again or email disco@dsrny.com.`, true);
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = 'SEND';
  }
});
