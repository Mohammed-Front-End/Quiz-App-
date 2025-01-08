const questions = [
  {
    id: 1,
    question: "بما تفسر تعرضت دولة المماليك لأزمات مالية واقتصادية؟",
    answer: "بسبب اكتشاف البتغاليون طريق رأس الرجاء الصالح  1498",
    difficulty: "medium",
  },
  {
    id: 2,
    question: "بما تفسر تعرضت دولة المماليك لأزمات سياسية؟",
    answer:
      "بسبب التنافس بين الأمراء المماليك على السلطة، والتدخلات الخارجية من الدولة العثمانية، وضعف السلطة المركزية وضعف التنظيم الإداري.",
    difficulty: "medium",
  },
  {
    id: 3,
    question:
      "بماذا تفسر اتجاه السلطان سليم الأول نحو الشام ومصر في بداية القرن الـ16 وعدم توجهه نحو دول أوروبا؟",
    answer:
      "يمكن تفسير ذلك بأن العثمانيين وجدوا أن أوروبا كانت تتمتع بحضارة عسكرية متقدمة وكانت قوية في ذلك الوقت. في المقابل، كانت الشام ومصر تعاني من ضعف سياسي وعسكري، مما جعلها أهدافًا أسهل بالنسبة للعثمانيين. كما أن تهديدات الدولة الصفوية في الشرق كانت تشكل خطرًا أكبر على الدولة العثمانية. بالإضافة إلى رغبة سليم الأول في توسيع ممتلكات الدولة العثمانية من خلال الاستيلاء على مصر، التي تمثل قلب العالم الإسلامي.",
    difficulty: "medium",
  },
  {
    id: 4,
    question:
      "بما تفسر شهد العالم الاسلامي أواخر القرن 16 صراعا حادا بين ثلاث قوى؟",
    answer:
      "تعددت القوى الكبرى في العالم الإسلامي في ذلك الوقت مثل الدولة العثمانية، الدولة الصفوية، والدولة المملوكية، مما أدى إلى تنافس على النفوذ والسلطة في المناطق الاستراتيجية، ما أسفر عن صراع مستمر بينها.",
  },
  {
    id: 5,
    question:
      "بما تفسر تعرض دولة المماليك لتدهور اقتصادي نتيجة اكتشاف طريق رأس الرجاء الصالح؟",
    answer:
      "اكتشاف طريق رأس الرجاء الصالح أدى إلى تحول طرق التجارة العالمية عبر البحر بعيدًا عن الأراضي المملوكية، مما قلل من دخل الدولة المملوكية من التجارة، وأسهم في تدهورها الاقتصادي.",
  },
  {
    id: 6,
    question:
      "متى وقعت معركة مرج دابق وبقيادة من من الدولة العثمانية؟ وما هي النتائج المترتبة عليها؟",
    answer:
      "وقعت معركة مرج دابق في 1516م، بقيادة السلطان سليم الأول من الدولة العثمانية. وأسفرت عن هزيمة المماليك وفتح الدولة العثمانية للشام، مما مهد لاستيلاء العثمانيين على مصر بعد عام واحد.",
    difficulty: "hard",
  },
  {
    id: 7,
    question:
      "أين ذهب سليم الأول في مصر بعد استيلائه على الشام؟ حددًا حيث وقعت معركة، وبقيادة من من دولة المماليك، وما هي النتائج المترتبة عليها؟",
    answer:
      "بعد استيلائه على الشام، توجه سليم الأول إلى مصر، حيث وقعت معركة الريدانية في 1517م. وقاد المعركة من جانب المماليك السلطان طومان باي. أسفرت المعركة عن هزيمة المماليك، واستيلاء العثمانيين على مصر، ما أدى إلى أن تصبح مصر ولاية عثمانية.",
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
  // التحقق إذا كانت الإجابة فارغة أو غير معرفة
  if (!answer) return ""; // إذا كانت الإجابة فارغة أو غير معرفة، إرجاع سلسلة فارغة
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
  let time = 90; // مدة الوقت لكل سؤال
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
}

retryBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  userAnswers = [];
  score = 0;
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});
