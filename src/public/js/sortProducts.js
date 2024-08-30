document.addEventListener('DOMContentLoaded', function(){
    let orderBy = document.getElementById('orderBy')

    if(orderBy){
        orderBy.addEventListener('change', (e) => {
            let orderOption = e.target.value
            let currentUrl = new URL(window.location.href)
            currentUrl.searchParams.set('sort', orderOption)
            window.location.href = currentUrl.toString()
        })
    }
})

