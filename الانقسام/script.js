const questions = [
  {
    id: 1,
    question: "علل: الانقسام الميوزي يحدث في الخلايا الجنسية فقط",
    answer:
      "لأن الانقسام الميوزي يهدف إلى تقليل عدد الكروموسومات إلى النصف، وذلك لتكوين خلايا جنسية 'جاميتات' تحتوي على نصف عدد الكروموسومات الضروري للتكاثر الجنسي",
  },
  {
    id: 2,
    question:
      "علل: لا يحدث تضاعف للـ DNA في الانقسام الميتوزي بعد الطور التمهيدي",
    answer:
      "لأن المادة الوراثية تكون قد تضاعفت بالفعل قبل بدء الانقسام في الطور البيني، لذا لا يتطلب الانقسام الميتوزي مزيداً من التضاعف للـ DNA",
  },
  {
    id: 3,
    question: "علّل: عدم اكتمال فصل الكروموسومات بشكل صحيح في الطور الانفصالي قد يؤدي إلى اضطرابات وراثية.",
    answer:
      "إذا لم تفصل الكروموسومات أو الكروماتيدات الشقيقة بشكل متساوٍ بين الخلايا الوليدة، فإن ذلك يؤدي إلى حدوث اختلال في عدد الكروموسومات (Aneuploidy)",
  },
  {
    id: 4,
    question: "علّل: يحتوي الطور التمهيدي الأول في الانقسام الميوزي على العبور الجيني، بينما لا يحدث ذلك في الانقسام الميتوزي.",
    answer:
      "في الانقسام الميوزي، الهدف هو إنتاج خلايا تحتوي على تنوع جيني، ويتم ذلك عن طريق تبادل المادة الوراثية بين الكروموسومات المتماثلة خلال العبور الجيني في الانقسام الميتوزي، الهدف هو إنتاج خلايا متطابقة وراثيًا للحفاظ على نفس المعلومات الجينية",
  },
  {
    id: 5,
    question: "علّل: تتطلب الخلايا في الانقسام الميتوزي وقتًا أطول في الطور البيني مقارنة بالمراحل الأخرى.",
    answer:
      ".الطور البيني هو المرحلة التي يتم فيها تضاعف المادة الوراثية (DNA) وإعداد الخلية للانقسام. هذه المرحلة تحتاج إلى وقت أطول لضمان دقة تضاعف DNA وتكوين البروتينات اللازمة للانقسام، مما يجعلها حيوية لاستقرار المادة الوراثية في الخلايا الناتجة",
  },
];
window.onload = () => {
  // تحديث عدد الأسئلة عند تحميل الصفحة
  const totalQuestionsElement = document.getElementById("total-questions");
  totalQuestionsElement.textContent = questions.length;
};

let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;
let timerInterval;

const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");

const questionCounter = document.getElementById("question-counter");
const questionContainer = document.getElementById("question-container");
const nextBtn = document.getElementById("next-btn");
const retryBtn = document.getElementById("retry-btn");
const resultContainer = document.getElementById("result-container");

const userAnswerField = document.getElementById("user-answer");
const timerElement = document.getElementById("time");

document.getElementById("start-btn").addEventListener("click", () => {
  startScreen.classList.add("hidden");
  questionScreen.classList.remove("hidden");
  loadQuestion();
});

