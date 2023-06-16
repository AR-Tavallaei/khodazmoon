// Get PageId
const urlParams = new URLSearchParams(window.location.search);
const pageId = Number(urlParams.get('id'));

// Get Grade Lessons From Json File
const request = new XMLHttpRequest();
request.open('GET', 'assets/js/gradeLessons.json', false);
request.onreadystatechange = function (){
    if (request.status === 200){
        loadPage(pageId);
    }
}
request.send();

// Load Lessons
function loadPage(gradeNumber){
    const grade = JSON.parse(request.response)['grade' + gradeNumber];
    // document.querySelector('head title').innerHTML = 'آزمون های ' + grade.title;
    document.querySelector('h1').innerHTML = 'آزمون های ' + grade.title + ' براساس فصول کتاب درسی';
    const lessonsContainer = document.querySelector('.container-fluid div:last-of-type');

    for (let i=0; i<grade['lessons'].length; i++){
        const lesson = grade['lessons'][i];
        const lessonBox = document.createElement('div');
        lessonBox.className = 'col-xl-2 col-lg-3 col-md-3 col-sm-5 col-9 d-flex flex-column justify-content-around align-items-center bg-danger rounded-3 p-3 m-3';
        const title = document.createElement('h2');
        title.innerHTML = "<img src='assets/icons/book.svg' alt='icon'> " + lesson;
        title.className = 'h4'
        const goBtn = document.createElement('a');
        goBtn.href = './testQuestionsPage.html?id=' + gradeNumber + '_' + (i+1);
        goBtn.innerHTML = "<img src='assets/icons/box-arrow-in-left.svg' alt='icon'> " + 'شروع آزمون';
        goBtn.className = 'btn btn-success mt-4';

        lessonBox.appendChild(title);
        lessonBox.appendChild(goBtn);
        lessonsContainer.appendChild(lessonBox);
    }
}
