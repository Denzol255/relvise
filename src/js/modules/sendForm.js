const sendForm = () => {
  const modal = document.querySelector('.modal');
  const loader = document.querySelector('._lds-default');
  const successModal = document.querySelector('.success-modal');
  const errorModal = document.querySelector('.error-modal');

  const displayErrorMessage = (target, type) => {
    const errorMessage = document.createElement('div'),
      warnForEmail = 'Полe email имеет вид qwerty123@mail.com',
      warnForPhone =
        "Полe phone может начинаться с '+' и должно содержать от 7 до 13 символов",
      warnForName = 'Полe name должно содержать минимум 2 символа';

    errorMessage.classList.add('message-error');

    if (type === 'email') {
      errorMessage.textContent = warnForEmail;
    } else if (type === 'phone') {
      errorMessage.textContent = warnForPhone;
    } else if (type === 'name') {
      errorMessage.textContent = warnForName;
    }

    target.appendChild(errorMessage);
  };

  const showWindow = (
    success,
    target,
    loadingWindow,
    successWindow,
    errorWindow
  ) => {
    setTimeout(() => {
      loadingWindow.classList.remove('_active');
      success
        ? successWindow.classList.add('_active')
        : errorWindow.classList.add('_active');
    }, 3000);
    setTimeout(() => {
      success
        ? successWindow.classList.remove('_active')
        : errorWindow.classList.remove('_active');
      modal.classList.remove('_active');
      document.body.classList.remove('_lock');
    }, 5000);
    target.reset();
  };

  const postData = (body) => {
    return fetch('../../assets/server.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'aplication/json',
      },
      body: JSON.stringify(body),
    });
  };

  const checkFields = (target, type, name, reg) => {
    const field = target.querySelector(`[name="${name}"]`);
    if (!reg.test(field.value)) {
      displayErrorMessage(target, type);
      return false;
    }
    return true;
  };

  document.addEventListener('submit', (event) => {
    const target = event.target;

    if (target.matches('form')) {
      event.preventDefault();
      const checkEmail = checkFields(
        target,
        'email',
        'subscribe-email',
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      );
      if (checkEmail) {
        const formData = new FormData(target);
        const body = {};

        formData.forEach((val, key) => {
          body[key] = val;
        });

        modal.classList.add('_active');
        loader.classList.add('_active');
        document.body.classList.add('_lock');

        postData(body)
          .then((response) => {
            if (response.status !== 200) {
              throw new Error('status network is not 200');
            }
            showWindow(true, target, loader, successModal, errorModal);
          })
          .catch((error) => {
            showWindow(false, target, loader, successModal, errorModal);
            console.error(error);
          });
      }
    }
  });
};

export default sendForm;