// دالة لمقارنة الإجابات بشكل صحيح بعد إزالة النقاط والفواصل غير الضرورية
function normalizeAnswer(answer) {
  return answer
    .replace(/[.,?!؛؟"']/g, "") // إزالة النقاط والفواصل وعلامات الاقتباس
    .replace(/\s+/g, " ") // إزالة المسافات الزائدة
    .trim() // إزالة المسافات في بداية ونهاية الجملة
    .toLowerCase(); // تحويل النص إلى حروف صغيرة
}

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  // تحديث العدادات
  questionCounter.textContent = `السؤال ${currentQuestionIndex + 1} من ${
    questions.length
  }`;

  // إنشاء عناصر السؤال ديناميكيًا
  const questionHTML = `
    <h2>${currentQuestion.question}</h2>
    <textarea id="user-answer" placeholder="اكتب إجابتك هنا..."></textarea>
    <p id="timer">الوقت المتبقي: <span id="time">90</span> ثانية</p>
  `;

  // إضافة المحتوى الجديد إلى العنصر
  questionContainer.innerHTML = questionHTML;

  // تعريف userAnswerField بعد إضافة HTML
  const userAnswerField = document.getElementById("user-answer");
  const nextBtn = document.getElementById("next-btn");

  // تعطيل زر "التالي" في البداية
  nextBtn.disabled = true;
  nextBtn.classList.remove("hidden"); // إظهار زر "التالي" دائمًا

  // تفعيل زر "التالي" عندما يتم كتابة إجابة
  userAnswerField.addEventListener("input", () => {
    nextBtn.disabled = userAnswerField.value.trim() === ""; // تفعيل الزر عند كتابة الإجابة
  });

  startTimer(); // بدء المؤقت
}

function startTimer() {
  let time = 230; // مدة الوقت لكل سؤال
  const timerElement = document.getElementById("time");
  timerElement.textContent = time;

  timerInterval = setInterval(() => {
    if (time === 0) {
      clearInterval(timerInterval);
      submitAnswer(); // حفظ الإجابة تلقائيًا عند انتهاء الوقت
      nextBtn.classList.remove("hidden"); // التأكد من أن زر "التالي" مرئي
      goToNextQuestion(); // الانتقال للسؤال التالي
    } else {
      time--;
      timerElement.textContent = time;
    }
  }, 1000);
}

function submitAnswer() {
  const userAnswerField = document.getElementById("user-answer");
  const userAnswer = userAnswerField ? userAnswerField.value.trim() : "";

  if (userAnswer) {
    userAnswers[currentQuestionIndex] = userAnswer; // حفظ الإجابة
    // تحقق من الإجابة الصحيحة
    if (userAnswer === questions[currentQuestionIndex].answer) {
      // عرض المفرقعات وتهنئة المستخدم
      showCongratulations();
    }
  }
}

// دالة لحفظ الإجابة
function saveAnswer() {
  const userAnswerField = document.getElementById("user-answer");
  const userAnswer = userAnswerField ? userAnswerField.value.trim() : "";

  if (userAnswer) {
    userAnswers[currentQuestionIndex] = userAnswer; // حفظ الإجابة
  }
}




// تعديل دالة goToNextQuestion للانتقال للسؤال التالي مباشرة
function goToNextQuestion() {
  const nextBtn = document.getElementById("next-btn");

  saveAnswer(); // حفظ الإجابة عند الانتقال

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion(); // تحميل السؤال التالي
  } else {
    questionScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    showResults(); // عرض النتيجة النهائية
  }
}

// تمكين الانتقال للسؤال التالي عند الضغط على زر "التالي"
nextBtn.addEventListener("click", () => {
  if (!nextBtn.disabled) {
    goToNextQuestion();
  }
});

function showResults() {
  resultContainer.innerHTML = questions
    .map((question, index) => {
      const userAnswerNormalized = normalizeAnswer(userAnswers[index] || "");
      const correctAnswerNormalized = normalizeAnswer(question.answer);

      const isCorrect = userAnswerNormalized === correctAnswerNormalized;

      return `
        <div class="result-item">
          <p class="question-text">${index + 1}. ${question.question}</p>
          <div class="answers">
            <p class="user-answer ${
              isCorrect ? "correct-answer" : "incorrect-answer"
            }">
              إجابتك: <span class="${isCorrect ? "correct" : "incorrect"}">${
        userAnswers[index] || "لم يتم الإجابة"
      }</span>
            </p>
            ${
              isCorrect
                ? `
              <p class="correct-answer-text">
                الإجابة الصحيحة: <span class="correct">${question.answer}</span>
              </p>
            `
                : `
              <p class="correct-answer-text">
                الإجابة الصحيحة: <span class="blue">${question.answer}</span>
              </p>
            `
            }
          </div>
        </div>
      `;
    })
    .join("");

  resultContainer.innerHTML += `<p class="score">إجاباتك الصحيحة: ${
    userAnswers.filter((answer, index) => {
      const userAnswerNormalized = normalizeAnswer(answer || "");
      const correctAnswerNormalized = normalizeAnswer(questions[index].answer);
      return userAnswerNormalized === correctAnswerNormalized;
    }).length
  } من ${questions.length}</p>`;

  // تحقق إذا كانت جميع الإجابات صحيحة
  const allAnswersCorrect = userAnswers.every((answer, index) => {
    const userAnswerNormalized = normalizeAnswer(answer || "");
    const correctAnswerNormalized = normalizeAnswer(questions[index].answer);
    return userAnswerNormalized === correctAnswerNormalized;
  });

  if (allAnswersCorrect) {
    // عرض التهنئة والمفرقعات إذا كانت جميع الإجابات صحيحة
    showCongratulations();
  }
}



retryBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  userAnswers = [];
  score = 0;
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});



// دالة لعرض المفرقعات عند الإجابة الصحيحة في النهاية
function showCongratulations() {
  Swal.fire({
    title: "تهانينا!",
    text: "لقد أجبت على جميع الأسئلة بشكل صحيح! ممتاز!",
    icon: "success",
    confirmButtonText: "شكرًا",
    willClose: () => {
      // بعد إغلاق التنبيه، نعرض المفرقعات
      fireConfetti();
    }
  });
}

// دالة لإظهار المفرقعات
function fireConfetti() {
  const confettiElement = document.createElement('div');
  confettiElement.classList.add('confetti');
  document.body.appendChild(confettiElement);

  setTimeout(() => {
    confettiElement.remove();
  }, 4000); // إزالة المفرقعات بعد 4 ثوانٍ
}
