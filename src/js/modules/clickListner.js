const clickListner = () => {
  document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', (e) => {
      const target = e.target;
      if (
        target.matches('.header__burger') ||
        target.closest('.header__burger')
      ) {
        document.querySelector('.menu').classList.toggle('_active');
        document.querySelector('.header__burger').classList.toggle('_active');
        document.body.classList.toggle('_lock');
      }
    });
  });
};

export default clickListner;
