# reactQuizGame
This React app creates a quiz game with set category and difficulty levels. Number of questions is specified by players. Winner/score is shown.

This application utilizes a third party API, open trivia database, to pull questions/answers from: https://opentdb.com/api.php?

A general walkthrough of the pertinent React code is given below:

To start a temp url is created in able to get data from the API in which to work on.
```React
const tempURL =
  "https://opentdb.com/api.php?amount=10&category=23&difficulty=medium&type=multiple";
```

Next the state variables which will be used inside the App.Provider are set up.
```React
const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
```

Next the state values are passed into the AppContext.Provider to make available throughout the app.
```React
  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        isModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
```

Next App.js is set up.
```React
function App() {
  const { waiting, loading, questions, index, correct } = useGlobalContext();
  if (waiting) {
    return <SetupForm />;
  }
  if (loading) {
    return <Loading />;
  }
  return <main>main quiz app</main>;
}
```

Next questions are fetched from the API.
```React
  const fetchQuestions = async (url) => {
    setLoading(true);
    setWaiting(false);
    const response = await axios(url).catch((err) => console.log(err));
    console.log(response);
  };
```

Next a useEffect is set up.
```React
  useEffect(() => {
    fetchQuestions(tempURL);
  }, []);
```

Axios should be returning a data object now. Next a conditional is setup inside of fetchQuestions.
```React
    if (response) {
      const data = response.data.results;
      // console.log(data);
      if (data.length > 0) {
        setQuestions(data);
        setLoading(false);
        setWaiting(false);
        setError(false);
      } else {
        setWaiting(true);
        setError(true);
      }
    } else {
      setWaiting(true);
    }
```

Next work is done on the main return in App.js to deconstruct the desired data properties and return the modal.
```React
  const { question, incorrect_answers, correct_answer } = questions[0];
  const answers = [...incorrect_answers, correct_answer];

  return (
    <main>
      <Modal />
    </main>
  );
```

Next the return is further built out. dangerouslySetInnerHTML is used to convert the HTML to a string.
```React
return (
    <main>
      {/* <Modal /> */}
      <section className="quiz">
        <p className="correct-answers">
          correct answers: {correct}/{index}
        </p>
        <article className="container">
          <h2 dangerouslySetInnerHTML={{ __html: question }} />
          <div className="btn-container">
            {answers.map((answer, index) => {
              return (
                <button
                  key={index}
                  className="answer-btn"
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              );
            })}
```

Next the next question button is added.
```React
        <button className="next-question">next question</button>
```

Next dynamically render the question number.
```React
  const { question, incorrect_answers, correct_answer } = questions[index];
```

Next the functionality of the next question button is implemented starting with the nextQuestion function which is also added to the App Provider(not shown).
```React
  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1;
      return index;
    });
  };
```

The nextQuestion function is then imported to the app via the global context (not shown) and then added to the next question button via onClick.
```React
        <button className="next-question" onClick={nextQuestion}>
          next question
        </button>
```

When the last question is reached an error will occur when the next button is clicked. To prvent a conditional is added to nextQuestion().
```React
  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1;
      if (index > questions.length - 1) {
        return 0;
        //open modal
      } else {
        return index;
      }
    });
  };
```

Next the answers will be checked starting with the checkAnswer function which is exported in the App.Provider(not shown) then imported to App.js via global context(not shown).
```React
  const checkAnswer = (value) => {
    if (value) {
      setCorrect((oldState) => oldState + 1);
    }
    nextQuestion();
  };
```

The checkAnswer function is added to each answer button via onClick.
```React
                <button
                  key={index}
                  className="answer-btn"
                  dangerouslySetInnerHTML={{ __html: answer }}
                  onClick={() => checkAnswer(correct_answer === answer)}
                />
 ```
 
 Next the modal is displayed once the end of the questions is reached. This will start by creating the openModal function.
```React
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1;
      if (index > questions.length - 1) {
        return 0;
        openModal();
      } else {
        return index;
      }
    });
  };
  ```
  
  Next closeModal is constructed and exported via the app provider (not shown).
  ```React
  const closeModal = () => {
    setWaiting(true)
    setCorrect(0)
    setIsModalOpen(false)
  }
  ```
  
  Next <Modal /> is uncommented in App.js (not shown) and then the Modal component is worked on.
  ```React
const Modal = () => {
  const { isModalOpen, closeModal, correct, questions } = useGlobalContext();
  return (
    <div
      className={`${
        isModalOpen ? "modal-container isOpen" : "modal-container"
      }`}
    >
      <div className="modal-content">
        <h2>congrats!</h2>
        <p>You answered of questions correctly!</p>
        <button className="close-btn" onClick={closeModal}>
          play again
        </button>
      </div>
    </div>
  );
};
```

Next the functionality is set up to calculate the total number of correct answers once the array's end has been reached.
```React
        <h2>congrats!</h2>
        <p>
          You answered {((correct / questions.length) * 100).toFixed(0)}% of
          questions correctly!
        </p>
 ```
 
 Next the set up form is worked on starting with another state value to control the set up form inputs. The names in the useState object must match exactly with the url parameter values.
 ```React
   const [quiz, setQuiz] = useState({
    amount: 10,
    category: "sports",
    difficulty: "easy",
  });
```

Next the useEffect is deleted and two new functions created in its place then exported via app.provider along with quiz (not shown).
```React
const handleChange = (e) => {
console.log(e);

}

const handleSubmit = (e) => {
  e.preventDefault()
```

Next the setup form component is worked on.
```React
const SetupForm = () => {
  const { quiz, handleChange, handleSubmit, error } = useGlobalContext();
  return (
    <main>
      <section className="quiz quiz-small">
        <form className="setup-form">
          {/*amount*/}
          <div className="form-control">
            <label htmlFor="amount">nuber of questions</label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={quiz.amount}
              onChange={handleChange}
              className="form-input"
              min={1}
              max={50}
            />
          </div>
        </form>
      </section>
    </main>
  );
};
```

Next error handling is done and the start button are implemented.
```React
          {error && (
            <p className="error">
              can't generate questions, please try different options!
            </p>
          )}
          <button type="submit" onClick={handleSubmit} className="submit-btn">
            start
          </button>
```

Next the two select inputs are set up.
```React
  {/*category*/}
          <div className="form-control">
            <label htmlFor="category">category</label>
            <select
              name="category"
              id="category"
              className="form-input"
              value={quiz.category}
              onChange={handleChange}
            >
              <option value="sports">sports</option>
              <option value="history">history</option>
              <option value="politics">politics</option>
            </select>
          </div>

  {/*difficulty*/}
          <div className="form-control">
            <label htmlFor="difficulty">difficulty</label>
            <select
              name="difficulty"
              id="difficulty"
              className="form-input"
              value={quiz.difficulty}
              onChange={handleChange}
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>
```


Next the functionality of the handleChange function is edded.
```React
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // console.log(name, value);
    setQuiz({ ...quiz, [name]: value });
  };
```

Next new questions are fetched on form submission.
```React
  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, category, difficulty } = quiz;
    const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category${table[category]}&type=multiple`;
    fetchQuestions(url);
  };
 ```
 
 Lastly, the correct answer is randomized instead of always being at the end of the array.
 ```React
   let answers = [...incorrect_answers];
  const tempIndex = Math.floor(Math.random() * 4);
  // console.log(tempIndex);
  if (tempIndex === 3) {
    answers.push(correct_answer);
  } else {
    answers.push(answers[tempIndex]);
    answers[tempIndex] = correct_answer;
  }
```


***End walkthrough
