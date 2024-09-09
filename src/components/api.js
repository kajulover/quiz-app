// api.js
export const fetchQuestions = async () => {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Failed to fetch quiz questions", error);
    return [];
  }
};
