// Tegan Friedenthal

var username;
function submitname() {
    username = document.getElementById("input").value;
}

function storescore(score) {
    if (username != null) {
         
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "insert.php?nm="+username+"&score="+score, false);
        xmlhttp.send(null);

    }
}