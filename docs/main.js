window.onload = function() {
    console.log("aSD");
  
    var menuExpandido = false;
    var menuExpandible = document.getElementById("menu-exterior");

    document.getElementById("hamburger").addEventListener("click", function () {
        menuExpandido = !menuExpandido;
        transladarMenu(menuExpandido);
    });

    function transladarMenu (abierto) { 
        console.log("HOLA");
        if(abierto) {
            menuExpandible.style.transform = "translateX(-60vw)"
        }
        else {
            menuExpandible.style.transform = "translateX(60vw)"
        }
    }
}