const fold = () => {
    document.getElementById('menuFold').style.display = 'none'
    document.getElementById('menuUnfold').style.display = 'flex'
    document.getElementById('menuUnfold').style.right = '-23px'
    document.getElementById('brandname').style.width = 0;
    document.getElementById('sidebar').style.width = '80px'
    const btns = document.querySelectorAll('.side-btn')
    for (let btn of btns) {
        btn.classList.add('folded')
    }
}

const unFold = () => {
    document.getElementById('menuFold').style.display = 'flex'
    document.getElementById('menuUnfold').style.display = 'none'
    document.getElementById('brandname').style.width = 'auto';
    document.getElementById('sidebar').style.width = '300px'
    const btns = document.querySelectorAll('.side-btn')
    for (let btn of btns) {
        btn.classList.remove('folded')
    }
}

const ddOpen = () => {
    document.getElementById('ddClose').style.display = 'flex'
    document.getElementById('ddOpen').style.display = 'none'
    document.getElementById('header-content').style.display = 'block'
}

const ddClose = () => {
    document.getElementById('ddOpen').style.display = 'flex'
    document.getElementById('ddClose').style.display = 'none'
    document.getElementById('header-content').style.display = 'none'
}

export { fold, unFold, ddOpen, ddClose }