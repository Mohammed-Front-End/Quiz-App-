const questions = [
  {
    id: 1,
    question:
      "صوب: تعرضت السلالة المغولية للهجرات الإجبارية إلى الأميركيتين في الماضي.",
    correctAnswer: "السلالة الزنجية",
    difficulty: "medium",
  },
  {
    id: 2,
    question: "صوب: جماعة البانتو تنتمي لسلالة الاسكيمو.",
    correctAnswer: "السلالة الزنجية",
    difficulty: "medium",
  },
  {
    id: 3,
    question: "لماذا تزيد النسبة المغولية عن 40% من سكان العالم؟",
    answer:
      "لأن النسبة الأكبر من سكان الصين وجنوب شرق آسيا ينتمون للسلالة المغولية، وهما من أكثر مناطق العالم كثافة سكانية.",
    difficulty: "medium",
  },
  {
    id: 4,
    question: "لماذا ينتمي أغلب سكان الصين وجنوب شرق آسيا للسلالة المغولية؟",
    answer:
      "لأن هذه المناطق هي موطن تاريخي لهذه السلالة وتضم أكبر تجمعات سكانية في العالم.",
    difficulty: "medium",
  },
  {
    id: 5,
    question: "لماذا يصعب وجود سلالات نقية في الوقت الحاضر؟",
    answer: "بسبب الهجرات والاختلاط بين السلالات البشرية على مر العصور.",
    difficulty: "hard",
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
  let time = 120; // مدة الوقت لكل سؤال
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

  // تحقق إذا كانت الإجابة غير فارغة
  if (!userAnswer) {
    userAnswers[currentQuestionIndex] = "لم يتم الإجابة"; // حفظ حالة عدم الإجابة
    return; // إنهاء الدالة دون عرض التهنئة
  }

  userAnswers[currentQuestionIndex] = userAnswer; // حفظ الإجابة

  // مقارنة الإجابات
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const normalizedCorrectAnswer = normalizeAnswer(
    questions[currentQuestionIndex].answer
  );

  // تحقق من صحة الإجابة
  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    // عرض التهنئة فقط عند الإجابة الصحيحة
    showCongratulations();
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
    },
  });
}

// دالة لإظهار المفرقعات
function fireConfetti() {
  const confettiElement = document.createElement("div");
  confettiElement.classList.add("confetti");
  document.body.appendChild(confettiElement);

  setTimeout(() => {
    confettiElement.remove();
  }, 4000); // إزالة المفرقعات بعد 4 ثوانٍ
}
