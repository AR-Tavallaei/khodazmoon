// Get Questions From Json File
const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get('id');

const request = new XMLHttpRequest();
request.open('GET', './assets/js/questions.json', false);
request.onreadystatechange = function (){
    if (request.status === 200){
        loadQuestions();
    }
}
request.send();


// Show Questions On Webpage
function loadQuestions(){
    // Get Questions
    const test = JSON.parse(request.response)[testId];
    document.getElementsByTagName('h1').item(0).innerHTML = "<img src='assets/icons/file-text.svg' alt='icon'> " + 'آزمون ' + test.title;
    if (test['questions']['سوال1']['title'] === ''){
        notUploaded()
        return false
    }

    const testQuestions = test['questions'];
    let corrects = 0;
    let mistakes = 0;

    // Show Question 1
    let questionNumber = 1;
    let questionInfo = testQuestions['سوال' + questionNumber];
    document.querySelector('#questionContainer h2').innerHTML = "<img src='assets/icons/question-circle.svg' alt='icon'> " + 'سوال' + questionNumber + ': ' + questionInfo.title;
    for (let i=0; i< questionInfo.options.length; i++){
        document.querySelectorAll('#questionContainer ul li label').item(i).innerHTML = 'گزینه ' + (i+1) + ': ' + questionInfo.options[i];
    }

    // Set Style For Options Checked
    setInterval(function (){
        const selectedOption = document.querySelector('input[name=options]:checked');
        if (selectedOption !== null){
            selectedOption.parentElement.style.border = '2px dashed white';
            for (const el of document.querySelectorAll('input[name=options]')){
                if (el !== selectedOption){
                    el.parentElement.style.border = 'none';
                }
            }
        }
    }, 200);

    // Check Answer Function
    function checkAnswer(){
        const selectedOption = document.querySelector('input[name=options]:checked');
        if (selectedOption === null){
            document.querySelector('#questionContainer p').innerHTML = 'لطفا یکی از گزینه ها را انتخاب نمایید.'
        }
        else {
            document.getElementsByTagName('p').item(0).innerHTML = '';
            if (document.querySelector('#questionContainer label[for=' + selectedOption.id + ']').innerHTML[6] === String(questionInfo["answer"])){
                selectedOption.parentElement.style.backgroundColor = 'rgb(25,135,84)';
                corrects += 1
            }
            else {
                selectedOption.parentElement.style.backgroundColor = 'rgb(220,53,69)';
                document.querySelector('ul li:nth-of-type(' + questionInfo["answer"] + ')').style.backgroundColor = 'rgb(25,135,84)';
                mistakes += 1;
            }
            document.getElementsByName('options').forEach(function (el){
                el.disabled = true;
            })
            if (testQuestions['سوال'+(questionNumber+1)] !== undefined){
                document.getElementsByTagName('button').item(0).innerHTML = "<img src='assets/icons/check-circle.svg' alt='icon'> " + 'سوال بعدی';
                document.getElementsByTagName('button').item(0).onclick = nextQuestion;
            }
            else {
                document.getElementsByTagName('button').item(0).innerHTML = "<img src='assets/icons/flag.svg' alt='icon'> " + 'پایان';
                document.getElementsByTagName('button').item(0).onclick = finish;
            }
        }
    }
    document.getElementsByTagName('button').item(0).onclick = checkAnswer;

    // Next Question Function
    function nextQuestion(){
        questionNumber += 1;
        questionInfo = testQuestions[ 'سوال' + questionNumber];

        document.getElementsByName('options').forEach(function (el){
            el.parentElement.style.backgroundColor = 'transparent';
            el.parentElement.style.border = '0';
            el.disabled = false;
            el.checked = false;
        });

        document.querySelector('#questionContainer p').innerHTML = '';
        document.querySelector('#questionContainer h2').innerHTML =  'سوال' + questionNumber + ': ' + questionInfo.title;
        for (let i=0; i< questionInfo.options.length; i++){
            document.querySelectorAll('#questionContainer ul li label').item(i).innerHTML = 'گزینه ' + (i+1) + ': ' + questionInfo.options[i];
        }

        document.getElementsByTagName('button').item(0).innerHTML = 'تایید پاسخ';
        document.getElementsByTagName('button').item(0).onclick = checkAnswer;
    }

    // Function For Finish
    function finish(){
        const grade = Math.round((corrects / questionNumber) * 10000) / 100;

        let level, color;
        if (grade > 90) {level = 'عالی'; color = 'text-success'}
        else if (grade > 80) {level = 'خیلی خوب'; color = 'text-success'}
        else if (grade > 65) {level = 'خوب'; color = 'text-warning'}
        else if (grade > 50) {level = 'متوسط'; color = 'text-warning'}
        else if (grade > 35) {level = 'ضعیف'; color = 'text-danger'}
        else {level = 'خیلی ضعیف'; color = 'text-danger'}

        const container = document.getElementById('questionContainer');
        container.innerHTML = '<h2 class="my-5 pb-3">خسته نباشی! آزمون به اتمام رسید. در زیر می تونی نتایج اون رو ببینی:</h2>' +
            '<div class="text-start mx-auto px-4 py-2 border-start border-2 border-secondary" style="width: max-content;">' +
                '<h3><img src="assets/icons/clipboard2-data.svg" alt="icon"> نمره از 100: <span class="' + color + '">' + grade + '</span></h3>' +
                '<h3 class="text-white"><img src="assets/icons/person-check.svg" alt="icon"> سطح توصیفی: <span class="' + color + '">' + level + '</span></h3>' +
                '<h3 class="text-white"><img src="assets/icons/check-lg.svg" alt="icon"> تعداد پاسخ های صحیح: <span class="text-success">' + corrects + '</span></h3>' +
                '<h3 class="text-white"><img src="assets/icons/x-lg.svg" alt="icon"> تعداد پاسخ های غلط:  <span class="text-danger">' + mistakes + '</span></h3>' +
                '<h3 class="text-white"><img src="assets/icons/card-list.svg" alt="icon"> تعداد کل سوالات:  <span class="text-warning">' + questionNumber + '</span></h3>' +
            '</div>';
    }
}

function notUploaded(){
    const container = document.getElementById('questionContainer');
    container.innerHTML = '<h2 class="text-danger"> این آزمون هنوز بارگزاری نشده است... </h2>';
}
