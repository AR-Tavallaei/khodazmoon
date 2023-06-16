const request = new XMLHttpRequest();
request.open('GET', 'assets/js/gradeLessons.json', false);
request.onreadystatechange = function (){
    if (request.status === 200){
        loadHomeGrades();
    }
}
request.send();

function loadHomeGrades(){
    const gradesLessons = JSON.parse(request.response);
    const gradeSections = document.querySelector('.container-fluid>div').children;
    for (let i=0; i<3; i++) {
        const gradeSection = gradeSections[i];
        gradeSection.children.item(0).innerHTML = "<img src='assets/icons/book.svg' alt='icon'> " + gradesLessons['grade'+((i+7))]['title'];
        gradeSection.children.item(1).innerHTML = gradesLessons['grade'+((i+7))]['lessons'].slice(0, -3).join(' ، ');
    }
}
