const logout = async () => {

    let respuesta = await fetch("api/sessions/logout", {method:"get"})
    window.location.href="/login"

}