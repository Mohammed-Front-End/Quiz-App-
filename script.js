// Select Elements
let countSpan = document.querySelector(".quiz-app .count span");
let bulletsSpansContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bulletsElement = document.querySelector(".quiz-app .bullets");
let results = document.querySelector(".results");
let countDownElement = document.querySelector(".countDown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countDownIntervral;
let questionsObject;
let userAnswers = [];

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.questions.length;

      // إنشاء النقاط وإعداد الأسئلة
      CreateBullets(questionsCount);
      addQuestionData(questionsObject.questions[currentIndex], questionsCount);

      // بدء العد التنازلي بناءً على مستوى الصعوبة
      let initialDuration = getDurationForDifficulty(
        questionsObject.questions[currentIndex].difficulty
      );
      countDown(initialDuration, questionsCount);
      //سسسس
      // عند النقر على زر الإرسال
      submitButton.onclick = function () {
        let theRightAnswer = questionsObject.questions[currentIndex].answer;
        currentIndex++;
        checkAnswer(theRightAnswer, questionsCount);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        if (currentIndex < questionsCount) {
          addQuestionData(
            questionsObject.questions[currentIndex],
            questionsCount
          );
          handelBullets();
          clearInterval(countDownIntervral);

          // بدء العد التنازلي للسؤال التالي بناءً على مستوى الصعوبة
          let nextDuration = getDurationForDifficulty(
            questionsObject.questions[currentIndex].difficulty
          );
          countDown(nextDuration, questionsCount);
        }

        showResults(questionsCount);
      };
    }
  };
  myRequest.open("GET", "questions.JSON", true);
  myRequest.send();
}
getQuestions();

function CreateBullets(num) {
  countSpan.innerHTML = num;
  // create spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");
    // Check if its first span
    if (i === 0) {
      theBullet.className = "on";
    }
    // append bullets to main bullet container
    bulletsSpansContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // إنشاء عنوان السؤال
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj.question);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    // إنشاء الإجابات بناءً على عدد الخيارات
    obj.options.forEach((option, index) => {
      // إنشاء العنصر الأساسي للإجابة
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      // إنشاء زر الراديو
      let radioInput = document.createElement("input");
      radioInput.setAttribute("type", "radio");
      radioInput.setAttribute("name", "questions");
      radioInput.id = `answer_${index + 1}`;
      radioInput.dataset.answer = option;

      // تحديد الخيار الأول بشكل افتراضي
      if (index === 0) {
        radioInput.checked = true;
      }

      // إنشاء التسمية (label)
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${index + 1}`;
      let theLabelText = document.createTextNode(option);
      theLabel.appendChild(theLabelText);

      // إلحاق الراديو والتسمية بالعناصر
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);
    });
  }
}

function checkAnswer(ranswer, count) {
  let answer = document.getElementsByName("questions");
  let theChoosenAnswer;
  for (let i = 0; i < answer.length; i++) {
    if (answer[i].checked) {
      theChoosenAnswer = answer[i].dataset.answer;
    }
  }

  if (theChoosenAnswer === undefined) {
    console.warn("لم يتم اختيار إجابة صحيحة.");
    return;
  }

  userAnswers.push({
    questionIndex: currentIndex - 1,
    chosen: theChoosenAnswer,
  });

  if (ranswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handelBullets() {
  let handelSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(handelSpan);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.classList.add("on");
    }
  });
}

function showResults(count) {
  let theResult;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bulletsElement.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResult = `<span class="perfect">Perfect</span>, All Answers Are Perfect`;
    } else {
      theResult = `<span class="bad">Don't be sad. Try to look and read more.</span>, ${rightAnswers} From ${count}`;
    }

    let resultSummary = document.createElement("div");
    resultSummary.className = "result-summary";
    resultSummary.innerHTML = theResult;
    results.appendChild(resultSummary);

    let allQuestionsHTML = `<h2>Questions, Your Answers, and Correct Solutions</h2>`;
    questionsObject.questions.forEach((question, index) => {
      const userAnswer = userAnswers.find((ans) => ans.questionIndex === index);
      const chosenAnswer = userAnswer ? userAnswer.chosen : "No Answer";
      const isCorrect = question.answer === chosenAnswer ? "✅" : "❌";

      allQuestionsHTML += `
        <div class="question-block">
          <h3>Q${index + 1}: ${question.question}</h3>
          <p><strong>Correct Answer:</strong> ${question.answer}</p>
          <p><strong>Your Answer:</strong> ${chosenAnswer} ${isCorrect}</p>
        </div>
      `;
    });

    let solutionsDiv = document.createElement("div");
    solutionsDiv.className = "solutions";
    solutionsDiv.innerHTML = allQuestionsHTML;
    results.appendChild(solutionsDiv);

    //Add button to proceed to the next exam
    let nextExamButton = document.createElement("button");
    nextExamButton.className = "next-exam-button";
    nextExamButton.textContent = "انتقل إلى امتحان التوصيل";
    nextExamButton.onclick = function () {
      // هنا تضع رابط الامتحان التالي
      window.location.href = "./الانقسام/index.html"; // استبدل بالمسار الصحيح
    };
    results.appendChild(nextExamButton);
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownIntervral = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownIntervral);
        submitButton.click();
      }
    }, 1000);
  }
}

// تحديد الوقت حسب مستوى الصعوبة
function getDurationForDifficulty(difficulty) {
  switch (difficulty) {
    case "easy":
      return 90; // 30 ثانية للمستوى السهل
    case "medium":
      return 90; // 60 ثانية للمستوى المتوسط
    case "hard":
      return 90; // 90 ثانية للمستوى الصعب
    case "Very Difficult":
      return 120; // 120  ثانية للمستوى الصعب جد
    default:
      return 90; // الافتراضي 30 ثانية
  }
}
