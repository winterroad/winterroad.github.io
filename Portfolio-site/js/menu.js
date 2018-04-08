let burgerMenu = document.querySelector(".burger-container");

burgerMenu.addEventListener('click', function(){
      if (burgerMenu.classList) {
          burgerMenu.classList.toggle("open");
      }
    });

/* TODO: MAKE A SIDEBAR TO OPEN, WHEN "BURGER" IS CLICKED*/
